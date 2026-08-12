// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const YCLOUD_API = 'https://api.ycloud.com/v2/whatsapp/messages';
const YCLOUD_KEY = process.env.YCLOUD_API_KEY || 'c5fb395d62777195f9a6ef9eb78dd4e7';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || 'sk-6a8e3d15cad947059848d910de8fe10f';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

let PRODUCTS: any = {};
try { PRODUCTS = JSON.parse(readFileSync(join(process.cwd(), 'products.json'), 'utf-8')); }
catch(e) { console.error('[Webhook] products.json load error:', e); }

const COUNTRY_MAP: Record<string, string> = {
  '213':'阿尔及利亚','20':'埃及','218':'利比亚','216':'突尼斯','212':'摩洛哥',
  '249':'苏丹','234':'尼日利亚','233':'加纳','254':'肯尼亚','251':'埃塞俄比亚',
  '966':'沙特','971':'阿联酋','968':'阿曼','974':'卡塔尔','973':'巴林','965':'科威特',
  '964':'伊拉克','962':'约旦','260':'赞比亚','263':'津巴布韦','255':'坦桑尼亚',
  '86':'中国','44':'英国','33':'法国','49':'德国','7':'俄罗斯','1':'美国/加拿大',
};

function detectCountry(phone: string): string {
  const clean = phone.replace(/[^\d]/g, '');
  for (let len = 3; len >= 1; len--) {
    const prefix = clean.substring(0, len);
    if (COUNTRY_MAP[prefix]) return COUNTRY_MAP[prefix];
  }
  return '';
}

async function getApiProducts(): Promise<Record<string, any>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const r = await fetch(baseUrl + '/api/products?t=' + Date.now());
    const d = await r.json();
    return d.products || {};
  } catch(e) { console.error('[Webhook] Product fetch error:', e); }
  return {};
}

const SYSTEM_PROMPT = "You are Liam (李亚姆), truck sales at XINYUNTONG CHINA. You ONLY sell heavy trucks, tractors, dump trucks, concrete mixers, trailers, construction machinery — NEVER mention bicycles, cars, motorcycles. After customer answers quantity, the price quote will appear — do NOT say 'let me calculate'. Always address as 'sir'. Match customer language. 1-2 sentences max. NEVER invent prices or brands.";

