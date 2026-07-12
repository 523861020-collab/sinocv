// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  if (!(global as any)._contacts) {
    return NextResponse.json({ contacts: [] });
  }
  
  const contacts = Array.from((global as any)._contacts.values());
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const due = contacts.filter(c => {
    if (!c.nextFollowUp) return false;
    return c.nextFollowUp <= today;
  });

  return NextResponse.json({ contacts: due });
}
