import { NextResponse } from 'next/server';

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = String(body.text || '').trim();
    const target = String(body.target || 'zh').trim();
    if (!text) return NextResponse.json({ translated: '' });
    if (!DEEPSEEK_KEY) return NextResponse.json({ translated: '', error: 'no key' });
    const targetName = target === 'zh' ? '中文' : target;
    const system = `你是卡车出口业务翻译助手。把客户消息准确翻译成${targetName}。规则：1.识别源语言（法语/英语/阿拉伯语等），理解语境、口语和俚语。2.问候语要自然："What's up"/"Quoi de neuf"/"Bonjour"/"Salam" 翻成自然的问候。3.卡车术语准确：轮子数(roues/wheels)、驱动(4x2/6x4)、吨位等。4.只输出译文，不要解释、不要引号。`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const resp = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [
        { role: 'system', content: system },
        { role: 'user', content: text },
      ], max_tokens: 300, temperature: 0.3 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await resp.json();
    const translated = String(data.choices?.[0]?.message?.content || '').trim();
    return NextResponse.json({ translated });
  } catch (e) {
    return NextResponse.json({ translated: '', error: 'translate failed' });
  }
}
