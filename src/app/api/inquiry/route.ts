export async function POST(request: Request) {
  const body = await request.json();

  const name = body.name || 'Unknown';
  const email = body.email || '';
  const phone = body.phone || '';
  const country = body.country || '';
  const product = body.product || '';
  const message = body.message || '';
  const company = body.company || '';

  // 2026-11-01 李总要求：官网询盘一个都不能丢 -> 统一转发到香港 CRM 收口
  // 香港接口 /api/v1/lead/inbound 落库 leads(source=website) 并推送给王小涵；
  // 失败不影响返回成功（客户侧不报错），同时在日志里留痕。
  const CRM_KEY = process.env.CRM_INBOUND_KEY || 'sinocv_inbound_2026';
  try {
    const crmRes = await fetch('https://img.sinocv.com/api/v1/lead/inbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Inbound-Key': CRM_KEY },
      body: JSON.stringify({
        name, email, phone, company, country, product, message,
        source: 'website',
        page: request.headers.get('referer') || '',
      }),
    });
    // 必须显式打印结果：fetch 不会因为 4xx/5xx 抛错，之前静默失败过一次
    console.log('CRM inbound:', crmRes.status, await crmRes.text());
  } catch (e: any) {
    console.error('CRM inbound failed:', e.message);
  }

  const RESEND_KEY = process.env.RESEND_API_KEY || '';

  if (RESEND_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: '523861020@qq.com',
          subject: 'New inquiry from ' + name,
          text: 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nCountry: ' + country + '\nCompany: ' + company + '\nProduct: ' + product + '\nMessage: ' + message,
        }),
      });
      const data = await res.json();
      console.log('Resend full:', JSON.stringify(data));
    } catch (e: any) {
      console.error('Resend failed:', e.message);
    }
  }

  return Response.json({ success: true });
}

export async function GET() {
  return Response.json({ success: true });
}
