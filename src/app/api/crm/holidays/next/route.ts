// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const HOLIDAYS_2026 = new Set([
  '2026-01-01', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23',
  '2026-04-04', '2026-04-05', '2026-04-06',
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
  '2026-06-20', '2026-06-21', '2026-06-22',
  '2026-09-25', '2026-09-26', '2026-09-27',
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07',
]);

function isOff(d) {
  return d.getDay() === 0 || d.getDay() === 6 || HOLIDAYS_2026.has(d.toISOString().split('T')[0]);
}

export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from') || new Date().toISOString().split('T')[0];
  let d = new Date(from);
  while (isOff(d)) { d.setDate(d.getDate() + 1); }
  return NextResponse.json({ nextWorkday: d.toISOString().split('T')[0] });
}
