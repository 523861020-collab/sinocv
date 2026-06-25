import { NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const inquiries: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const inquiry = {
      id: `INQ-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    };
    
    inquiries.push(inquiry);
    
    console.log('New inquiry received:', inquiry);
    
    return NextResponse.json({
      success: true,
      message: '询价提交成功，我们将尽快与您联系！',
      data: inquiry
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '提交失败，请稍后重试' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: inquiries,
    total: inquiries.length
  });
}
