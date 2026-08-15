// @ts-nocheck
import { NextResponse } from 'next/server';

// Vercel 版：代理到服务器（Vercel 连不上服务器的 PostgreSQL，转发到服务器处理）
const UPSTREAM = 'http://47.96.255.110/api/chat';

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
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again later.' });
  }
}
