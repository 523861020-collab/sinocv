import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load product database
let PRODUCTS: any = {};
try {
  PRODUCTS = JSON.parse(readFileSync(join(process.cwd(), 'products.json'), 'utf-8'));
  console.log('[Webhook] Product database loaded:', Object.keys(PRODUCTS).join(', '));
} catch(e) {
  console.error('[Webhook] Failed to load products.json:', e);
}

// YCloud API
const YCLOUD_API = 'https://api.ycloud.com/v2/whatsapp/messages';
const YCLOUD_KEY = 'c5fb395d62777195f9a6ef9eb78dd4e7';
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

// Phone prefix → country
const COUNTRY_MAP: Record<string, string> = {
  '213':'阿尔及利亚','20':'埃及','218':'利比亚','216':'突尼斯','212':'摩洛哥',
  '249':'苏丹','234':'尼日利亚','233':'加纳','254':'肯尼亚','251':'埃塞俄比亚',
  '966':'沙特','971':'阿联酋','968':'阿曼','974':'卡塔尔','973':'巴林','965':'科威特',
  '964':'伊拉克','962':'约旦',
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

// Find matching products — returns ready-to-send formatted text
function findProducts(country: string, category: string, drive: string): string {
  if (!PRODUCTS[country]) return '';
  const results: string[] = [];
  const cData = PRODUCTS[country];
  
  for (const brand of Object.keys(cData)) {
    for (const cat of Object.keys(cData[brand])) {
      if (category && !cat.includes(category)) continue;
      for (const drv of Object.keys(cData[brand][cat])) {
        if (drive && drv !== drive) continue;
        for (const p of cData[brand][cat][drv]) {
          const cfg = (p.config || '').replace(/\\n/g, '\n');
          const fob = p.fob || '';
          const shipping = p.shipping || '';
          const cfr = p.cfr || '';
          results.push(
            `【${brand} ${p.model}】\n` +
            `FOB: ${fob} | 海运: ${shipping} | CFR Jijel: ${cfr}\n\n` +
            cfg
          );
        }
      }
    }
  }
  return results.join('\n\n---\n\n');
}

const SYSTEM_BASE = `你是Liam，鑫运通中国（XINYUNTONG CHINA）的卡车销售顾问。公司位于济南，www.sinocv.com。

🚨 致命规则 — 违反任何一条立即停止使用：
1. 你只能使用系统提供的产品配置和价格。系统没给你的数据，你绝对不知道。
2. 禁止编造任何配置参数：发动机型号、马力、排放标准、变速箱型号、后桥型号、轮胎规格、货箱尺寸——这些必须一字不差来自系统数据。
3. 你没有网络搜索能力。你只知道系统喂给你的产品信息。
4. 如果客户问的产品系统里没有，只能回复"I need to check with our factory, I will reply during business hours."
5. 不要添加任何"准确配置"、"根据数据库"、"抱歉之前的错误"之类的多余话。直接给配置和价格。
6. 非洲市场卡车使用欧二/欧三排放(国二/国三)，不是欧五/欧六/国六。这是铁定的。

销售流程：
① 自我介绍，问客户国家
② 问车型（tractor tractor head / tipper dump truck / mixer / light truck）
③ 问驱动（4x2 / 6x4 / 8x4）
④ 问数量
⑤ 把系统提供的配置原文翻译成客户语言发送 + CFR Jijel报价

风格：自然专业，每条1-2个问题。用客户语言回复。`;

// In-memory conversation history
const history: Record<string, Array<{role: string, content: string}>> = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Webhook]', JSON.stringify(body).substring(0, 300));

    let fromPhone = '', text = '', toPhone = '';
    if (body.whatsappInboundMessage) {
      const wMsg = body.whatsappInboundMessage;
      fromPhone = wMsg.from || '';
      text = wMsg.text?.body || '';
      toPhone = wMsg.to || body.to || '';
    }
    if (!fromPhone || !text) {
      return NextResponse.json({ status: 'ignored', reason: 'no text' });
    }

    // 🧪 测试模式：仅回复李善龙的号码，其他全部忽略
    if (fromPhone !== '+8613001977959' && fromPhone !== '8613001977959') {
      console.log('[Webhook] 测试模式，忽略非管理员消息 from:', fromPhone);
      return NextResponse.json({ status: 'ignored', reason: 'test mode - admin only' });
    }

    // Rate limit
    if (!history[fromPhone]) history[fromPhone] = [];
    history[fromPhone].push({ role: 'user', content: text });
    if (history[fromPhone].length > 20) history[fromPhone] = history[fromPhone].slice(-20);
    if (history[fromPhone].filter(m => m.role === 'user').length > 10) {
      return NextResponse.json({ status: 'ignored', reason: 'rate limit' });
    }

    const country = detectCountry(fromPhone);

    // CRM lookup
    let crmCtx = '';
    try {
      const { Pool } = await import('pg');
      const pool = new Pool({ host:'localhost', database:'sinocv_crm', user:'sinocv', password:'crm2025pass', statement_timeout:5000 });
      const clean = fromPhone.replace(/[^\d+]/g, '');
      const r = await pool.query('SELECT name,country,level,notes FROM contacts WHERE phone=$1 OR phone=$2 LIMIT 1', [clean, '+' + clean.replace(/^\+/,'')]);
      if (r.rows.length > 0) {
        const c = r.rows[0];
        crmCtx = `CRM: 客户=${c.name}, 国家=${c.country}, 等级=${c.level}, 备注=${c.notes?.substring(0,150)}`;
      } else {
        crmCtx = '新客户';
      }
      await pool.end();
    } catch(e) { crmCtx = 'CRM不可用'; }

    // Build AI context with product data
    // Step 1: detect what customer is asking for and find matching products
    let productReply = '';  // If set, this is sent directly (AI only translates)
    const lowerText = text.toLowerCase();
    
    if (country === '阿尔及利亚') {
      let category = '', drive = '';
      if (lowerText.includes('tractor') || lowerText.includes('牵引') || lowerText.includes('sitrak') || lowerText.includes('汕德卡')) category = '牵引车';
      else if (lowerText.includes('tipper') || lowerText.includes('dump') || lowerText.includes('自卸')) category = '自卸车';
      else if (lowerText.includes('mixer') || lowerText.includes('搅拌')) category = '搅拌车';
      else if (lowerText.includes('tanker') || lowerText.includes('水罐') || lowerText.includes('洒水')) category = '洒水车';
      else if (lowerText.includes('crane') || lowerText.includes('随车吊')) category = '随车吊';
      else if (lowerText.includes('fuel') || lowerText.includes('油罐')) category = '油罐车';
      else if (lowerText.includes('light') || lowerText.includes('轻卡')) category = '轻卡';
      
      if (lowerText.includes('8x4')) drive = '8×4';
      else if (lowerText.includes('6x4')) drive = '6×4';
      else if (lowerText.includes('4x2')) drive = '4×2';
      
      if (category) {
        const matched = findProducts('阿尔及利亚', category, drive);
        if (matched) {
          // Products found — format as ready-to-send message, AI only translates
          productReply = matched;
          console.log(`[Webhook] Matched ${category} ${drive}: ${matched.length} chars`);
        }
      }
    }
    
    // Step 2: if products matched, just ask AI to translate. Otherwise normal conversation.
    let aiMessages: Array<{role: string, content: string}>;
    
    if (productReply) {
      aiMessages = [
        { role:'system', content: `你是翻译助手。把以下产品配置翻译成客户的语言（看客户用什么语言就翻译成什么语言）。逐字翻译，禁止修改任何参数、价格、数字。不要添加任何解释或问候。直接输出翻译结果。

产品原文：
${productReply}` },
        { role:'user', content: text },
      ];
    } else {
      // Normal conversation mode — no product data
      const contextMsg = crmCtx + '。客户国家: ' + (country || '未知') + '。' + 
        (country === '阿尔及利亚' 
          ? '阿尔及利亚产品涵盖：牵引车/自卸车/搅拌车/洒水车/随车吊/油罐车/轻卡。先问客户要什么类型、什么驱动、多少数量，再匹配产品。'
          : '非阿尔及利亚客户，了解需求即可，不报价。');
      
      aiMessages = [
        { role:'system', content: SYSTEM_BASE },
        { role:'system', content: contextMsg },
        ...history[fromPhone],
      ];
    }

    if (!DEEPSEEK_KEY) {
      return NextResponse.json({ status: 'error', error: 'DEEPSEEK_API_KEY not set' }, { status: 500 });
    }

    const msgs = aiMessages;
    const ai = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${DEEPSEEK_KEY}` },
      body: JSON.stringify({ model:'deepseek-v4-flash', messages: msgs, max_tokens: 1500, temperature: 0.3 }),
    });
    const aiData: any = await ai.json();
    const reply = aiData.choices?.[0]?.message?.content?.trim() || '';
    if (!reply) {
      console.log('[Webhook] AI empty reply, raw:', JSON.stringify(aiData).substring(0, 200));
      return NextResponse.json({ status: 'ignored', reason: 'empty reply' });
    }

    console.log(`[Webhook] ${fromPhone} (${country}): "${text.substring(0,80)}" → "${reply.substring(0,80)}"`);
    history[fromPhone].push({ role: 'assistant', content: reply });

    await fetch(YCLOUD_API, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'X-API-Key': YCLOUD_KEY },
      body: JSON.stringify({ from: toPhone, to: fromPhone, type:'text', text:{ body: reply } }),
    });

    return NextResponse.json({ status:'ok' });
  } catch(e: any) {
    console.error('[Webhook] Error:', e.message);
    return NextResponse.json({ status:'error', error:e.message }, { status:500 });
  }
}
