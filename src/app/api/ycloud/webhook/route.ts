import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiKey = process.env.YCLOUD_API_KEY || '';

  console.log('YCloud webhook:', JSON.stringify(body).slice(0, 500));

  // Handle WhatsApp incoming message
  if (body?.type === 'whatsapp.message.updated' && body?.whatsappMessage) {
    const msg = body.whatsappMessage;
    if (msg.direction === 'inbound' && msg.from) {
      const phoneNumber = msg.from;
      const profileName = msg?.contact?.profile?.name || '';

      if (profileName && profileName !== phoneNumber) {
        // Update contact name via YCloud API
        await fetch('https://api.ycloud.com/v2/contacts', {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            name: profileName,
          }),
        });
        console.log(`Contact updated: ${phoneNumber} → ${profileName}`);
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: 'YCloud webhook endpoint ready' });
}
