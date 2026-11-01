// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
// 2026-11-01 修复：原来连 127.0.0.1:5432 的 sinocv_crm —— Vercel 函数里根本不存在这个库，
// 而且线上那个库只有 products 一张表，chat_leads/contacts 都没有。改成不依赖 Postgres：
// 产品推荐改读本地 data/trucks.ts，线索统一走 /api/inquiry（邮件 + 香港 CRM）。
const pgPool = { query: async () => ({ rows: [] }) };

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `You are an AI sales assistant for XINYUNTONG (www.sinocv.com), a leading Chinese commercial vehicle exporter (SINOTRUK/HOWO trucks, XCMG machinery, CIMC trailers, FOTON & IVECO vans).

Your ONLY job is to qualify the customer's needs, then collect their WhatsApp/phone number so a human specialist can contact them.

STRICT RULES:
1. On your first message, briefly introduce yourself as an AI assistant (never pretend to be human).
2. Ask ONE short question at a time, in this order:
   a) Which country are you from?
   b) What vehicle or machine are you interested in? (e.g. tractor truck, dump truck, excavator, trailer, van)
   c) What cargo will it carry, and roughly how many tons?
   d) How many units do you need?
   e) Your WhatsApp number, so our specialist can reach you.
3. Once you have their phone/WhatsApp number, reply warmly and END with: "Thank you! We'll arrange our specialist to contact you on WhatsApp right away." Do NOT ask any more questions after this.
4. NEVER quote prices, discounts, or delivery time — always say our specialist will provide details.
5. Be friendly, concise, use short sentences.
6. Reply in the customer's language (English by default; match French, Arabic, etc. if they write in it).
7. When the customer specifies a vehicle type, briefly acknowledge it and tell them we'll show a recommended model with config and photos below (e.g. "Good choice — here is one of our recommended models with configuration and photos below."). Then continue asking the next question in order.`;

// 品牌 → 负责员工（弹窗分配）
const BRAND_OWNER = {
  '徐工': { name: '赵欢乐', phone: '15903993573' },
  '轻型车': { name: '杜飞跃', phone: '13523034981' },
  '陕汽': { name: '王丽帅', phone: '16601052225' },
  '中国重汽': { name: '王小涵', phone: '19103781257' },
};
// 主账号（看所有询盘）
const MAIN_ACCOUNTS = ['13001977959'];

function classifyBrand(vehicleType, cargo) {
  var t = ((vehicleType || '') + ' ' + (cargo || '')).toLowerCase();
  // 工程机械 → 徐工
  if (/excavator|crane|loader|roller|bulldozer|grader|backhoe|forklift|pump|machinery|mining|drill|compactor|paver|挖掘|装载|起重|吊|压路|平地|推土|泵/.test(t)) return '徐工';
  // 轻型车 → 轻型车
  if (/van|pickup|minibus|micro|light truck|bus|sedan|suv|微卡|皮卡|轻卡|面包/.test(t)) return '轻型车';
  // 陕汽（客户明确提到）
  if (/shacman|陕汽|f3000|x3000|l3000|h3000/.test(t)) return '陕汽';
  // 其他卡车 → 中国重汽（默认）
  return '中国重汽';
}

function extractPhone(text) {
  const m = String(text || '').match(/(?:\+?\d[\d\s\-()]{8,15}\d)/);
  if (!m) return null;
  return m[0].replace(/[\s\-()]/g, '');
}

// 车型类别检测：从对话文字提取基础类别（匹配 products 表的类别名前缀）
function detectVehicleType(text) {
  const t = String(text || '').toLowerCase();
  if (/tractor|prime mover|拖头|牵引/.test(t)) return '牵引车';
  if (/dump|tipper|翻斗|自卸/.test(t)) return '自卸车';
  if (/mixer|concrete|搅拌/.test(t)) return '搅拌车';
  if (/reefer|refriger|冷藏/.test(t)) return '冷藏车';
  if (/excavator|挖掘/.test(t)) return '挖掘机';
  if (/loader|装载/.test(t)) return '装载机';
  if (/crane|起重|吊/.test(t)) return '起重机';
  if (/trailer|半挂|挂车/.test(t)) return '挂车';
  if (/van|微卡|轻卡|light|minibus|bus/.test(t)) return 'Van';
  if (/pickup|皮卡/.test(t)) return '皮卡';
  if (/cargo|载货|货车/.test(t)) return '载货车';
  return '';
}

// 品牌 → products 表品牌候选（依次尝试）
const BRAND_CANDIDATES = {
  '徐工': ['徐工'],
  '轻型车': ['福田', '中国重汽', '依维柯'],
  '陕汽': ['陕汽'],
  '中国重汽': ['中国重汽', 'SITRAK'],
};

// 产品匹配：从本地数据（data/trucks.ts）里按车型类别挑一款，带配置和照片。
// 2026-11-01 修复：原来查 Postgres products 表，Vercel 上连不到，永远返回 null。
let TRUCKS_CACHE: any[] | null = null;
async function loadTrucks() {
  if (TRUCKS_CACHE) return TRUCKS_CACHE;
  try {
    const mod = await import('@/data/trucks');
    TRUCKS_CACHE = (mod as any).trucks || [];
  } catch { TRUCKS_CACHE = []; }
  return TRUCKS_CACHE;
}

