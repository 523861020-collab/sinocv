// @ts-nocheck
import { NextResponse } from 'next/server';

// Vercel 版：代理到服务器（Vercel 连不上服务器的 PostgreSQL，转发到服务器处理）
const UPSTREAM = 'http://47.96.255.110/api/chat';

// 把服务器 http 图片 URL 转成 Vercel 图片代理（避免 https 页面 mixed content 拦截）
function proxyImages(product: any) {
  if (!product || !Array.isArray(product.images)) return product;
  product.images = product.images.map((img: string) => '/api/img-proxy?url=' + encodeURIComponent(img));
  return product;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const resp = await fetch(UPSTREAM + url.search, { method: 'GET' });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ pending: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resp = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (data.product) data.product = proxyImages(data.product);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again later.' });
  }
}
