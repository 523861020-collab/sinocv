// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month');
  const date = request.nextUrl.searchParams.get('date');
  
  let data = (global as any)._followUps || [];
  if (date) data = data.filter((f:any) => f.date === date);
  if (month) data = data.filter((f:any) => (f.date||'').startsWith(month));

  // Group by date
  const byDate: Record<string,any[]> = {};
  data.forEach((f:any) => {
    if (!byDate[f.date]) byDate[f.date] = [];
    byDate[f.date].push(f);
  });

  // Also get contacts that have lastContactedDate
  const contacts = Array.from(((global as any)._contacts || new Map()).values());
  const followedUpToday = contacts.filter((c:any) => 
    c.lastContactedDate === (date || new Date().toISOString().split('T')[0])
  ).length;

  return NextResponse.json({
    followUps: data,
    byDate,
    followedUpToday,
    totalFollowUps: data.length,
    totalContacts: contacts.length,
    contactsWithFollowUp: contacts.filter((c:any) => c.lastContactedDate).length,
  });
}
