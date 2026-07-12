// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const YCLOUD_KEY = process.env.YCLOUD_API_KEY || '';

// Ensure global stores
if (!(global as any)._contacts) (global as any)._contacts = new Map();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const type = body?.type;

  // Handle WhatsApp incoming message
  if (type === 'whatsapp.message.updated' && body?.whatsappMessage) {
    const msg = body.whatsappMessage;
    if (msg.direction === 'inbound' && msg.from) {
      const phone = msg.from;
      const profileName = msg?.contact?.profile?.name || '';
      const existing = (global as any)._contacts.get(phone) || {};

      // Save to our database
      (global as any)._contacts.set(phone, {
        ...existing,
        phone,
        name: profileName || existing.name || phone,
        firstSeen: existing.firstSeen || new Date().toISOString(),
        lastMessage: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'whatsapp',
      });

      // Also try to update YCloud contact name
      if (YCLOUD_KEY && profileName && profileName !== phone) {
        try {
          await fetch('https://api.ycloud.com/v2/contacts', {
            method: 'POST',
            headers: { 'X-API-Key': YCLOUD_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phone, name: profileName }),
          });
        } catch(e) {}
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: 'YCloud webhook active' });
}
