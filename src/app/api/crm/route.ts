// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Pool } from 'pg';

const pgPool = new Pool({
  host: '127.0.0.1', port: 5432, database: 'sinocv_crm',
  user: 'sinocv', password: 'crm2025pass',
  statement_timeout: 8000,
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
  const r = await pgPool.query(`
    INSERT INTO contacts (phone, name, email, country, company, level, product, category, owner, notes, orders, pis, next_follow_up, has_confirmed_order, first_seen, updated_at, staff_data)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    ON CONFLICT (phone) DO UPDATE SET
      name=EXCLUDED.name, email=EXCLUDED.email, country=EXCLUDED.country,
      company=EXCLUDED.company, level=EXCLUDED.level, product=EXCLUDED.product,
      category=EXCLUDED.category, owner=EXCLUDED.owner, notes=EXCLUDED.notes,
      orders=EXCLUDED.orders, pis=EXCLUDED.pis,
      next_follow_up=EXCLUDED.next_follow_up, has_confirmed_order=EXCLUDED.has_confirmed_order,
      updated_at=EXCLUDED.updated_at, staff_data=EXCLUDED.staff_data
    RETURNING *
  `, [record.phone, record.name, record.email, record.country, record.company,
      record.level, record.product, record.category, record.owner, record.notes,
      JSON.stringify(record.orders || []), JSON.stringify(record.pis || []),
      record.next_follow_up || null, record.hasConfirmedOrder || false, record.first_seen, record.updated_at,
      JSON.stringify(record.staff_data || {})]);
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

// 修复: 员工隔离不再依赖 notes 字段，改用 staff_data JSONB
function buildStaffFilter(staff: string, search?: string) {
  const params: any[] = [];
  let where = '';
  
  if (staff) {
    // staff_data ? 'phone' = JSONB 中存在这个 key
    params.push(staff);
    where += ` staff_data ? $${params.length}`;
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
    const limit = (view === 'all') ? '' : ' LIMIT 3000';
    const sql = `SELECT * FROM contacts WHERE ${where} ORDER BY updated_at DESC NULLS LAST${limit}`;
    console.log('[CRM GET] sql:', sql.substring(0, 100), 'params:', params.join(','));
    const r = await pgPool.query(sql, params);
    let contacts = (r.rows || []).map(formatContact);
    
    // Merge staff data for employee view
    if (staff) {
      contacts = contacts.map(c => mergeStaffData(c, staff));
    }
    
    // 展开 staff_views（所有请求都需要，不只是 view=all）
    contacts = contacts.map(c => {
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
    
    return NextResponse.json({ contacts });
  } catch (e) { console.error('PG GET error:', e); }

  // Supabase fallback
  try {
    if (supabase) {
      const { data } = await supabase.from('contacts').select('*').order('updated_at', { ascending: false });
      return NextResponse.json({ contacts: (data||[]).map(formatContact) });
    }
  } catch {}

  const store = (global as any)._contacts;
  return NextResponse.json({ contacts: Array.from(store.values()) });
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
    next_follow_up: body.nextFollowUp || null,
    hasConfirmedOrder: body.hasConfirmedOrder || false,
    first_seen: body.firstSeen || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    staff_data: existingStaffData,
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
