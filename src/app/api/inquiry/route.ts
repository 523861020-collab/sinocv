export async function POST(request: Request) {
  const body = await request.json();

  const name = body.name || 'Unknown';
  const email = body.email || '';
  const phone = body.phone || '';
  const country = body.country || '';
  const product = body.product || '';
  const message = body.message || '';
  const company = body.company || '';

  // 2026-11-01：官网询盘一个都不能丢。
  // 注意坑：Vercel 函数之间/跨域 fetch 到 img.sinocv.com 会失败（实测 Failed to fetch），
  // 而 img.sinocv.com 的 nginx 只放行 /uploads/，其余路径直接 404。
  // 所以这里改成「发邮件到 sales@sinocvtrucks.com（Brevo 已认证域名）+ 写日志」，
  // 邮件由服务器收信管道归档进 CRM/收件箱，不依赖跨域调用。
  const INQ_TO = process.env.INQUIRY_EMAIL_TO || 'sales@sinocvtrucks.com';
  // 发送渠道：Brevo SMTP 中转（与 CRM 开发信同一认证账号），不依赖第三方跨域接口
  const BREVO_KEY = process.env.BREVO_SMTP_KEY || '';
  const BREVO_USER = process.env.BREVO_SMTP_USER || 'b86082001@smtp-brevo.com';

  const lines = [
    '【官网询盘】' + new Date().toISOString(),
    '页面: ' + (request.headers.get('referer') || '-'),
    '姓名: ' + name,
    '邮箱: ' + (email || '-'),
    '电话/WhatsApp: ' + (phone || '-'),
    '国家: ' + (country || '-'),
    '公司: ' + (company || '-'),
    '需求车型: ' + (product || '-'),
    '留言: ' + (message || '-'),
  ].join('\n');
  console.log('[INQUIRY]\n' + lines);

  if (BREVO_KEY) {
    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'SINOCV Website', email: 'sales@sinocvtrucks.com' },
          to: [{ email: INQ_TO }],
          replyTo: email ? { email } : undefined,
          subject: '【官网询盘】' + (product || '新车询价') + (phone ? ' - ' + phone : ''),
          textContent: lines,
          headers: { 'X-Mailin-User': BREVO_USER },
        }),
      });
      console.log('INQUIRY mail:', r.status, (await r.text()).slice(0, 300));
    } catch (e: any) {
      console.error('INQUIRY mail failed:', e.message);
    }
  } else {
    console.warn('INQUIRY mail skipped: BREVO_SMTP_KEY 未配置');
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
