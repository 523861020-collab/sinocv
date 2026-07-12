// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// Chinese holidays 2026 (simplified — can be expanded)
const HOLIDAYS_2026 = new Set([
  '2026-01-01', // New Year
  '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23', // Spring Festival
  '2026-04-04', '2026-04-05', '2026-04-06', // Qingming
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05', // Labor Day
  '2026-06-20', '2026-06-21', '2026-06-22', // Dragon Boat
  '2026-09-25', '2026-09-26', '2026-09-27', // Mid-Autumn
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07', // National Day
]);

function isHoliday(dateStr) {
  // Also skip weekends by default
  const d = new Date(dateStr);
  if (d.getDay() === 0 || d.getDay() === 6) return true;
  return HOLIDAYS_2026.has(dateStr);
}

// GET /api/crm/holidays?date=2026-07-15
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  if (date) {
    return NextResponse.json({ date, isHoliday: isHoliday(date) });
  }
  return NextResponse.json({ holidays: Array.from(HOLIDAYS_2026) });
}
