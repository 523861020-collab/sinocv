// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
  statement_timeout: 15000, max: 20, connectionTimeoutMillis: 5000,
});

// 老板号（能看所有员工跟客户的聊天）；其余号只能看自己跟客户的聊天
const ADMIN_PHONES = ['13001977959', '19103781257'];

// 员工号（国际号）→ 名字
const EMPLOYEE_NAMES = {
  '8619103781257': '王小涵',
  '8615715313849': '毛振威',
  '8613523034981': '杜飞跃',
  '8615903993573': '赵欢乐',
  '8616601052225': '测试',
  '8613001977959': '李善龙',
};

function norm(p: string): string {
  return String(p || '').replace(/[^0-9]/g, '').replace(/^86/, '');
}
function empName(p: string): string {
  const n = norm(p);
  return EMPLOYEE_NAMES[n] || n;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('phone') || '';
  const meRaw = req.nextUrl.searchParams.get('me') || '';
  const phone = raw.replace(/[^0-9]/g, '');
  const meNorm = norm(meRaw);
  if (!phone) return NextResponse.json({ error: 'no phone', contact: null, employees: [], messages: [] });

  const isAdmin = !meRaw || ADMIN_PHONES.some(a => norm(a) === meNorm);

  try {
    // 查客户联系方式
    const cR = await pgPool.query(
      'SELECT phone, name, country, level, company, assigned_to FROM contacts WHERE phone = $1 OR phone = $2',
      [phone, '+' + phone]
    );
    const cRow = cR.rows[0];
    const contact = cRow
      ? { phone: cRow.phone, name: cRow.name || '', country: cRow.country || '', level: cRow.level || '', company: cRow.company || '', assignedTo: cRow.assigned_to || '' }
      : null;

    // 查消息
    const r = await pgPool.query(
      'SELECT phone, employee, sender, text, msg_time, media FROM chat_messages WHERE phone = $1 OR phone = $2 ORDER BY msg_time ASC',
      [phone, '+' + phone]
    );
    let messages = r.rows.map(m => ({
      employee: (m.employee || '').replace(/[^0-9]/g, ''),
      sender: m.sender || '客户',
      text: m.text || '',
      time: m.msg_time ? new Date(m.msg_time).toISOString() : '',
      media: m.media || '',
    }));

    // 权限过滤：员工只看自己跟客户的聊天
    if (!isAdmin && meRaw) {
      messages = messages.filter(m => norm(m.employee) === meNorm);
    }

    // 按 employee 分组（含名字）
    const empMap = {};
    messages.forEach(m => {
      const emp = norm(m.employee) || '未知';
      if (!empMap[emp]) empMap[emp] = { employee: emp, name: empName(m.employee), count: 0, last_time: '' };
      empMap[emp].count++;
      if (m.time > (empMap[emp].last_time || '')) empMap[emp].last_time = m.time;
    });
    const employees = Object.values(empMap).sort((a, b) => String(b.last_time).localeCompare(String(a.last_time)));

    return NextResponse.json({ phone, contact, employees, messages, isAdmin });
  } catch (e) {
    return NextResponse.json({ error: String(e), phone, contact: null, employees: [], messages: [] });
  }
}
