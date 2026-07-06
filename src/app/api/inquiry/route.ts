export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiry = {
      id: `INQ-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString()
    };

    const RESEND_KEY = process.env.RESEND_API_KEY || '';

    // Send email via Resend
    if (RESEND_KEY) {
      const html = `<h2>新客户询价</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">姓名</td><td style="padding:8px;border:1px solid #ddd">${inquiry.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">邮箱</td><td style="padding:8px;border:1px solid #ddd">${inquiry.email || '-'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">电话</td><td style="padding:8px;border:1px solid #ddd">${inquiry.phone || '-'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">公司</td><td style="padding:8px;border:1px solid #ddd">${inquiry.company || '-'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">国家</td><td style="padding:8px;border:1px solid #ddd">${inquiry.country || '-'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">意向产品</td><td style="padding:8px;border:1px solid #ddd">${inquiry.product || '-'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">留言</td><td style="padding:8px;border:1px solid #ddd">${inquiry.message || '-'}</td></tr>
        </table>`;

      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'SINOCV <onboarding@resend.dev>',
            to: '523861020@qq.com',
            subject: `新询价 - ${inquiry.name} - ${inquiry.country || '未知'}`,
            html,
          }),
        });
        const data = await res.json();
        console.log('Resend response:', res.status, JSON.stringify(data).substring(0, 300));
      } catch (e: any) {
        console.error('Email error:', e.message);
      }
    }

    return Response.json({ success: true, message: '询价提交成功，我们将尽快与您联系！' });
  } catch (e: any) {
    return Response.json({ success: false, message: '提交失败，请稍后重试' }, { status: 400 });
  }
}

export async function GET() {
  return Response.json({ success: true });
}
