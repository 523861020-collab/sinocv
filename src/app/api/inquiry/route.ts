import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiry = {
      id: `INQ-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    };

    // Save locally
    const inquiries = readInquiries();
    inquiries.push(inquiry);
    saveInquiries(inquiries);

    // Email notifications enabled
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: 'SINOCV 网站 <noreply@sinocv.com>',
          to: TO_EMAIL,
          subject: `新询价 - ${inquiry.name} - ${inquiry.country || '未知国家'}`,
          html: `
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
          `,
        });
        console.log('Email sent for', inquiry.id);
      } catch (e: any) {
        console.error('Email failed:', e.message);
      }
    }

    return NextResponse.json({ success: true, message: '询价提交成功，我们将尽快与您联系！' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '提交失败，请稍后重试' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: readInquiries(), total: readInquiries().length });
}
