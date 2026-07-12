// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const YCLOUD_KEY = process.env.YCLOUD_API_KEY || '';

// In-memory shared store
if (!(global as any)._crmStore) (global as any)._crmStore = new Map();

// GET /api/crm?phone=+8612345678 — returns contact from YCloud + local notes
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }

  // Try YCloud first for name/attributes
  let ycContact = null;
  if (YCLOUD_KEY) {
    try {
      const res = await fetch(
        `https://api.ycloud.com/v2/contacts?phoneNumber=${encodeURIComponent(phone)}&limit=1`,
        { headers: { 'X-API-Key': YCLOUD_KEY } }
      );
      if (res.ok) {
        const data = await res.json();
        ycContact = data?.data?.[0];
      }
    } catch(e) { console.error('YCloud lookup:', e); }
  }

  // Merge with local notes
  const local = (global as any)._crmStore.get(phone) || {};
  const merged = {
    phone,
    name: local.name || ycContact?.name || ycContact?.nickname || '',
    country: local.country || ycContact?.attributes?.country || '',
    email: local.email || ycContact?.attributes?.email || '',
    company: local.company || ycContact?.attributes?.company || '',
    tags: ycContact?.tags || [],
    product: local.product || '',
    pi: local.pi || '',
    notes: local.notes || '',
    ycId: ycContact?.id || '',
    updatedAt: local.updatedAt || '',
  };

  return NextResponse.json({ contact: merged });
}

// POST /api/crm — save contact locally + update YCloud contact
export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = body.phone;
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  // Save locally
  const local = (global as any)._crmStore.get(phone) || {};
  const updated = { ...local, ...body, updatedAt: new Date().toISOString() };
  (global as any)._crmStore.set(phone, updated);

  // Update YCloud contact
  if (YCLOUD_KEY) {
    try {
      // Check if contact exists
      const checkRes = await fetch(
        `https://api.ycloud.com/v2/contacts?phoneNumber=${encodeURIComponent(phone)}&limit=1`,
        { headers: { 'X-API-Key': YCLOUD_KEY } }
      );
      const checkData = await checkRes.json();
      const existingId = checkData?.data?.[0]?.id;

      const ycPayload = {
        name: body.name || body.email || phone,
        attributes: {} as any,
      };
      if (body.email) ycPayload.attributes.email = body.email;
      if (body.country) ycPayload.attributes.country = body.country;
      if (body.company) ycPayload.attributes.company = body.company;

      if (existingId) {
        // Update existing
        await fetch(`https://api.ycloud.com/v2/contacts/${existingId}`, {
          method: 'PATCH',
          headers: { 'X-API-Key': YCLOUD_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify(ycPayload),
        });
      } else {
        // Create new
        await fetch('https://api.ycloud.com/v2/contacts', {
          method: 'POST',
          headers: { 'X-API-Key': YCLOUD_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone, ...ycPayload }),
        });
      }
    } catch(e) { console.error('YCloud update:', e); }
  }

  return NextResponse.json({ success: true, contact: updated });
}
