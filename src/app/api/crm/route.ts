// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Fallback in-memory store when Supabase is not configured
if (!(global as any)._contacts) (global as any)._contacts = new Map();

// GET
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  try {
    if (supabase) {
      if (phone) {
        const { data } = await supabase.from('contacts').select('*').eq('phone', phone).single();
        return NextResponse.json({ contact: data ? formatContact(data) : null });
      }
      const { data } = await supabase.from('contacts').select('*').order('updated_at', { ascending: false });
      return NextResponse.json({ contacts: (data||[]).map(formatContact) });
    }
    // Fallback
    const store = (global as any)._contacts;
    if (phone) return NextResponse.json({ contact: store.get(phone) || null });
    return NextResponse.json({ contacts: Array.from(store.values()) });
  } catch(e) {
    const store = (global as any)._contacts;
    if (phone) return NextResponse.json({ contact: store.get(phone) || null });
    return NextResponse.json({ contacts: Array.from(store.values()) });
  }
}

// POST
export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  const record = {
    phone,
    name: body.name || '',
    email: body.email || '',
    country: body.country || '',
    company: body.company || '',
    product: body.product || '',
    category: body.category || '',
    owner: body.owner || '',
    notes: body.notes || '',
    orders: body.orders || [],
    pis: body.pis || [],
    next_follow_up: body.nextFollowUp || null,
    first_seen: body.firstSeen || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    if (supabase) {
      const { data: existing } = await supabase.from('contacts').select('id').eq('phone', phone).single();
      let result;
      if (existing) result = await supabase.from('contacts').update(record).eq('phone', phone).select().single();
      else result = await supabase.from('contacts').insert(record).select().single();
      if (result.error) throw result.error;
      return NextResponse.json({ success: true, contact: formatContact(result.data) });
    }
    // Fallback
    const store = (global as any)._contacts;
    const existing = store.get(phone) || {};
    const merged = { ...existing, ...record, updatedAt: record.updated_at, nextFollowUp: record.next_follow_up || existing.nextFollowUp, firstSeen: existing.firstSeen || record.first_seen };
    store.set(phone, merged);
    return NextResponse.json({ success: true, contact: merged });
  } catch(e) {
    const store = (global as any)._contacts;
    const existing = store.get(phone) || {};
    const merged = { ...existing, ...record };
    store.set(phone, merged);
    return NextResponse.json({ success: true, contact: merged });
  }
}

function formatContact(c: any) {
  return { ...c, nextFollowUp: c.next_follow_up, firstSeen: c.first_seen, updatedAt: c.updated_at };
}
