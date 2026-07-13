// SINOCV CRM Dashboard Logic
const API = 'https://truckmarts.com/api/crm';
let allContacts = [], selectedContact = null, currentFilter = 'all';

// Load contacts on start
(async function init() {
  await loadContacts();
  renderContactList();
  renderStats();

  // Auto-refresh every 30s
  setInterval(async () => {
    await loadContacts();
    renderContactList();
  }, 30000);
})();

async function loadContacts() {
  try {
    const res = await fetch(`${API}?action=all`);
    if (res.ok) {
      const data = await res.json();
      allContacts = data.contacts || [];
    }
  } catch(e) {}
}

function filterCategory(cat, el) {
  currentFilter = cat;
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderContactList();
}

function renderContactList() {
  const search = (document.getElementById('search')?.value || '').toLowerCase();
  let filtered = allContacts;

  if (currentFilter === 'A') filtered = allContacts.filter(c => c.category === 'A');
  else if (currentFilter === 'B') filtered = allContacts.filter(c => c.category === 'B');
  else if (currentFilter === 'C') filtered = allContacts.filter(c => c.category === 'C');
  else if (currentFilter === 'new') filtered = allContacts.filter(c => !c.category || c.category === '');

  if (search) {
    filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(search) ||
      (c.phone || '').includes(search) ||
      (c.company || '').toLowerCase().includes(search)
    );
  }

  const list = document.getElementById('contactList');
  list.innerHTML = filtered.map(c => {
    const tag = c.category ? `<span class="tag tag-${c.category.toLowerCase()}">${c.category}</span>` : '<span class="tag tag-new">NEW</span>';
    const name = c.name || c.phone || 'Unknown';
    const phone = c.phone ? c.phone.replace('+', '') : '';
    return `<li class="contact-item" onclick="selectContact('${c.phone}')">
      <div class="name">${name} ${tag}</div>
      <div class="phone">📱 ${phone}</div>
    </li>`;
  }).join('');
}

function selectContact(phone) {
  selectedContact = allContacts.find(c => c.phone === phone);
  if (!selectedContact) return;
  renderDetail();
}

function renderDetail() {
  const c = selectedContact;
  if (!c) return;

  const nextFollowUp = getNextFollowUp(c);
  const daysUntil = nextFollowUp ? Math.ceil((new Date(nextFollowUp) - new Date()) / 86400000) : 0;

  document.getElementById('main').innerHTML = `
    <div class="reminder-bar">
      <div>
        <span style="color:#9ca3af;font-size:13px;">Next follow-up: </span>
        <span class="next-date">${nextFollowUp || 'Not set'}</span>
        ${daysUntil > 0 ? `<span class="countdown"> (${daysUntil} days)</span>` : ''}
      </div>
      <button class="btn btn-sm btn-secondary" onclick="markFollowedUp()">✅ Mark Done</button>
    </div>

    <div class="detail-header">
      <h2>${c.name || c.phone}</h2>
      <select class="category-select" id="catSelect" onchange="updateCategory(this.value)">
        <option value="">Category</option>
        <option value="A" ${c.category==='A'?'selected':''}>A — 10 days</option>
        <option value="B" ${c.category==='B'?'selected':''}>B — 30 days</option>
        <option value="C" ${c.category==='C'?'selected':''}>C — 60 days</option>
      </select>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Phone</label>
        <input value="${c.phone||''}" id="edtPhone" readonly style="opacity:0.7">
      </div>
      <div class="form-group">
        <label>Name</label>
        <input value="${c.name||''}" id="edtName">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input value="${c.email||''}" id="edtEmail">
      </div>
      <div class="form-group">
        <label>Country</label>
        <input value="${c.country||''}" id="edtCountry">
      </div>
      <div class="form-group">
        <label>Company</label>
        <input value="${c.company||''}" id="edtCompany">
      </div>
      <div class="form-group">
        <label>Product Interest</label>
        <select id="edtProduct">
          <option value="">Select</option>
          <option value="tractor" ${c.product==='tractor'?'selected':''}>Tractor Truck</option>
          <option value="dump" ${c.product==='dump'?'selected':''}>Dump Truck</option>
          <option value="mixer" ${c.product==='mixer'?'selected':''}>Mixer Truck</option>
          <option value="trailer" ${c.product==='trailer'?'selected':''}>Trailer</option>
          <option value="machinery" ${c.product==='machinery'?'selected':''}>Machinery</option>
          <option value="mining" ${c.product==='mining'?'selected':''}>Mining Truck</option>
          <option value="light" ${c.product==='light'?'selected':''}>Light Vehicle</option>
        </select>
      </div>
      <div class="form-group form-full">
        <label>Notes</label>
        <textarea id="edtNotes">${c.notes||''}</textarea>
      </div>
    </div>

    <div class="section-title">📄 PI Documents</div>
    <div id="piList" class="pi-list">${renderPIList(c.pis||[])}</div>
    <div style="margin-top:8px;display:flex;gap:8px;">
      <input type="text" id="piNumber" placeholder="PI number..." style="flex:1;padding:6px 10px;border-radius:4px;background:#1f2937;border:1px solid #374151;color:#e5e7eb;font-size:12px;">
      <input type="date" id="piDate" style="padding:6px 10px;border-radius:4px;background:#1f2937;border:1px solid #374151;color:#e5e7eb;font-size:12px;">
      <button class="btn btn-sm btn-primary" onclick="addPI()">+ Add PI</button>
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick="saveDetail()">💾 Save</button>
      <button class="btn btn-secondary" onclick="openWhatsApp()">💬 Open Chat</button>
    </div>
  `;
}

