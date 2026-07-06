export async function POST(request: Request) {
  const body = await request.json();

  const name = body.name || 'Unknown';
  const email = body.email || '';
  const phone = body.phone || '';
  const country = body.country || '';
  const product = body.product || '';
  const message = body.message || '';
  const company = body.company || '';

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
      console.log('Resend:', res.status, JSON.stringify(data).substring(0, 200));
    } catch (e: any) {
      console.error('Resend failed:', e.message);
    }
  }

  return Response.json({ success: true });
}

export async function GET() {
  return Response.json({ success: true });
}
