import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  if (!global._crmHistory) global._crmHistory = [];
  const history = phone
    ? global._crmHistory.filter((h: any) => h.phone === phone).slice(-20)
    : global._crmHistory.slice(-20);
  return NextResponse.json({ history });
}
