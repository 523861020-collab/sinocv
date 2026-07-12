// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const YCLOUD_KEY = process.env.YCLOUD_API_KEY || '';

// Shared contact database (persists in Vercel memory)
if (!(global as any)._contacts) (global as any)._contacts = new Map();

// GET - lookup contact by phone
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  const action = request.nextUrl.searchParams.get('action');

  if (action === 'all') {
    const all = Array.from((global as any)._contacts.values());
    return NextResponse.json({ contacts: all.sort((a: any, b: any) => b.updatedAt?.localeCompare(a.updatedAt || '')) });
  }

  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }

  // Look up in our database
  const contact = (global as any)._contacts.get(phone);
  if (contact) {
    return NextResponse.json({ contact });
  }

  // Try to get from YCloud webhook cache if available
  const cache = (global as any)._webhookCache?.get(phone);
  if (cache) {
    return NextResponse.json({ contact: cache });
  }

  return NextResponse.json({ contact: null });
}

// POST - save contact (called by plugin + webhook)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  const existing = (global as any)._contacts.get(phone) || {};
  const updated = { 
    ...existing, 
    ...body, 
    updatedAt: new Date().toISOString(),
    firstSeen: existing.firstSeen || new Date().toISOString(),
  };
  
  (global as any)._contacts.set(phone, updated);

  return NextResponse.json({ success: true, contact: updated });
}
