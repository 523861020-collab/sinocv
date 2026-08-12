// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

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
    
    // Batch mode: replace entire product data
    if (body.batch) {
      const r = await pgPool.query('SELECT id FROM products ORDER BY id DESC LIMIT 1');
      const id = r.rows[0]?.id;
      if (id) {
        await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', 
          [JSON.stringify(body.batch), id]);
      } else {
        await pgPool.query('INSERT INTO products (data) VALUES ($1)', [JSON.stringify(body.batch)]);
      }
      return NextResponse.json({ success: true });
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
    
    data[country][brand][category][drive].push(product);
    
    await pgPool.query('UPDATE products SET data = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(data), r.rows[0].id]);
    return NextResponse.json({ success: true, products: data });
  } catch(e) {
    console.error('Product POST error:', e);
    return NextResponse.json({ success: false, error: String(e) });
  }
}
