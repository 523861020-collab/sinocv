// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { gzipSync } from 'zlib';
import { supabase } from '@/lib/supabase';
import { Pool } from 'pg';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
  statement_timeout: 15000,
  max: 20,
  connectionTimeoutMillis: 5000,
});

async function pgGet(phone?: string) {
  if (phone) {
    const r = await pgPool.query('SELECT * FROM contacts WHERE phone = $1', [phone]);
    return r.rows[0] ? formatContact(r.rows[0]) : null;
  }
  const r = await pgPool.query('SELECT * FROM contacts ORDER BY updated_at DESC NULLS LAST');
  return (r.rows || []).map(formatContact);
}

async function pgUpsert(record: any) {
  let ownerName = (record.owner_name || record.assigned_to || '').trim();
  if (ownerName === '李善龙') ownerName = '王小涵重汽1';
  const r = await pgPool.query(`
    INSERT INTO contacts (phone, name, email, country, company, level, product, category, owner, notes, orders, pis, next_follow_up, has_confirmed_order, first_seen, updated_at, staff_data, assigned_to, owners)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
      CASE WHEN $19::text = '' THEN '{}'::text[] ELSE ARRAY[$19::text] END)
    ON CONFLICT (phone) DO UPDATE SET
      name=EXCLUDED.name, email=EXCLUDED.email, country=EXCLUDED.country,
      company=EXCLUDED.company, level=EXCLUDED.level, product=EXCLUDED.product,
      category=EXCLUDED.category, owner=EXCLUDED.owner, notes=EXCLUDED.notes,
      orders=EXCLUDED.orders, pis=EXCLUDED.pis,
      next_follow_up=EXCLUDED.next_follow_up, has_confirmed_order=EXCLUDED.has_confirmed_order,
      updated_at=EXCLUDED.updated_at, staff_data=EXCLUDED.staff_data,
      owners = CASE
        WHEN $19::text <> '' AND NOT ($19::text = ANY(COALESCE(contacts.owners, '{}'::text[])))
        THEN array_append(COALESCE(contacts.owners, '{}'::text[]), $19::text)
        ELSE COALESCE(contacts.owners, '{}'::text[])
      END
    RETURNING *
  `, [record.phone, record.name, record.email, record.country, record.company,
      record.level, record.product, record.category, record.owner, record.notes,
      JSON.stringify(record.orders || []), JSON.stringify(record.pis || []),
      record.next_follow_up || null, record.hasConfirmedOrder || false, record.first_seen, record.updated_at,
      JSON.stringify(record.staff_data || {}), record.assigned_to || '', ownerName]);
  return formatContact(r.rows[0]);
}

async function pgSaveBackup(userPhone: string, data: any) {
  await pgPool.query(`
    INSERT INTO crm_backups (user_phone, data, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_phone) DO UPDATE SET
      data = EXCLUDED.data, updated_at = NOW()
  `, [userPhone, JSON.stringify(data)]);
}

async function pgGetBackup(userPhone: string) {
  const r = await pgPool.query('SELECT data FROM crm_backups WHERE user_phone = $1', [userPhone]);
  return r.rows[0]?.data || null;
}

function formatContact(row: any) {
  const sd = typeof row.staff_data === 'string' ? JSON.parse(row.staff_data || '{}') : (row.staff_data || {});
  return {
    phone: row.phone,
    name: row.name, email: row.email, country: row.country, company: row.company,
    level: row.level, product: row.product, category: row.category,
    owner: row.owner, notes: row.notes,
    assigned_to: row.assigned_to, assignedTo: row.assigned_to,
    owners: Array.isArray(row.owners) ? row.owners : (row.owners || []),
    orders: typeof row.orders === 'string' ? JSON.parse(row.orders) : row.orders || [],
    pis: typeof row.pis === 'string' ? JSON.parse(row.pis) : row.pis || [],
    nextFollowUp: row.next_follow_up, next_follow_up: row.next_follow_up,
    lastFollowUp: row.last_follow_up, last_follow_up: row.last_follow_up,
    hasConfirmedOrder: row.has_confirmed_order, has_confirmed_order: row.has_confirmed_order,
    firstSeen: row.first_seen, first_seen: row.first_seen,
    updatedAt: row.updated_at, updated_at: row.updated_at,
    staff_data: sd,
  };
}