function renderPIList(pis) {
  if (!pis || pis.length === 0) return '<div style="color:#6b7280;font-size:12px;">No PI documents</div>';
  return pis.map(pi => `
    <div class="pi-item">
      <span class="pi-num">${pi.number}</span>
      <span class="pi-date">${pi.date || ''}</span>
      <span style="flex:1">${pi.status||''}</span>
      <button class="btn btn-sm btn-danger" onclick="removePI('${pi.number}')">✕</button>
    </div>
  `).join('');
}

function getNextFollowUp(c) {
  if (!c.nextFollowUp) return null;
  return c.nextFollowUp;
}

function addPI() {
  const num = document.getElementById('piNumber').value.trim();
  const date = document.getElementById('piDate').value;
  if (!num) return;
  const pis = selectedContact.pis || [];
  pis.push({ number: num, date: date, status: 'pending' });
  selectedContact.pis = pis;
  document.getElementById('piNumber').value = '';
  document.getElementById('piDate').value = '';
  document.getElementById('piList').innerHTML = renderPIList(pis);
}

function removePI(num) {
  selectedContact.pis = (selectedContact.pis || []).filter(p => p.number !== num);
  document.getElementById('piList').innerHTML = renderPIList(selectedContact.pis);
}

async function saveDetail() {
  const updates = {
    phone: selectedContact.phone,
    name: document.getElementById('edtName').value,
    email: document.getElementById('edtEmail').value,
    country: document.getElementById('edtCountry').value,
    company: document.getElementById('edtCompany').value,
    product: document.getElementById('edtProduct').value,
    notes: document.getElementById('edtNotes').value,
    pis: selectedContact.pis,
    category: selectedContact.category,
    nextFollowUp: selectedContact.nextFollowUp,
  };

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      selectedContact = data.contact;
      await loadContacts();
      renderContactList();
      showToast('✓ Saved');
    }
  } catch(e) { showToast('Error', true); }
}

async function markFollowedUp() {
  const days = selectedContact.category === 'A' ? 10 : selectedContact.category === 'B' ? 30 : selectedContact.category === 'C' ? 60 : 30;
  const next = new Date();
  next.setDate(next.getDate() + days);

  // Skip holidays
  const holidayRes = await fetch(`${API}/holidays/next?from=${next.toISOString().split('T')[0]}`);
  if (holidayRes.ok) {
    const h = await holidayRes.json();
    if (h.nextWorkday) {
      next.setTime(Date.parse(h.nextWorkday));
    }
  }

  selectedContact.nextFollowUp = next.toISOString().split('T')[0];
  await saveDetail();
  renderDetail();
}

function updateCategory(cat) {
  selectedContact.category = cat;
  const days = cat === 'A' ? 10 : cat === 'B' ? 30 : cat === 'C' ? 60 : 30;
  const next = new Date();
  next.setDate(next.getDate() + days);
  selectedContact.nextFollowUp = next.toISOString().split('T')[0];
}

function openWhatsApp() {
  chrome.tabs.create({ url: 'https://web.whatsapp.com' });
}

function renderStats() {
  const a = allContacts.filter(c => c.category === 'A').length;
  const b = allContacts.filter(c => c.category === 'B').length;
  const c = allContacts.filter(c => c.category === 'C').length;
  const total = allContacts.length;

  document.getElementById('main').innerHTML = `
    <div class="stats-bar">
      <div class="stat"><div class="num">${total}</div><div class="label">Total</div></div>
      <div class="stat"><div class="num">${a}</div><div class="label">A-Class</div></div>
      <div class="stat"><div class="num">${b}</div><div class="label">B-Class</div></div>
      <div class="stat"><div class="num">${c}</div><div class="label">C-Class</div></div>
    </div>
    <div class="placeholder">👈 Select a contact from the sidebar</div>
  `;
}

function showToast(msg, error) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:10px 20px;border-radius:8px;color:#fff;font-size:13px;${
    error ? 'background:#dc2626;' : 'background:#059669;'
  }z-index:9999;`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
