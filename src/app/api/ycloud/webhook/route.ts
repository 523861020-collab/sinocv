// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const YCLOUD_KEY = process.env.YCLOUD_API_KEY || '';

// WhatsApp number → employee mapping (stores both with/without +)
const WA_OWNER_MAP: Record<string,string> = {};
function setWA(num: string, name: string) {
  WA_OWNER_MAP[num] = name;
  WA_OWNER_MAP[num.replace(/^\+/,'')] = name;
  if(!num.startsWith('+')) WA_OWNER_MAP['+'+num] = name;
}
setWA('+8615715313849', '毛振威');
setWA('+8613523034981', '赵欢乐');
setWA('+8615903993573', '杜飞跃');
setWA('+86119103781257', '王小涵');

function findOwner(waNumber: string): string {
  return WA_OWNER_MAP[waNumber] || WA_OWNER_MAP[waNumber.replace(/^\+/,'')] || '';
}

if (!(global as any)._contacts) (global as any)._contacts = new Map();
if (!(global as any)._followUps) (global as any)._followUps = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const type = body?.type;

  if (type === 'whatsapp.message.updated' && body?.whatsappMessage) {
    const msg = body.whatsappMessage;
    const phone = msg.from || msg.to; // customer phone
    const waNumber = msg.to || '';    // our WhatsApp number that received/sent
    if (!phone) return NextResponse.json({ success: true });

    const today = new Date().toISOString().split('T')[0];
    const existing = (global as any)._contacts.get(phone) || {};
    const owner = findOwner(waNumber) || existing.owner || '';

    if (msg.direction === 'inbound') {
      const profileName = msg?.contact?.profile?.name || '';
      (global as any)._contacts.set(phone, {
        ...existing, phone,
        name: profileName || existing.name || phone,
        owner: existing.owner || owner, // assign to WA owner if first contact
        firstSeen: existing.firstSeen || new Date().toISOString(),
        lastMessage: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'whatsapp',
      });
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
      const contactExistedBefore = existing.firstSeen && existing.firstSeen.split('T')[0] < today;
      if (contactExistedBefore) {
        (global as any)._followUps.push({
          phone, date: today,
          time: new Date().toISOString(),
          type: 'follow_up',
          contactName: existing.name || phone,
          byEmployee: owner,
        });
      }
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
