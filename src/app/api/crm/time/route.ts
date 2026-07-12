// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

if (!(global as any)._timeLogs) (global as any)._timeLogs = [];

// POST — submit daily time log
export async function POST(request: NextRequest) {
  const body = await request.json();
  (global as any)._timeLogs.push({ ...body, receivedAt: new Date().toISOString() });
  return NextResponse.json({ success: true });
}

// GET — retrieve time logs with filters
export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get('user');
  const month = request.nextUrl.searchParams.get('month'); // YYYY-MM
  
  let logs = (global as any)._timeLogs || [];
  if (user) logs = logs.filter((l:any) => l.user === user);
  if (month) logs = logs.filter((l:any) => (l.date||'').startsWith(month));

  // Aggregate by user+date
  const byDate: Record<string,any> = {};
  logs.forEach((l:any) => {
    if (l.type === 'message_sent') return; // handled separately
    const key = `${l.date}_${l.user}`;
    if (!byDate[key] || l.endTime > (byDate[key].endTime||0)) {
      byDate[key] = l;
    }
  });

  // Separate message_sent events
  const msgLogs = logs.filter((l:any) => l.type === 'message_sent');

  return NextResponse.json({ 
    logs: Object.values(byDate).sort((a:any,b:any)=>b.date?.localeCompare(a.date||'')),
    msgs: msgLogs 
  });
}
