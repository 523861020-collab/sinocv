// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// In-memory store (for now — will migrate to Supabase)
if (!(global as any)._crmStore) {
  (global as any)._crmStore = new Map();
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  if (phone) {
    const contact = (global as any)._crmStore.get(phone);
    return NextResponse.json({ contact: contact || null });
  }
  const all = Array.from((global as any)._crmStore.values());
  return NextResponse.json({ contacts: all });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }
  const existing = (global as any)._crmStore.get(phone) || {};
  const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
  (global as any)._crmStore.set(phone, updated);

  if (!(global as any)._crmHistory) (global as any)._crmHistory = [];
  (global as any)._crmHistory.push({
    phone,
    action: 'contact_updated',
    time: new Date().toISOString(),
    fields: Object.keys(body).filter(k => k !== 'phone'),
  });

  return NextResponse.json({ success: true, contact: updated });
}
