// YCloud Contact Sync v3 — also syncs to SINOCV CRM
const YC_KEY = '9590009a85b9edf2f44edfc92b6737ac';
const CRM_API = 'https://truckmarts.com/api/crm';

async function ycSync(phone, name) {
  try {
    const r = await fetch('https://api.ycloud.com/v2/contacts', {
      method: 'POST',
      headers: { 'X-API-Key': YC_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, name: name }),
    });
    console.log('✅ YCloud:', phone, '→', name);

    // Also sync to our CRM
    await fetch(CRM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, source: 'whatsapp_store' }),
    });
  } catch (e) { console.error('Sync:', e); }
}

// Use WhatsApp Web internal Store to get all contacts
function scanAndSync() {
  const store = window.Store || window.Debug?.VERSION;
  if (!store) return setTimeout(scanAndSync, 2000);

  try {
    const contacts = store.Contact?.models || store.Contact?.getModelsArray?.();
    if (contacts) {
      contacts.forEach(c => {
        const phone = c?.id?.user || c?.formattedName || '';
        const name = c?.name || c?.pushname || c?.verifiedName || '';
        if (phone && name && phone !== name && !c._ycSynced) {
          c._ycSynced = true;
          ycSync(phone, name);
        }
      });
    }
  } catch (e) {}

  // Also watch for new messages to catch unknown contacts
  const chats = store.Chat?.models || store.Chat?.getModelsArray?.();
  if (chats) {
    chats.forEach(chat => {
      if (chat._ycSynced) return;
      const contact = chat.contact || chat.__x_contact;
      if (contact) {
        const phone = contact.id?.user || contact.formattedName || '';
        const name = contact.name || contact.pushname || contact.verifiedName || '';
        if (phone && name && phone !== name && !chat._ycSynced) {
          chat._ycSynced = true;
          ycSync(phone, name);
        }
      }
    });
  }
}

// Keep scanning every 10 seconds for new contacts
setInterval(scanAndSync, 10000);
scanAndSync();
