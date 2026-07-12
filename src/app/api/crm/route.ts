import { NextRequest, NextResponse } from 'next/server';

// In-memory store (for now — will migrate to Supabase)
declare global {
  var _crmStore: Map<string, any>;
}
if (!global._crmStore) {
  global._crmStore = new Map();
}

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  if (phone) {
    const contact = global._crmStore.get(phone);
    return NextResponse.json({ contact: contact || null });
  }
  const all = Array.from(global._crmStore.values());
  return NextResponse.json({ contacts: all });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }
  const existing = global._crmStore.get(phone) || {};
  const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
  global._crmStore.set(phone, updated);

  // Log history
  if (!global._crmHistory) global._crmHistory = [];
  global._crmHistory.push({
    phone,
    action: 'contact_updated',
    time: new Date().toISOString(),
    fields: Object.keys(body).filter(k => k !== 'phone'),
  });

  return NextResponse.json({ success: true, contact: updated });
}