// Merge employee-specific data from staff_data JSONB into contact
function mergeStaffData(contact: any, staffPhone: string) {
  if (!contact || !contact.staff_data) return contact;
  const sd = contact.staff_data[staffPhone];
  if (!sd) return contact;
  return {
    ...contact,
    level: sd.level || contact.level || 'C',
    notes: sd.notes || contact.notes || '',
    orders: sd.orders || contact.orders || [],
    nextFollowUp: sd.nextFollowUp || contact.nextFollowUp || null,
    next_follow_up: sd.nextFollowUp || contact.next_follow_up || null,
    _staffSource: staffPhone,
  };
}

// 展开 staff_views（员工视图需要；所有数据源 PostgreSQL/Supabase 都必须用，否则员工过滤会跳过所有客户）
function expandStaffViews(contacts: any[]) {
  return (contacts || []).map(c => {
    const sd = c.staff_data || {};
    const staffViews: any[] = [];
    Object.keys(sd).forEach(phone => {
      const emp = sd[phone];
      staffViews.push({
        phone: phone,
        level: emp.level || c.level || 'C',
        notes: emp.notes || '',
        orders: emp.orders || [],
        nextFollowUp: emp.nextFollowUp || null,
      });
    });
    return { ...c, staff_views: staffViews };
  });
}

// 员工取客户按 assigned_to 单一归属过滤（通讯录=assigned_to，不含别人名下/无主客户）
const STAFF_ASSIGNED = {
  '13001977959': '李善龙',
  '19103781257': '王小涵重汽1',
  '15715313849': '毛震威重汽2',
  '13523034981': '杜飞跃重汽4',
  '15903993573': '赵欢乐重汽3',
  '16601052225': '王丽帅陕汽1',
};

