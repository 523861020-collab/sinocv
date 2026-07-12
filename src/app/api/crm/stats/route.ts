import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  if (!global._crmStore) {
    return NextResponse.json({ contacts: 0, pis: 0 });
  }
  const contacts = Array.from(global._crmStore.values());
  const pis = contacts.filter(c => c.pi).length;
  return NextResponse.json({ contacts: contacts.length, pis });
}
