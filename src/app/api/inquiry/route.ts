import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const TO_EMAIL = 'lishanlong@sinocv.com';

function readInquiries(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {}
  return [];
}

function saveInquiries(data: any[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function sendEmail(inquiry: any) {
  if (!RESEND_KEY) { console.log('No RESEND_API_KEY set'); return; }

  const html = `
    <h2>新客户询价</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">姓名</td><td style="padding:8px;border:1px solid #ddd">${inquiry.name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">邮箱</td><td style="padding:8px;border:1px solid #ddd">${inquiry.email || '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">电话</td><td style="padding:8px;border:1px solid #ddd">${inquiry.phone || '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">公司</td><td style="padding:8px;border:1px solid #ddd">${inquiry.company || '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">国家</td><td style="padding:8px;border:1px solid #ddd">${inquiry.country || '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">意向产品</td><td style="padding:8px;border:1px solid #ddd">${inquiry.product || '-'}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">留言</td><td style="padding:8px;border:1px solid #ddd">${inquiry.message || '-'}</td></tr>
    </table>
    <p style="color:#999;font-size:12px;margin-top:16px">${inquiry.id} · ${inquiry.createdAt}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SINOCV <onboarding@resend.dev>',
        to: TO_EMAIL,
        subject: `新询价 - ${inquiry.name} - ${inquiry.country || '未知国家'}`,
        html,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Resend error:', JSON.stringify(result));
    } else {
      console.log('Email sent:', result.id);
    }
  } catch (e: any) {
    console.error('Email failed:', e.message);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiry = {
      id: `INQ-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    };

    const inquiries = readInquiries();
    inquiries.push(inquiry);
    saveInquiries(inquiries);

    // Send email (don't block response)
    sendEmail(inquiry).catch(e => console.error('Email error:', e));

    return NextResponse.json({ success: true, message: '询价提交成功，我们将尽快与您联系！' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '提交失败，请稍后重试' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: readInquiries(), total: readInquiries().length });
}
