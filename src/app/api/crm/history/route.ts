// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  const history = (global as any)._crmHistory || [];
  const result = phone
    ? history.filter(h => h.phone === phone).slice(-20)
    : history.slice(-20);
  return NextResponse.json({ history: result });
}
