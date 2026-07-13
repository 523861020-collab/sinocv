// YCloud Contact Sync v4 — robust phone extraction + name push
const YC_KEY = '9590009a85b9edf2f44edfc92b6737ac';
const CRM_API = 'https://truckmarts.com/api/crm';

// Extract phone from WhatsApp contact object (multiple fallbacks)
function getPhone(c) {
  if (!c) return '';
  if (c.id?.user) return c.id.user;
  if (c.id?._serialized) {
    const parts = c.id._serialized.split('@');
    return parts[0] || '';
  }
  if (c.formattedName && /^\d+$/.test(c.formattedName)) return c.formattedName;
  return '';
}

// Extract name from WhatsApp contact
function getName(c) {
  if (!c) return '';
  return c.name || c.pushname || c.verifiedName || c.shortName || c.formattedName || '';
}

function shouldSync(phone, name) {
  return phone && name && phone !== name && phone.length >= 8;
}

async function ycSync(phone, name) {
  try {
    // 1. Push name to YCloud (updates WhatsApp display name)
    await fetch('https://api.ycloud.com/v2/contacts', {
      method: 'POST',
      headers: { 'X-API-Key': YC_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, name: name }),
    });
    console.log('✅ YCloud:', phone, '→', name);

    // 2. Sync to our CRM
    await fetch(CRM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, source: 'whatsapp_store' }),
    });
  } catch (e) { console.error('Sync err:', e); }
}

// Scan WhatsApp Store for contacts
function scanAndSync() {
  try {
    const store = window.Store;
    if (!store) return;

    // Method 1: Contact models
    const contacts = store.Contact?.models || store.Contact?.getModelsArray?.() || [];
    for (const c of contacts) {
      if (c._ycSynced) continue;
      const phone = getPhone(c);
      const name = getName(c);
      if (shouldSync(phone, name)) {
        c._ycSynced = true;
        ycSync(phone, name);
      }
    }

    // Method 2: Chat models (catches contacts not in contact list)
    const chats = store.Chat?.models || store.Chat?.getModelsArray?.() || [];
    for (const chat of chats) {
      if (chat._ycSynced) continue;
      const c = chat.contact || chat.__x_contact;
      if (!c) continue;
      const phone = getPhone(c);
      const name = getName(c);
      if (shouldSync(phone, name)) {
        chat._ycSynced = true;
        ycSync(phone, name);
      }
    }
    
    console.log('🔍 Scanned', contacts.length, 'contacts,', chats.length, 'chats');
  } catch (e) { console.error('Scan err:', e); }
}

// Start scanning after WhatsApp Web loads
function waitForStore() {
  if (window.Store) {
    console.log('🚀 YCloud Sync started');
    scanAndSync();
    setInterval(scanAndSync, 15000);
  } else {
    setTimeout(waitForStore, 2000);
  }
}
waitForStore();