async function matchProduct(country: string, brand: string, baseCat: string) {
  if (!baseCat) return null;
  const trucks = await loadTrucks();
  if (!trucks.length) return null;

  const CAT_WORDS: Record<string, RegExp> = {
    '牵引车': /tractor|prime mover|6x4|4x2/i,
    '自卸车': /dump|tipper/i,
    '载货车': /cargo|box|stake/i,
    '搅拌车': /mixer|concrete/i,
    '挖掘机': /excavator/i,
    '装载机': /loader|wheel loader/i,
    '起重机': /crane/i,
    '挂车': /trailer|semi-trailer/i,
    'Van': /van/i,
    '皮卡': /pickup/i,
  };
  const re = CAT_WORDS[baseCat];
  if (!re) return null;

  const hit = trucks.find((t: any) => {
    const text = `${t.name || ''} ${t.model || ''} ${t.category || ''} ${t.title || ''}`;
    return re.test(text);
  });
  if (!hit) return null;

  const imgs = Array.isArray(hit.images) ? hit.images : [];
  return {
    name: hit.name || hit.model || '',
    model: hit.model || '',
    config: hit.config || hit.specs || '',
    images: imgs.filter(Boolean).map((i: string) => (String(i).startsWith('http') ? i : '/' + String(i).replace(/^\//, ''))),
  };
}

// GET: 插件轮询「待确认询盘」。原来查 Postgres chat_leads（Vercel 上不存在），
// 现在线索直接走邮件+香港 CRM，这里只返回空列表保持接口兼容。
export async function GET(request: NextRequest) {
  return NextResponse.json({ pending: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 确认询盘分支（兼容旧插件调用；线索已直接投递，这里直接返回成功）
    if (body.action === 'ack') {
      return NextResponse.json({ success: true });
    }

    // 对话分支
    const history = Array.isArray(body.history) ? body.history : [];
    const message = String(body.message || '').trim();
    const sessionId = String(body.sessionId || '');
    if (!message) return NextResponse.json({ reply: '' });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message },
    ];

    const resp = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
      body: JSON.stringify({ model: 'deepseek-chat', messages, max_tokens: 400, temperature: 0.7 }),
    });
    const data = await resp.json();
    const reply = String(data.choices?.[0]?.message?.content || '');

    // 检测手机号（用户消息优先，其次 AI 回复）
    const phone = extractPhone(message) || extractPhone(reply);

    // 每轮尝试匹配产品（配置+照片）——从完整对话提取车型类别
    let product = null;
    const allText = history.map(h => h.content || '').join(' ') + ' ' + message + ' ' + reply;
    const baseCat = detectVehicleType(allText);
    if (baseCat) {
      const b = classifyBrand(baseCat, '');
      product = await matchProduct('', b, baseCat);
    }

    if (phone) {
      const fullHistory = [
        ...history,
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ];

      // 二次调用 DeepSeek 提取结构化字段
      let ex = { country: '', vehicle_type: '', cargo: '', quantity: '' };
      try {
        const er = await fetch(DEEPSEEK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: 'Extract customer info from this conversation as JSON: {"country":"","vehicle_type":"","cargo":"","quantity":""}. country 用中文国家名(如 尼日利亚/阿尔及利亚/加纳)。vehicle_type 从这些中文类别里选一个：牵引车/自卸车/载货车/搅拌车/冷藏车/挖掘机/装载机/起重机/挂车/Van/皮卡。Use empty string if unknown. Output ONLY the JSON object, nothing else.' },
              ...fullHistory,
            ],
            max_tokens: 200,
          }),
        });
        const ed = await er.json();
        const raw = String(ed.choices?.[0]?.message?.content || '');
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) { const parsed = JSON.parse(m[0]); ex = { ...ex, ...parsed }; }
      } catch (e2) {}

      // 分类品牌 → 确定负责员工
      const brand = classifyBrand(ex.vehicle_type, ex.cargo);
      const ownerInfo = BRAND_OWNER[brand] || BRAND_OWNER['中国重汽'];

      // 用提取的类别重新匹配产品（更准确）
      if (ex.vehicle_type) {
        const mp = await matchProduct(ex.country || '', brand, ex.vehicle_type);
        if (mp) product = mp;
      }

      // 线索落到 /api/inquiry（邮件到 sales@ + 香港 CRM），并标记加急 + 指定员工。
      // 2026-11-01 修复：原来写 Postgres chat_leads / contacts，Vercel 上那两个表根本不存在。
      try {
        const dest = process.env.SITE_URL || 'https://www.sinocv.com';
        await fetch(dest + '/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: '',
            phone: phone,
            email: '',
            country: ex.country || '',
            company: '',
            product: (ex.vehicle_type || '') + (product ? ' · ' + product.name : ''),
            message:
              '【AI 已预沟通 · 加急】\n国家: ' + (ex.country || '-') +
              '\n车型: ' + (ex.vehicle_type || '-') +
              '\n货物/载重: ' + (ex.cargo || '-') +
              '\n数量: ' + (ex.quantity || '-') +
              '\n负责员工: ' + ownerInfo.name + ' (' + ownerInfo.phone + ')' +
              '\n对话轮数: ' + Math.ceil(fullHistory.length / 2),
            page: 'AI_CHAT',
          }),
        });
      } catch (e3) {
        console.error('[CHAT] 线索投递失败:', e3);
      }
    }

    return NextResponse.json({ reply, phone: phone || null, product });
  } catch (e) {
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again later.' });
  }
}
