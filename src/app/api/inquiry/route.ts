import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

function readInquiries(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
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

    const inquiries = readInquiries();
    inquiries.push(inquiry);
    saveInquiries(inquiries);

    console.log('New inquiry:', inquiry.id, inquiry.name, inquiry.email);

    return NextResponse.json({
      success: true,
      message: '询价提交成功，我们将尽快与您联系！',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '提交失败，请稍后重试' },
      { status: 400 }
    );
  }
}

export async function GET() {
  const inquiries = readInquiries();
  return NextResponse.json({ success: true, data: inquiries, total: inquiries.length });
}
