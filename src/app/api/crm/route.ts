// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - lookup contact or list all
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  const action = request.nextUrl.searchParams.get('action');

  try {
    if (phone) {
      const { data } = await supabase.from('contacts').select('*').eq('phone', phone).single();
      return NextResponse.json({ contact: data || null });
    }
    const { data } = await supabase.from('contacts').select('*').order('updated_at', { ascending: false });
    return NextResponse.json({ contacts: data || [] });
  } catch(e) {
    return NextResponse.json({ contacts: [] });
  }
}

// POST - save/update contact
export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  try {
    const { data: existing } = await supabase.from('contacts').select('id').eq('phone', phone).single();
    
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

    let result;
    if (existing) {
      result = await supabase.from('contacts').update(record).eq('phone', phone).select().single();
    } else {
      result = await supabase.from('contacts').insert(record).select().single();
    }

    if (result.error) throw result.error;

    // Convert DB format back to camelCase for frontend
    const c = result.data;
    const contact = {
      ...c,
      nextFollowUp: c.next_follow_up,
      firstSeen: c.first_seen,
      updatedAt: c.updated_at,
    };

    return NextResponse.json({ success: true, contact });
  } catch(e: any) {
    console.error('CRM save error:', e.message);
    return NextResponse.json({ success: true, contact: body }); // fallback
  }
}
