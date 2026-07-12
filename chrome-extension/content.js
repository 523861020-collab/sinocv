// SINOCV CRM v2 — Auto-detect from URL, query our DB
(function() {
  'use strict';

  const API = 'https://truck-export-pi-xi.vercel.app/api/crm';
  let panel, currentPhone, currentName;

  function init() {
    if (document.getElementById('sinocv-crm-panel')) return;
    createPanel();
    startWatcher();
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
  }

  // Extract phone from WhatsApp Web URL or DOM
  function extractPhone() {
    // Method 1: URL hash
    const hash = window.location.hash;
    const urlMatch = hash.match(/phone=(\+\d+)/);
    if (urlMatch) return { phone: urlMatch[1] };

    // Method 2: Header title attribute (name, +1xxx format)
    const header = document.querySelector('header [title]');
    if (header) {
      const title = header.getAttribute('title') || '';
      const phoneMatch = title.match(/\+[\d\s]{7,20}/);
      if (phoneMatch) {
        return {
          phone: phoneMatch[0].replace(/\s/g, ''),
          name: title.split(',')[0].trim()
        };
      }
    }

    // Method 3: Any element with a phone pattern
    const spans = document.querySelectorAll('span');
    for (const s of spans) {
      const m = s.textContent.match(/\+[\d]{7,15}/);
      if (m && !s.textContent.includes('GMT') && !s.textContent.includes('active')) {
        return { phone: m[0] };
      }
    }

    return null;
  }

  function startWatcher() {
    let lastHash = '';
    setInterval(() => {
      const hash = window.location.hash;
      if (hash !== lastHash) {
        lastHash = hash;
        setTimeout(checkChat, 600);
      }
    }, 1000);

    // Also watch for chat header changes
    const mo = new MutationObserver(() => {
      setTimeout(checkChat, 400);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  async function checkChat() {
    const info = extractPhone();
    if (!info || !info.phone) {
      document.getElementById('sinocv-name').textContent = 'No chat selected';
      document.getElementById('sinocv-phone').textContent = '';
      return;
    }

    currentPhone = info.phone;
    const displayName = info.name || 'Customer';
    currentName = displayName;
    document.getElementById('sinocv-name').innerHTML = '👤 <b>' + displayName + '</b>';
    document.getElementById('sinocv-phone').textContent = '📱 ' + info.phone;

    // Query our database
    try {
      const res = await fetch(`${API}?phone=${encodeURIComponent(info.phone)}`);
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
      status.textContent = 'No phone detected';
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
        status.textContent = 'Error';
        status.className = 'sinocv-status-error';
      }
    } catch(e) {
      status.textContent = 'Network error';
      status.className = 'sinocv-status-error';
    }
    setTimeout(() => { status.textContent = ''; }, 2000);
  }

  const timer = setInterval(() => {
    if (document.querySelector('#app')) { clearInterval(timer); setTimeout(init, 1000); }
  }, 500);
})();
