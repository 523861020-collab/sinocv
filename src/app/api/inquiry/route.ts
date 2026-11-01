export async function POST(request: Request) {
  const body = await request.json();

  const name = body.name || 'Unknown';
  const email = body.email || '';
  const phone = body.phone || '';
  const country = body.country || '';
  const product = body.product || '';
  const message = body.message || '';
  const company = body.company || '';
  const page = body.page || request.headers.get('referer') || '-';

  // 2026-11-01 修复记录（重要）：
  // 之前同时写了 Brevo REST 和 Resend 两条路。Vercel 上的 BREVO_SMTP_KEY 是 SMTP 密钥
  // （xsmtpsib- 开头），调 api.brevo.com/v3 一定 401；于是每条询盘都从 Resend 的
  // onboarding@resend.dev 发出去（这是个只能给自己发信的沙箱发件人），邮件标题
  // 就成了 "New inquiry from XXX"。所以现在只保留 Brevo REST 一条路，
  // 并且用正确的 API key（BREVO_API_KEY，xkeysib- 开头）。
  const INQ_TO = process.env.INQUIRY_EMAIL_TO || 'sales@sinocvtrucks.com';
  const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
  const BREVO_USER = process.env.BREVO_SMTP_USER || 'b86082001@smtp-brevo.com';

  const lines = [
    '【官网询盘】' + new Date().toISOString(),
    '页面: ' + page,
    '姓名: ' + name,
    '邮箱: ' + (email || '-'),
    '电话/WhatsApp: ' + (phone || '-'),
    '国家: ' + (country || '-'),
    '公司: ' + (company || '-'),
    '需求车型: ' + (product || '-'),
    '留言: ' + (message || '-'),
  ].join('\n');
  console.log('[INQUIRY]\n' + lines);

  let delivered = false;
  if (BREVO_API_KEY) {
    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'SINOCV Website', email: 'sales@sinocvtrucks.com' },
          to: [{ email: INQ_TO }],
          replyTo: email ? { email } : undefined,
          subject: '【官网询盘】' + (product || '新车询价') + (phone ? ' - ' + phone : ''),
          textContent: lines,
          headers: { 'X-Mailin-User': BREVO_USER },
        }),
      });
      const txt = (await r.text()).slice(0, 300);
      console.log('INQUIRY mail:', r.status, txt);
      delivered = r.ok;
    } catch (e: any) {
      console.error('INQUIRY mail failed:', e.message);
    }
  } else {
    console.warn('INQUIRY mail skipped: BREVO_API_KEY 未配置');
  }

  // 邮件投递失败时才用 Resend 兜底（不再作为主通道，避免沙箱发件人主导全站邮件）
  if (!delivered) {
    const RESEND_KEY = process.env.RESEND_API_KEY || '';
    if (RESEND_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: '523861020@qq.com',
            subject: '【官网询盘·备用通道】' + (product || '新车询价') + (phone ? ' - ' + phone : ''),
            text: lines,
          }),
        });
        console.warn('INQUIRY: 主通道失败，已走 Resend 备用通道');
      } catch (e: any) {
        console.error('INQUIRY resend fallback failed:', e.message);
      }
    }
  }

  return Response.json({ success: true });
}

export async function GET() {
  return Response.json({ success: true });
}
