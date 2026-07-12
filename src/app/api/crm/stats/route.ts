// @ts-nocheck
import { NextResponse } from 'next/server';

export async function GET() {
  const store = (global as any)._crmStore;
  if (!store) {
    return NextResponse.json({ contacts: 0, pis: 0 });
  }
  const contacts = Array.from(store.values());
  const pis = contacts.filter(c => c.pi).length;
  return NextResponse.json({ contacts: contacts.length, pis });
}