const inMemoryHistory: Record<string, Array<{ role: string; content: string }>> = {};
const inMemoryProduct: Record<string, { brand: string; model: string; fob: string; shipping: string; country: string }> = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let fromPhone = '', text = '', toPhone = '';
    if (body.whatsappInboundMessage) {
      fromPhone = body.whatsappInboundMessage.from || '';
      text = body.whatsappInboundMessage.text?.body || '';
      toPhone = body.whatsappInboundMessage.to || body.to || '';
      // 检测图片/视频消息
      const mediaType = body.whatsappInboundMessage.type || '';
      const mediaUrl = body.whatsappInboundMessage.image?.url || body.whatsappInboundMessage.video?.url || '';
      if ((mediaType === 'image' || mediaType === 'video') && mediaUrl) {
        // 转发给管理员
        const forwardMsg = `📩 客户 ${fromPhone} 发来${mediaType==='image'?'图片':'视频'}：\n${mediaUrl}`;
        await sendMsg(toPhone, '8613001977959', forwardMsg);
        // 回复客户
        const reply = 'sir，收到您的照片了，我确认后马上回复您。';
        await sendMsg(toPhone, fromPhone, reply);
        return NextResponse.json({ status:'ok', mode:'media_forwarded' });
      }
    }
    if (!fromPhone || !text) return NextResponse.json({ status:'ignored', reason:'no text' });

    // TEST MODE: admin + test customer
    const isAdmin = fromPhone === '+8613001977959' || fromPhone === '8613001977959' || fromPhone === '+8616601052225' || fromPhone === '8616601052225' || fromPhone === '16601052225';
    if (!isAdmin) return NextResponse.json({ status:'ignored', reason:'test mode' });

    let country = detectCountry(fromPhone) || '阿尔及利亚';
    if (country === '中国') country = '阿尔及利亚'; // test mode default

    if (!inMemoryHistory[fromPhone]) inMemoryHistory[fromPhone] = [];
    
    // 防重复：5秒内相同消息跳过
    const lastMsg = inMemoryHistory[fromPhone].slice(-1)[0];
    if (lastMsg && lastMsg.role === 'user' && lastMsg.content === text) {
      const now = Date.now();
      const prev = inMemoryHistory[fromPhone].slice(-3)[0];
      if (prev && prev.t && (now - prev.t) < 5000) {
        return NextResponse.json({ status: 'ignored', reason: 'duplicate' });
      }
      prev && (prev.t = now);
    }
    inMemoryHistory[fromPhone].push({ role:'user', content:text });
    if (inMemoryHistory[fromPhone].length > 30) inMemoryHistory[fromPhone] = inMemoryHistory[fromPhone].slice(-30);

    // CRM lookup via API
    let crmCtx = '';
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const r2 = await fetch(baseUrl + '/api/crm?phone=' + encodeURIComponent(fromPhone));
      const d2 = await r2.json();
      const c = d2.contact;
      if (c?.name) crmCtx = 'CRM: '+c.name+', '+(c.country||'')+', level='+(c.level||'C');
    } catch(e) {}

    // Product detection
    const t = text.toLowerCase();
    let category = '', drive = '', brandQuery = '';
    if (t.includes('tractor')||t.includes('牵引')) category = '牵引车';
    else if (t.includes('tipper')||t.includes('dump')||t.includes('自卸')) category = '自卸车';
    else if (t.includes('mixer')||t.includes('搅拌')) category = '搅拌车';
    else if (t.includes('cargo')||t.includes('载货')) category = '载货车';
    else if (t.includes('loader')||t.includes('装载')) category = '装载机';
    else if (t.includes('excavator')||t.includes('挖掘')) category = '挖掘机';
    else if (t.includes('crane')||t.includes('起重')||t.includes('吊车')) category = '起重机';
    else if (t.includes('trailer')||t.includes('挂车')||t.includes('半挂')) category = '挂车';
    else if (t.includes('van')||t.includes('面包')||t.includes('view')) category = 'Van';
    else if (t.includes('pickup')||t.includes('皮卡')) category = '皮卡';
    if (t.includes('8x4')||t.includes('8×4')) drive = '8×4';
    else if (t.includes('6x4')||t.includes('6×4')) drive = '6×4';
    else if (t.includes('4x2')||t.includes('4×2')) drive = '4×2';
    if (t.includes('howo')||t.includes('豪沃')||t.includes('sinotruk')) brandQuery = 'howo';
    else if (t.includes('tx')||t.includes('TX')) brandQuery = 'tx';
    else if (t.includes('sitrak')||t.includes('汕德卡')) brandQuery = 'sitrak';
    else if (t.includes('shacman')||t.includes('陕汽')) brandQuery = 'shacman';
    else if (t.includes('xcmg')||t.includes('徐工')) brandQuery = 'xcmg';
 // 马力检测 (如 "540马力", "430hp", "540ps")
 let hpQuery = 0;
 const hpMatch = t.match(/(\d{2,4})\s*(?:马力|hp|ps|匹)/i);
 if (hpMatch) hpQuery = parseInt(hpMatch[1]);

 if (category && drive) {
   console.log('[Webhook] Product search:', category, drive, country, hpQuery||'');
   const allProds = await getApiProducts();
      const results: any[] = [];
      for (const ct of [country]) {
        const brands = allProds[ct] || {};
        // 阿尔及利亚品牌优先级
        const orderedBrands = Object.keys(brands);
        if (country === '阿尔及利亚') {
          const isTractor = category === '牵引车';
          const first = orderedBrands.filter(b => isTractor ? /sitrak|汕德卡/i.test(b) : /tx|howo tx/i.test(b));
          const others = orderedBrands.filter(b => isTractor ? !/sitrak|汕德卡/i.test(b) : !/tx|howo tx/i.test(b));
          orderedBrands.length = 0; orderedBrands.push(...first, ...others);
        }
        for (const b of orderedBrands) {
          if (brandQuery) { const bl = b.toLowerCase(); if (bl.indexOf(brandQuery) < 0) continue; }
          for (const cat of Object.keys(brands[b] || {})) {
            if (!cat.includes(category)) continue;
            for (const drv of Object.keys(brands[b][cat] || {})) {
              const nd = drv.replace(/×/g,'x');
              if (nd !== drive.replace(/×/g,'x')) continue;
              for (const p of (brands[b][cat][drv] || [])) {
                // 马力过滤：必须匹配 "540马力" / "430hp" 等格式
                  if (hpQuery > 0) {
                    const cfg = ((p.config||p.engine||'') + ' ' + (p.model||p.name||'')).toLowerCase();
                    const hpPat = new RegExp(String(hpQuery) + '\\s*(?:马力|hp|ps|匹)', 'i');
                    if (!hpPat.test(cfg)) continue;
                  }
                results.push({ brand:b, model:p.model||p.name||'', fob:p.fob||'0', shipping:p.shipping||'0', cfr:p.cfr||'0', config:(p.config||p.engine||'').replace(/\\\\n/g,'\\n'), images:p.images||[], country:ct, _raw:p });
                if (results.length >= 5) break; // collect up to 5, then sort
              }
              if (results.length >= 1) break;
            }
            if (results.length >= 1) break;
          }
          if (results.length >= 1) break;
        }
        if (results.length >= 1) break;
      }
      if (results.length > 0) {
        // 阿尔及利亚 SITRAK 牵引车优先钢板悬架
        if (country === '阿尔及利亚' && /sitrak|汕德卡/i.test(results[0].brand) && category === '牵引车') {
          results.sort((a: any, b: any) => {
            const aSteel = (a.config||'').includes('钢板'); const bSteel = (b.config||'').includes('钢板');
            const aAir = (a.config||'').includes('空气'); const bAir = (b.config||'').includes('空气');
            if (aSteel && !bSteel) return -1; if (!aSteel && bSteel) return 1;
            return 0;
          });
        }
        const p = results[0];
        inMemoryProduct[fromPhone] = { brand: p.brand, model: p.model, fob: p.fob, shipping: p.shipping, cfr: p.cfr || '0', country: country };
        console.log('[Webhook] Matched:', p.brand, p.model, 'HP filter:', hpQuery);
        const msg = formatOneProduct(p, country);
        await sendMsg(toPhone, fromPhone, msg);
        // 发送产品照片
        const imgs = p.images || [];
        for (const img of imgs) {
          if (img) await sendImage(toPhone, fromPhone, img);
        }
        inMemoryHistory[fromPhone].push({ role:'assistant', content:msg });
        // 单独发一句确认语
        const confirm = `sir，这款${category}可以满足你的需求吗？`;
        inMemoryHistory[fromPhone].push({ role:'assistant', content:confirm });
        await sendMsg(toPhone, fromPhone, confirm);
        return NextResponse.json({ status:'ok', mode:'product', count:1 });
      }
      // 有车型+驱动但没匹配到 → 非常规配置
      if (results.length === 0) {
        const noMatch = hpQuery > 0
          ? `抱歉 sir，${hpQuery}马力的${category}不是常规配置，我需要查询并重新核算价格，稍后回复您。`
          : `抱歉 sir，${drive} ${category}目前没有常规库存，我需要查询确认，稍后回复您。`;
        inMemoryHistory[fromPhone].push({ role:'assistant', content:noMatch });
        await sendMsg(toPhone, fromPhone, noMatch);
        return NextResponse.json({ status:'ok', mode:'no_match' });
      }
    }

    // AI fallback
    if (!DEEPSEEK_KEY) return NextResponse.json({ status:'error', error:'no key' }, { status:500 });
    
    const step = inMemoryHistory[fromPhone].length;
    
    // 数量检测 → 直接报价（支持 "1台" "一台" "购买一台" "要3台"）
    const qtyMatch2 = text.match(/(\d{1,3}|一|二|三|四|五|六|七|八|九|十)\s*(?:台|辆|units?|pcs?)?$/i);
    if (qtyMatch2 && step >= 5) {
      const cn = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
      const qty = parseInt(qtyMatch2[1]) || cn[qtyMatch2[1]] || 1;
      if (qty >= 1 && qty <= 100) {
        const saved = inMemoryProduct[fromPhone];
        if (saved && saved.fob) {
          const rawFob = parseInt(String(saved.fob).replace(/[$,]/g, '')) || 0;
          const rawShipping = parseInt(String(saved.shipping).replace(/[$,]/g, '')) || 0;
          // 计算正确价格
          let finalPrice = rawFob;
          let priceLabel = 'FOB';
          const brand = (saved.brand||'').toLowerCase();
          const isTruck = brand.includes('howo')||brand.includes('sitrak')||brand.includes('shacman')||brand.includes('重汽')||brand.includes('陕汽');
          const isXCMG = brand.includes('xcmg')||brand.includes('徐工');
          const isVan = brand.includes('foton')||brand.includes('福田')||brand.includes('iveco')||brand.includes('依维柯');
          const ct = (saved.country||country);
          if (ct === '阿尔及利亚') {
            // 重汽/陕汽等直接用服务器指导价 CFR
            const rawCfr = parseInt(String(saved.cfr||'0').replace(/[$,]/g, '')) || 0;
            if (isTruck && rawCfr > 0) { finalPrice = rawCfr; priceLabel = 'CFR Jijel'; }
            else if (isTruck) { finalPrice = rawFob + rawShipping; priceLabel = 'CFR Jijel'; }
            else if (isXCMG) { finalPrice = rawFob + 1500; }
            else { finalPrice = Math.round(rawFob * 1.1); }
          } else if (ct === '埃塞俄比亚') {
            if (isXCMG) { finalPrice = rawFob + 1500; }
            else { finalPrice = Math.round(rawFob * 1.1); }
          } else {
            if (isTruck) { finalPrice = rawFob + 1000; }
            else if (isXCMG) { finalPrice = Math.round(rawFob * 0.91 + 2000); }
            else if (isVan) { finalPrice = rawFob + 500; }
            else { finalPrice = rawFob + 1000; }
          }
          finalPrice = roundUp(finalPrice);
          const total = finalPrice * qty;
          const quote = `sir，${saved.brand} ${saved.model} 的价格如下：\n\n💰 单价 ${priceLabel}: $${finalPrice.toLocaleString()}\n💰 ${qty}台总价: $${total.toLocaleString()}\n\n确认购买的话我为您准备 PI。`;
          inMemoryHistory[fromPhone].push({ role:'assistant', content:quote });
          await sendMsg(toPhone, fromPhone, quote);
          return NextResponse.json({ status:'ok', mode:'quote' });
        }
      }
    }
    
    // Step 1: 打招呼
    if (step === 1) {
      const greeting = '你好先生，我叫李亚姆，来自中国，请问您怎么称呼？';
      inMemoryHistory[fromPhone].push({ role:'assistant', content:greeting });
      await sendMsg(toPhone, fromPhone, greeting);
      return NextResponse.json({ status:'ok', mode:'greeting' });
    }
    
    // Step 2: 问国家
    if (step === 3) {
      const askCountry = `好的 sir，你来自哪个国家？`;
      inMemoryHistory[fromPhone].push({ role:'assistant', content:askCountry });
      await sendMsg(toPhone, fromPhone, askCountry);
      return NextResponse.json({ status:'ok', mode:'ask_country' });
    }
    
    // Step 3: 问需求
    if (step === 5) {
      const askNeed = 'sir，你想了解什么卡车？准备运输什么货物？大概多少吨？';
      inMemoryHistory[fromPhone].push({ role:'assistant', content:askNeed });
      await sendMsg(toPhone, fromPhone, askNeed);
      return NextResponse.json({ status:'ok', mode:'ask_need' });
    }
    
    // 后续步骤 → AI 继续
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10秒超时
    let ai: Response;
    try {
      ai = await fetch(DEEPSEEK_URL, {
        method:'POST',
        signal: controller.signal,
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+DEEPSEEK_KEY },
      body:JSON.stringify({ model:'deepseek-v4-flash', messages:[
        { role:'system', content:SYSTEM_PROMPT },
        { role:'system', content:'Customer country: '+country+'. '+crmCtx },
        ...inMemoryHistory[fromPhone].slice(-12)
      ], max_tokens:600, temperature:0.3 }),
      });
      clearTimeout(timeout);
    } catch(e: any) {
      return NextResponse.json({ status: 'error', error: 'AI timeout' });
    }
    let reply = '';
    // Retry once if AI returns empty
    for (let retry = 0; retry < 2; retry++) {
      const aiData: any = await ai.json();
      reply = aiData.choices?.[0]?.message?.content?.trim() || '';
      if (reply) break;
      if (retry === 0) {
        inMemoryHistory[fromPhone].pop(); // Remove user msg added before AI
        const retryRes = await fetch(DEEPSEEK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
          body: JSON.stringify({ model: 'deepseek-v4-flash', messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'system', content: 'Customer country: ' + country + '. ' + crmCtx },
            ...inMemoryHistory[fromPhone].slice(-12)
          ], max_tokens: 600, temperature: 0.3 }),
        });
        const rd: any = await retryRes.json();
        reply = rd.choices?.[0]?.message?.content?.trim() || '';
        if (reply) inMemoryHistory[fromPhone].push({ role: 'user', content: text });
      }
    }
    if (!reply) return NextResponse.json({ status: 'ignored', reason: 'empty reply' });
    console.log('[Webhook] AI reply:', reply.substring(0, 80));
    inMemoryHistory[fromPhone].push({ role:'assistant', content:reply });
    await sendMsg(toPhone, fromPhone, reply);
    return NextResponse.json({ status:'ok', mode:'ai' });
  } catch(e: any) {
    console.error('[Webhook]', e.message);
    return NextResponse.json({ status:'error', error:e.message }, { status:500 });
  }
}

