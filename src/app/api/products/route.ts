// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import heicDecode from 'heic-decode';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
});

// Ensure products table
pgPool.query(`CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, data JSONB NOT NULL DEFAULT '{}', updated_at TIMESTAMPTZ DEFAULT NOW())`).catch(()=>{});
pgPool.query(`INSERT INTO products (data) SELECT '{}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM products)`).catch(()=>{});

// ─── CONFIG: 插件从服务器拉取，不再硬编码 ───
const APP_CONFIG = {
  categories_by_brand: {
    'HOWO': ['牵引车','自卸车','载货车','搅拌车','油罐车','洒水车','随车吊'],
    'HOWO TX': ['牵引车','自卸车','载货车','搅拌车','油罐车','洒水车','冷藏车','厢式车','随车吊'],
    'HOWO NX': ['牵引车','自卸车','载货车','搅拌车','油罐车','洒水车','冷藏车','厢式车','随车吊'],
    'HOWO T7H': ['牵引车','自卸车','载货车','搅拌车','油罐车','洒水车','冷藏车','厢式车','随车吊'],
    'SITRAK': ['牵引车','自卸车','载货车','搅拌车'],
    '中国重汽': ['牵引车','自卸车','载货车','搅拌车','油罐车/水罐车','垃圾运输车','高空作业车','随车吊','拖车','冷藏车','水泥泵车','消防车','吸污车','Van(重汽)','皮卡(重汽)'],
    '陕汽': ['牵引车','自卸车','载货车','搅拌车','油罐车/水罐车','垃圾运输车','高空作业车','随车吊','拖车','水泥泵车','消防车','吸污车'],
    '徐工': ['装载机','挖掘机','起重机','伸缩臂叉车','两头忙','推土机','平地机','压路机','泵车'],
    '中集': ['平板半挂','自卸半挂','侧帘半挂','厢式半挂','冷藏半挂','液罐半挂','粉罐半挂'],
    '依维柯': ['Van(依维柯)'],
    '福田': ['皮卡','微卡','Van(福田)','载货车'],
    '依维柯': ['Van(依维柯)']
  },
  drives: ['4×2','4×4','6×4','6×6','8×4'],
  light_drives: ['4×2','4×4'],
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const country = url.searchParams.get('country') || '';
    const brand = url.searchParams.get('brand') || '';
    const cat = url.searchParams.get('cat') || '';
    const drive = url.searchParams.get('drive') || '';
    
    const r = await pgPool.query('SELECT data FROM products ORDER BY id DESC LIMIT 1');
    const allData = r.rows[0]?.data || {};
    let result: any = {};
    
    if (!country && !brand && !cat && !drive) {
      return NextResponse.json({ products: allData, config: APP_CONFIG });
    }
    
    // Build result by iterating through the nested structure
    const countries = country ? [country] : Object.keys(allData);
    for (const ct of countries) {
      const ctData = allData[ct];
      if (!ctData) continue;
      const brands = brand ? [brand] : Object.keys(ctData);
      for (const bn of brands) {
        const bnData = ctData[bn];
        if (!bnData) continue;
        const cats = cat ? [cat] : Object.keys(bnData);
        for (const cn of cats) {
          const cnData = bnData[cn];
          if (!cnData) continue;
          const drives = drive ? [drive] : Object.keys(cnData);
          for (const dn of drives) {
            const items = cnData[dn];
            if (!items || !items.length) continue;
            if (!result[ct]) result[ct] = {};
            if (!result[ct][bn]) result[ct][bn] = {};
            if (!result[ct][bn][cn]) result[ct][bn][cn] = {};
            result[ct][bn][cn][dn] = items;
          }
        }
      }
    }
    
    return NextResponse.json({ products: result, config: APP_CONFIG });
  } catch(e) {
    return NextResponse.json({ products: {}, config: APP_CONFIG });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ─── 图片上传接口：base64 → 存文件 → 返回 URL（避免 base64 塞进数据库撑大 JSON）───
    if (body.images && Array.isArray(body.images)) {
      const dir = path.join(process.cwd(), 'public', 'product_photos');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const urls = await Promise.all(body.images.map(async (img) => {
        const m = String(img).match(/^data:image\/(\w+);base64,(.+)$/);
        if (!m) return img;
        const buf = Buffer.from(m[2], 'base64');
        const ext = m[1].toLowerCase();
        const filename = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.jpg';
        try {
          if (ext === 'heic' || ext === 'heif') {
            // HEIC/HEIF：sharp 预编译版无 HEVC 解码器，改用 heic-decode 解码再转 JPG
            const decoded = await heicDecode({ buffer: buf });
            await sharp(Buffer.from(decoded.data), { raw: { width: decoded.width, height: decoded.height, channels: 4 } })
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 80 })
              .toFile(path.join(dir, filename));
          } else {
            // 其他格式（JPG/PNG/WEBP/BMP/GIF等）直接用 sharp 转 JPG
            await sharp(buf).rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80 }).toFile(path.join(dir, filename));
          }
          return '/api/photos/' + filename;
        } catch (e) {
          console.error('图片转换失败，退回原图:', e);
          return img;
        }
      }));
      return NextResponse.json({ success: true, urls: urls });
    }
    
    // Batch mode: 增量合并（保留服务器已有产品，防止多账号全量覆盖互相丢失）
    if (body.batch) {
      const r = await pgPool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
      const id = r.rows[0]?.id;
      const existing = r.rows[0]?.data || {};
      const incoming = body.batch;
      Object.keys(incoming || {}).forEach(function(country){
        if (!existing[country]) existing[country] = {};
        Object.keys(incoming[country] || {}).forEach(function(brand){
          if (!existing[country][brand]) existing[country][brand] = {};
          Object.keys(incoming[country][brand] || {}).forEach(function(cat){
            if (!existing[country][brand][cat]) existing[country][brand][cat] = {};
            Object.keys(incoming[country][brand][cat] || {}).forEach(function(drive){
              var incItems = incoming[country][brand][cat][drive] || [];
              var exItems = existing[country][brand][cat][drive] || [];
              incItems.forEach(function(inc){
                var idx = -1;
                if (inc.id) idx = exItems.findIndex(function(e){ return e && e.id === inc.id; });
                if (idx < 0) {
                  var key = (inc.name || inc.model || '') + '|' + (inc.fob || '');
                  idx = exItems.findIndex(function(e){ return ((e.name || e.model || '') + '|' + (e.fob || '')) === key; });
                }
                if (idx >= 0) exItems[idx] = inc; else exItems.push(inc);
              });
              existing[country][brand][cat][drive] = exItems;
            });
          });
        });
      });
      if (id) {
        await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(existing), id]);
      } else {
        await pgPool.query('INSERT INTO products (data) VALUES ($1)', [JSON.stringify(existing)]);
      }
      return NextResponse.json({ success: true });
    }
    
    // Update mode: 单产品更新（编辑产品，按 id 精确定位，不覆盖其他产品、不因重名混淆）
    if (body.update) {
      const u = body.update;
      const r2 = await pgPool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
      const d2 = r2.rows[0]?.data || {};
      const pid = u.id || '';
      const product = u.product || {};
      const oldC = u.oldCountry, oldB = u.oldBrand, oldCat = u.oldCat, oldDr = u.oldDrive;
      const nc = u.country, nb = u.brand, ncat = u.cat, ndr = u.drive;
      // 从旧位置移除（按 id，无 id 则按 name+fob 兜底）
      if (oldC && d2[oldC] && d2[oldC][oldB] && d2[oldC][oldB][oldCat] && d2[oldC][oldB][oldCat][oldDr]) {
        const arr = d2[oldC][oldB][oldCat][oldDr];
        let idx = -1;
        if (pid) idx = arr.findIndex(function(e){ return e && e.id === pid; });
        if (idx < 0) {
          const k = (product.name || product.model || '') + '|' + (product.fob || '');
          idx = arr.findIndex(function(e){ return ((e.name || e.model || '') + '|' + (e.fob || '')) === k; });
        }
        if (idx >= 0) arr.splice(idx, 1);
      }
      // 加到新位置
      if (!d2[nc]) d2[nc] = {};
      if (!d2[nc][nb]) d2[nc][nb] = {};
      if (!d2[nc][ncat]) d2[nc][ncat] = {};
      if (!d2[nc][ndr]) d2[nc][ndr] = [];
      if (!product.id) product.id = pid || ('p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
      d2[nc][nb][ncat][ndr].push(product);
      await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(d2), r2.rows[0].id]);
      return NextResponse.json({ success: true, products: d2 });
    }
    
    // Delete mode: 按唯一 id 全局搜索删除（产品可能被合并进「非统」或分布在多个国家，
    // 前端删除按钮的 country 只是"搜索时输入的国家"，与产品实际存储位置可能不一致，故全局按 id 精确定位）
    if (body.delete) {
      const d = body.delete;
      const r3 = await pgPool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
      const d3 = r3.rows[0]?.data || {};
      let removed = false;
      const walk = function(handler) {
        Object.keys(d3 || {}).forEach(function(ct){
          Object.keys(d3[ct] || {}).forEach(function(bn){
            Object.keys(d3[ct][bn] || {}).forEach(function(cn){
              Object.keys(d3[ct][bn][cn] || {}).forEach(function(dn){
                const a = d3[ct][bn][cn][dn];
                if (a && Array.isArray(a)) handler(a);
              });
            });
          });
        });
      };
      // 先按 id 删
      if (d.id) {
        walk(function(a){ const i = a.findIndex(function(e){ return e && e.id === d.id; }); if (i >= 0) { a.splice(i, 1); removed = true; } });
      }
      // id 没找到，按 name+fob 兜底（老产品可能无 id）
      if (!removed && (d.name || d.fob)) {
        const k = (d.name || '') + '|' + (d.fob || '');
        walk(function(a){ const i = a.findIndex(function(e){ return ((e.name || e.model || '') + '|' + (e.fob || '')) === k; }); if (i >= 0) { a.splice(i, 1); removed = true; } });
      }
      await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(d3), r3.rows[0].id]);
      return NextResponse.json({ success: true, removed: removed, products: d3 });
    }
    
    const country = body.country;
    const brand = body.brand;
    const category = body.category;
    const drive = body.drive;
    const product = body.product;
    
    // Get current products
    const r = await pgPool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
    let data = r.rows[0]?.data || {};
    
    // Ensure nested structure exists
    if (!data[country]) data[country] = {};
    if (!data[country][brand]) data[country][brand] = {};
    if (!data[country][brand][category]) data[country][brand][category] = {};
    if (!data[country][brand][category][drive]) data[country][brand][category][drive] = [];
    
    // 补唯一 id + 上传人 + 创建时间（只新增不删除，重名也保留）
    if (!product.id) product.id = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    if (product.uploadedBy === undefined || product.uploadedBy === null) product.uploadedBy = body.uploadedBy || '';
    if (!product.createdAt) product.createdAt = new Date().toISOString();
    
    data[country][brand][category][drive].push(product);
    
    await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(data), r.rows[0].id]);
    return NextResponse.json({ success: true, products: data });
  } catch(e) {
    console.error('Product POST error:', e);
    return NextResponse.json({ success: false, error: String(e) });
  }
}
