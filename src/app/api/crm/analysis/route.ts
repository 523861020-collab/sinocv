// @ts-nocheck
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
  statement_timeout: 15000,
  max: 10,
  connectionTimeoutMillis: 5000,
});

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

// 简单内存缓存（5分钟），避免每次登录都调 DeepSeek
let _cache: any = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const force = url.searchParams.get('force') === '1';

  if (_cache && !force && Date.now() - _cacheTime < CACHE_TTL) {
    return NextResponse.json(_cache);
  }

  try {
    // 1. 员工统计
    const empR = await pgPool.query(
      `SELECT assigned_to, count(*) AS total,
         count(*) FILTER (WHERE upper(level)='A') AS a_cnt,
         count(*) FILTER (WHERE upper(level)='B') AS b_cnt
       FROM contacts WHERE assigned_to IS NOT NULL AND assigned_to != ''
       GROUP BY assigned_to ORDER BY total DESC`
    );

    // 2. 每个员工的国家分布（用于取侧重国家）
    const empCountryR = await pgPool.query(
      `SELECT assigned_to, country, count(*) AS cnt
       FROM contacts
       WHERE assigned_to IS NOT NULL AND assigned_to != '' AND country != '' AND country != '未知'
       GROUP BY assigned_to, country`
    );
    const empCountryMap: Record<string, { country: string; cnt: number }[]> = {};
    for (const r of empCountryR.rows) {
      if (!empCountryMap[r.assigned_to]) empCountryMap[r.assigned_to] = [];
      empCountryMap[r.assigned_to].push({ country: r.country, cnt: Number(r.cnt) });
    }

    const employees = empR.rows.map((e: any) => {
      const countries = (empCountryMap[e.assigned_to] || [])
        .sort((a: any, b: any) => b.cnt - a.cnt)
        .slice(0, 4);
      return {
        name: e.assigned_to,
        total: Number(e.total),
        a: Number(e.a_cnt),
        b: Number(e.b_cnt),
        topCountries: countries,
      };
    });

    // 3. 整体国家分布 TOP20
    const countryR = await pgPool.query(
      `SELECT country, count(*) AS cnt FROM contacts
       WHERE country != '' AND country != '未知'
       GROUP BY country ORDER BY cnt DESC LIMIT 20`
    );

    // 4. A级客户国家分布 TOP15
    const aCountryR = await pgPool.query(
      `SELECT country, count(*) AS cnt FROM contacts
       WHERE upper(level)='A' AND country != '' AND country != '未知'
       GROUP BY country ORDER BY cnt DESC LIMIT 15`
    );

    // 5. 总客户数
    const totalR = await pgPool.query(`SELECT count(*) AS total FROM contacts`);

    // 6. AI 分析文字
    let aiAnalysis = '';
    try {
      const prompt = `你是外贸市场分析专家。以下是中国卡车出口公司"鑫运通"的 CRM 客户数据。请用中文做简洁分析（200字以内，直接给结论，分3条）：\n1. 哪些国家需求最旺盛，建议广告投放重点；\n2. 客户画像特点（区域集中度等）；\n3. 一句话战略建议。\n\n员工客户分布：${JSON.stringify(
        employees.map((e) => ({ 负责人: e.name, 客户数: e.total, A级: e.a, B级: e.b }))
      )}\n\n国家客户数TOP20：${JSON.stringify(
        countryR.rows.map((r: any) => ({ 国家: r.country, 客户数: Number(r.cnt) }))
      )}\n\nA级客户国家TOP15：${JSON.stringify(
        aCountryR.rows.map((r: any) => ({ 国家: r.country, A级数: Number(r.cnt) }))
      )}`;

      const resp = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + DEEPSEEK_KEY },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 500, temperature: 0.5 }),
      });
      const data = await resp.json();
      aiAnalysis = String(data.choices?.[0]?.message?.content || '');
    } catch (e) {
      aiAnalysis = '';
    }

    const result = {
      total: Number(totalR.rows[0].total),
      employees,
      topCountries: countryR.rows.map((r: any) => ({ country: r.country, cnt: Number(r.cnt) })),
      aTopCountries: aCountryR.rows.map((r: any) => ({ country: r.country, cnt: Number(r.cnt) })),
      aiAnalysis,
      generatedAt: new Date().toISOString(),
    };

    _cache = result;
    _cacheTime = Date.now();

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: 'analysis failed: ' + String(e?.message || e) });
  }
}
