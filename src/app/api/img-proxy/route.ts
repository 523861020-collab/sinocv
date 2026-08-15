// @ts-nocheck
import { NextResponse } from 'next/server';

// 图片代理：把服务器 http 图片转成 Vercel https 响应，避免 mixed content
// 只允许代理服务器 47.96.255.110 的图片
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) return new NextResponse('missing url', { status: 400 });
  if (url.indexOf('47.96.255.110') === -1) return new NextResponse('forbidden', { status: 403 });
  try {
    const resp = await fetch(url);
    if (!resp.ok) return new NextResponse('', { status: 502 });
    const buf = await resp.arrayBuffer();
    const ct = resp.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(buf, {
      headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (e) {
    return new NextResponse('', { status: 502 });
  }
}
