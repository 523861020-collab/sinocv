// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
  statement_timeout: 15000, max: 20, connectionTimeoutMillis: 5000,
});

// 国内号(11位) → 国际号(86+11位)，跟 webhook 存的 employee 一致
function toIntl(p: string): string {
  const n = String(p || '').replace(/[^0-9]/g, '');
  if (n.length === 11 && !n.startsWith('86')) return '86' + n;
  return n;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.phone || '').replace(/[^0-9]/g, '');
    const employee = toIntl(body.employee || '');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!phone || !messages.length) {
      return NextResponse.json({ status: 'ok', saved: 0, reason: 'no data' });
    }
    let saved = 0;
    for (const m of messages) {
      const sender = m.sender === '我' ? '我' : '客户';
      const text = String(m.text || '').trim();
      if (!text) continue;
      const wamid = String(m.wamid || ('dom_' + Date.now() + '_' + Math.random().toString(36).slice(2)));
      // 真实聊天时间：优先用插件解析后的时间，解析失败才用 NOW()
      let msgTime: Date | null = null;
      const t = String(m.time || '').trim();
      if (t) {
        const d = new Date(t.replace(' ', 'T'));
        if (!isNaN(d.getTime())) msgTime = d;
      }
      try {
        const ins = await pgPool.query(
          `INSERT INTO chat_messages (phone, sender, text, msg_time, employee, wamid, media)
           VALUES ($1, $2, $3, COALESCE($4, NOW()), $5, $6, '')
           ON CONFLICT (wamid) DO NOTHING`,
          [phone, sender, text, msgTime, employee, wamid]
        );
        if (ins.rowCount > 0) saved++;
      } catch (e) { console.error('[ChatSave] insert error:', e); }
    }
    return NextResponse.json({ status: 'ok', saved });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', error: e.message }, { status: 500 });
  }
}
