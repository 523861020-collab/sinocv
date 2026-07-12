import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiKey = process.env.YCLOUD_API_KEY || '';

  console.log('YCloud webhook:', JSON.stringify(body).slice(0, 500));

  // Extract contact info from incoming message
  const contact = body?.contact;
  const message = body?.messages?.[0];
  const eventType = body?.type;

  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 500 });
  }

  try {
    // Handle incoming message - auto set contact name if available
    if (eventType === 'message.inbound' && contact?.waId) {
      const phoneNumber = contact.waId;
      const profileName = contact?.profile?.name || '';

      if (profileName && profileName !== phoneNumber) {
        // Update contact name via YCloud API
        await fetch(`https://api.ycloud.com/v2/contacts`, {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            name: profileName,
            attributes: {
              source: 'whatsapp',
            },
          }),
        });
        console.log(`Contact updated: ${phoneNumber} → ${profileName}`);
      }
    }

    // Handle new contact creation webhook
    if (eventType === 'contact.created' && contact) {
      console.log(`New contact: ${contact.name} (${contact.phoneNumber})`);
    }
  } catch (e: any) {
    console.error('YCloud webhook error:', e.message);
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: 'YCloud webhook endpoint ready' });
}
