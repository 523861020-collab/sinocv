// SINOCV CRM — enhanced contact detection
(function() {
  'use strict';

  const API = 'https://truck-export-pi-xi.vercel.app/api/crm';
  let panel, currentPhone, currentName;

  function init() {
    if (document.getElementById('sinocv-crm-panel')) return;
    createPanel();
    startObserver();
  }

  function createPanel() {
    panel = document.createElement('div');
    panel.id = 'sinocv-crm-panel';
    panel.innerHTML = `
      <div id="sinocv-header">
        <h3>📋 SINOCV CRM</h3>
        <button id="sinocv-toggle">−</button>
      </div>
      <div id="sinocv-body">
        <div id="sinocv-contact">
          <div id="sinocv-name" style="font-size:16px;font-weight:600;margin-bottom:4px">Select a chat</div>
          <div id="sinocv-phone" style="font-size:13px;color:#9ca3af"></div>
          <button id="sinocv-btn-detect" style="margin-top:8px;padding:4px 12px;border-radius:4px;background:#374151;color:#e5e7eb;border:none;cursor:pointer;font-size:12px">🔍 Re-scan</button>
        </div>
        <div id="sinocv-form">
          <label class="sinocv-label">Name</label>
          <input type="text" id="sinocv-input-name" placeholder="Customer name" />
          <label class="sinocv-label">Email</label>
          <input type="email" id="sinocv-input-email" placeholder="Email" />
          <label class="sinocv-label">Country</label>
          <input type="text" id="sinocv-input-country" placeholder="Country" />
          <label class="sinocv-label">Company</label>
          <input type="text" id="sinocv-input-company" placeholder="Company" />
          <label class="sinocv-label">Product Interest</label>
          <select id="sinocv-input-product">
            <option value="">Select</option>
            <option value="tractor">Tractor Truck</option>
            <option value="dump">Dump Truck</option>
            <option value="mixer">Mixer Truck</option>
            <option value="trailer">Trailer</option>
            <option value="machinery">Machinery</option>
            <option value="mining">Mining Truck</option>
            <option value="light">Light Vehicle</option>
          </select>
          <label class="sinocv-label">PI Number</label>
          <input type="text" id="sinocv-input-pi" placeholder="PI-2026-001" />
          <label class="sinocv-label">Notes</label>
          <textarea id="sinocv-input-notes" rows="3" placeholder="Notes..."></textarea>
          <div id="sinocv-actions">
            <button id="sinocv-btn-save" class="sinocv-btn-primary">💾 Save</button>
          </div>
          <div id="sinocv-status"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('sinocv-toggle').onclick = () => {
      const body = document.getElementById('sinocv-body');
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
      document.getElementById('sinocv-toggle').textContent = body.style.display === 'none' ? '+' : '−';
    };
    document.getElementById('sinocv-btn-save').onclick = saveContact;
    document.getElementById('sinocv-btn-detect').onclick = scanChat;
  }

  // Multiple strategies to detect contact info
  function scanChat() {
    let name = '', phone = '';

    // Strategy 1: WhatsApp Web header title
    const headerTitle = document.querySelector('header [title]');
    if (headerTitle) {
      const title = headerTitle.getAttribute('title') || '';
      // Check if title contains "name, +phone" format
      const parts = title.split(',');
      if (parts.length >= 1) {
        name = parts[0].trim();
        // Check if second part is a phone number
        if (parts.length >= 2 && /\d/.test(parts[1])) {
          phone = parts[1].replace(/\s/g, '');
        }
      }
    }

    // Strategy 2: Look for the main header span
    if (!name) {
      const mainHeader = document.querySelector('header span[dir="auto"]');
      if (mainHeader) name = mainHeader.textContent.trim();
    }

    // Strategy 3: Try data-testid attribute
    if (!name) {
      const testIdHeader = document.querySelector('[data-testid="conversation-info-header"]');
      if (testIdHeader) name = testIdHeader.textContent.trim().split(',')[0];
    }

    // Strategy 4: URL-based phone extraction
    if (!phone) {
      const urlMatch = window.location.href.match(/phone=(\+\d+)/);
      if (urlMatch) phone = urlMatch[1];
    }

    // Strategy 5: Try any element with phone-like text
    if (!phone) {
      const allText = document.querySelectorAll('span[dir="auto"]');
      allText.forEach(el => {
        const match = el.textContent.match(/\+?\d{8,15}/);
        if (match && !phone) phone = match[0];
      });
    }

    if (name) {
      currentName = name;
      document.getElementById('sinocv-name').innerHTML = '👤 <b>' + name + '</b>';
      if (phone) {
        currentPhone = phone;
        document.getElementById('sinocv-phone').textContent = '📱 ' + phone;
        loadContactData(phone);
      } else {
        document.getElementById('sinocv-phone').textContent = '⚠️ Phone not found — check URL';
      }
    } else {
      document.getElementById('sinocv-name').textContent = '⚠️ Click a chat, then press Re-scan';
    }
  }

  // Observe DOM for chat changes
  function startObserver() {
    let lastUrl = '';
    const check = () => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(scanChat, 500);
      }
    };

    // Also observe header changes
    const mo = new MutationObserver(() => {
      check();
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    setInterval(check, 1000);
  }

  async function loadContactData(phone) {
    try {
      const res = await fetch(`${API}?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.contact) {
        document.getElementById('sinocv-input-name').value = data.contact.name || '';
        document.getElementById('sinocv-input-email').value = data.contact.email || '';
        document.getElementById('sinocv-input-country').value = data.contact.country || '';
        document.getElementById('sinocv-input-company').value = data.contact.company || '';
        document.getElementById('sinocv-input-product').value = data.contact.product || '';
        document.getElementById('sinocv-input-pi').value = data.contact.pi || '';
        document.getElementById('sinocv-input-notes').value = data.contact.notes || '';
      }
    } catch(e) {}
  }

  async function saveContact() {
    const status = document.getElementById('sinocv-status');
    if (!currentPhone) {
      status.textContent = 'No phone detected — click a chat first';
      status.className = 'sinocv-status-error';
      return;
    }
    status.textContent = 'Saving...';
    status.className = '';
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhone,
          name: document.getElementById('sinocv-input-name').value || currentName,
          email: document.getElementById('sinocv-input-email').value,
          country: document.getElementById('sinocv-input-country').value,
          company: document.getElementById('sinocv-input-company').value,
          product: document.getElementById('sinocv-input-product').value,
          pi: document.getElementById('sinocv-input-pi').value,
          notes: document.getElementById('sinocv-input-notes').value,
        })
      });
      if (res.ok) {
        status.textContent = '✓ Saved';
        status.className = 'sinocv-status-ok';
      } else {
        status.textContent = 'Error saving';
        status.className = 'sinocv-status-error';
      }
    } catch(e) {
      status.textContent = 'Network error';
      status.className = 'sinocv-status-error';
    }
    setTimeout(() => { status.textContent = ''; }, 2000);
  }

  // Start
  const timer = setInterval(() => {
    const app = document.querySelector('#app');
    if (app) { clearInterval(timer); setTimeout(init, 1500); }
  }, 500);
})();