function buildStaffFilter(staff: string, search?: string) {
  const params: any[] = [];
  let where = '';
  
  if (staff) {
    // 员工取客户按 owners 多归属过滤（谁的客户归谁，含一客多负责人）
    const assigned = STAFF_ASSIGNED[staff];
    if (assigned) {
      params.push(assigned);
      where += ` $${params.length} = ANY(owners)`;
    } else {
      params.push(staff);
      where += ` staff_data ? $${params.length}`;
    }
  }
  
  if (search) {
    const q = '%' + search.replace(/\s+/g, '%') + '%';
    params.push(q);
    const pn = params.length;
    where += (where ? ' AND (' : '') + 
      `(phone ILIKE $${pn} OR name ILIKE $${pn} OR country ILIKE $${pn} OR orders::text ILIKE $${pn}`;
    // 也搜 staff_data 里的 notes
    params.push(q);
    const pn2 = params.length;
    where += ` OR staff_data::text ILIKE $${pn2})`;
    if (staff) where += ')'; // close AND grouping
  }
  
  if (!where) where = 'TRUE';
  return { where, params };
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  const search = request.nextUrl.searchParams.get('search');
  const backup = request.nextUrl.searchParams.get('backup');
  const staff = request.nextUrl.searchParams.get('staff');
  const view = request.nextUrl.searchParams.get('view');

  if (backup) {
    try {
      const data = await pgGetBackup(phone || backup);
      return NextResponse.json(data || {});
    } catch (e) { console.error('Backup GET error:', e); return NextResponse.json({}); }
  }

  try {
    // 单条查询
    if (phone) {
      const result = await pgGet(phone);
      let contact = result;
      if (staff && contact) contact = mergeStaffData(contact, staff);
      return NextResponse.json({ contact });
    }
    
    // 列表查询 — 使用 staff_data JSONB 过滤
    const { where, params } = buildStaffFilter(staff || '', search || '');
    // 修复：去掉 LIMIT 3000。员工名下客户超过 3000（如王小涵 5504），
    // ORDER BY updated_at DESC LIMIT 3000 会把今天需回访的旧客户（updated_at 早）截断，
    // 导致「今日总结/回访」统计不到。改为返回全部名下客户。
    const sql = `SELECT * FROM contacts WHERE ${where} ORDER BY updated_at DESC NULLS LAST`;
    console.log('[CRM GET] sql:', sql.substring(0, 100), 'params:', params.join(','));
    const r = await pgPool.query(sql, params);
    let contacts = (r.rows || []).map(formatContact);
    
    // Merge staff data for employee view
    if (staff) {
      contacts = contacts.map(c => mergeStaffData(c, staff));
    }
    
    // 展开 staff_views（所有请求都需要，不只是 view=all）
    contacts = expandStaffViews(contacts);

    // 返回前删除 staff_data（前端用 staff_views，不用 staff_data），并 gzip 压缩
    contacts = contacts.map(c => {
      const { staff_data, ...rest } = c;
      return rest;
    });
    const gz = gzipSync(Buffer.from(JSON.stringify({ contacts })));
    return new NextResponse(gz, {
      headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' },
    });
  } catch (e) { console.error('PG GET error:', e); }

  // Supabase fallback — 必须和 PostgreSQL 走相同的 staff_views 展开，否则员工视图会漏客户
  try {
    if (supabase) {
      const { data } = await supabase.from('contacts').select('*').order('updated_at', { ascending: false });
      let contacts = expandStaffViews((data || []).map(formatContact));
      if (staff) contacts = contacts.map(c => mergeStaffData(c, staff));
      return NextResponse.json({ contacts });
    }
  } catch (e) { console.error('Supabase fallback error:', e); }

  // 最后兜底：返回空数组（明确空，避免返回未初始化的内存 store）
  return NextResponse.json({ contacts: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.action === 'backup' && body.phone) {
    try {
      await pgSaveBackup(body.phone, {
        customers: body.customers || {},
        chat_history: body.chat_history || {},
        doc_records: body.doc_records || {},
        replies: body.replies || {},
        attendance: body.attendance || {},
        daily_activity: body.daily_activity || {},
        contact_map: body.contact_map || {},
      });
      return NextResponse.json({ success: true, action: 'backup' });
    } catch (e) { console.error('Backup POST error:', e); return NextResponse.json({ success: false, error: String(e) }); }
  }

  const phone = body.phone;
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  // Employee-scoped save
  const staffPhone = body.staff_phone || body.owner || '';
  const isStaffSave = !!staffPhone;

  // Fetch existing to preserve other employees' staff_data
  let existingStaffData: any = {};
  try {
    const existing = await pgPool.query('SELECT staff_data, name, country FROM contacts WHERE phone = $1', [phone]);
    existingStaffData = existing.rows[0]?.staff_data || {};
    if (typeof existingStaffData === 'string') existingStaffData = JSON.parse(existingStaffData);
  } catch {}

  const record: any = {
    phone, name: body.name || '', email: body.email || '',
    country: body.country || '', company: body.company || '',
    level: body.level || 'C', product: body.product || '',
    category: body.category || '', owner: body.owner || '',
    notes: body.notes || '', orders: body.orders || [], pis: body.pis || [],
    assigned_to: body.assignedTo || body.assigned_to || '',
    next_follow_up: body.nextFollowUp || null,
    hasConfirmedOrder: body.hasConfirmedOrder || false,
    first_seen: body.firstSeen || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    staff_data: existingStaffData,
    owner_name: STAFF_ASSIGNED[staffPhone] || body.assignedTo || body.assigned_to || '',
  };

  if (isStaffSave) {
    const empData: any = {};
    if (body.level !== undefined) empData.level = body.level;
    if (body.notes !== undefined) empData.notes = body.notes;
    if (body.orders !== undefined) empData.orders = body.orders;
    if (body.nextFollowUp !== undefined) empData.nextFollowUp = body.nextFollowUp;
    record.staff_data[staffPhone] = { ...(record.staff_data[staffPhone] || {}), ...empData };
  }

  try {
    const contact = await pgUpsert(record);
    return NextResponse.json({ success: true, contact });
  } catch (e) { console.error('PG POST error:', e); }
  return NextResponse.json({ success: false, error: 'Database error' });
}