function formatOneProduct(p: any, country: string): string {
  let txt = '🚛 *' + p.brand + ' ' + p.model + '*\n';
  const cfg = (p.config || '')
    .replace(/(?:\\n)?(?:阿尔及利亚|赞比亚|埃塞俄比亚|加纳|尼日利亚|利比里亚|刚果金|坦桑尼亚|津巴布韦|喀麦隆|几内亚|苏丹|沙特|利比亚)[^\\n]*/g, '')
    .replace(/FOB\s*:?\s*\$?[\d,]+/gi, '')
    .replace(/CFR\s*:?\s*\$?[\d,]+/gi, '')
    .replace(/\$[\d,]+/g, '')
    .replace(/Ship(?:ping)?\s*:?\s*\$?[\d,]+/gi, '')
    .trim();
  if (cfg) txt += '⚙️ ' + cfg + '\n';
  if (!(p.images||[]).length) txt += '📷 _photos pending_\n';
  txt += '\nsir，这辆车符合你的需求吗？';
  return txt;
}

function roundUp(price: number): number {
  if (price <= 0) return price;
  const mag = price >= 100000 ? 100 : price >= 10000 ? 100 : price >= 1000 ? 10 : 1;
  return Math.ceil(price / mag) * mag;
}

async function sendMsg(to: string, from: string, text: string) {
  try {
    await fetch(YCLOUD_API, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-API-Key':YCLOUD_KEY }, body:JSON.stringify({ from:to, to:from, type:'text', text:{ body:text } }) });
  } catch(e) {}
}

async function sendImage(to: string, from: string, imageUrl: string) {
  try {
    const r = await fetch(YCLOUD_API, { method:'POST', headers:{ 'Content-Type':'application/json', 'X-API-Key':YCLOUD_KEY }, body:JSON.stringify({ from:to, to:from, type:'image', image:{ link:imageUrl } }) });
    const txt = await r.text();
    console.log('[Webhook] Image sent:', r.status, txt.substring(0, 100));
  } catch(e: any) { console.error('[Webhook] Image error:', e.message); }
}
