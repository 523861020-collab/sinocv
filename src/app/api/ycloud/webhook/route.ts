// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const YCLOUD_KEY = process.env.YCLOUD_API_KEY || '';

if (!(global as any)._contacts) (global as any)._contacts = new Map();
if (!(global as any)._followUps) (global as any)._followUps = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const type = body?.type;

  if (type === 'whatsapp.message.updated' && body?.whatsappMessage) {
    const msg = body.whatsappMessage;
    const phone = msg.from || msg.to;
    if (!phone) return NextResponse.json({ success: true });

    const today = new Date().toISOString().split('T')[0];
    const existing = (global as any)._contacts.get(phone) || {};

    if (msg.direction === 'inbound') {
      // New inquiry from customer
      const profileName = msg?.contact?.profile?.name || '';
      (global as any)._contacts.set(phone, {
        ...existing, phone,
        name: profileName || existing.name || phone,
        firstSeen: existing.firstSeen || new Date().toISOString(),
        lastMessage: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'whatsapp',
      });
      // Update YCloud contact name
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

    if (msg.direction === 'outbound') {
      // Employee sent a message — check if it's a follow-up
      // A follow-up = this contact existed BEFORE today (not a new inquiry)
      const contactExistedBefore = existing.firstSeen && existing.firstSeen.split('T')[0] < today;
      
      if (contactExistedBefore) {
        (global as any)._followUps.push({
          phone, date: today,
          time: new Date().toISOString(),
          type: 'follow_up',
          contactName: existing.name || phone,
        });
      }

      // Update contact's last contact time
      (global as any)._contacts.set(phone, {
        ...existing,
        lastContactedAt: new Date().toISOString(),
        lastContactedDate: today,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: 'YCloud webhook active' });
}
