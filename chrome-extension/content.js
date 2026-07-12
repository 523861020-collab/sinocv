// SINOCV CRM — WhatsApp Web Content Script
(function() {
  'use strict';

  const API = 'https://truck-export-pi-xi.vercel.app/api/crm';

  let panel, currentContact = {};

  // Wait for WhatsApp to load
  function init() {
    if (document.getElementById('sinocv-crm-panel')) return;
    createPanel();
    observe();
  }

  function createPanel() {
    // Inject sidebar panel
    panel = document.createElement('div');
    panel.id = 'sinocv-crm-panel';
    panel.innerHTML = `
      <div id="sinocv-header">
        <h3>📋 SINOCV CRM</h3>
        <button id="sinocv-toggle">−</button>
      </div>
      <div id="sinocv-body">
        <div id="sinocv-contact">
          <div class="sinocv-label">Contact</div>
          <div id="sinocv-name">Select a chat to start</div>
          <div id="sinocv-phone"></div>
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
            <button id="sinocv-btn-history" class="sinocv-btn-secondary">📜 History</button>
          </div>
          <div id="sinocv-status"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Events
    document.getElementById('sinocv-toggle').onclick = () => {
      const body = document.getElementById('sinocv-body');
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
      document.getElementById('sinocv-toggle').textContent =
        body.style.display === 'none' ? '+' : '−';
    };

    document.getElementById('sinocv-btn-save').onclick = saveContact;
    document.getElementById('sinocv-btn-history').onclick = loadHistory;
  }

  // Observe WhatsApp header for active chat
  function observe() {
    const mo = new MutationObserver(() => {
      const header = document.querySelector('header [data-testid="conversation-info-header"]');
      if (header) {
        const name = header.querySelector('[title]')?.title || header.textContent?.trim() || '';
        const titleEl = document.querySelector('header [title]');
        const phoneEl = document.querySelector('header [data-testid="conversation-info-header"]');
        if (titleEl && name && !name.includes(',')) {
          currentContact.name = name;
          document.getElementById('sinocv-name').textContent = '👤 ' + name;
          // Try to get phone from title attribute
          const fullTitle = titleEl.getAttribute('title') || '';
          const phoneMatch = fullTitle.match(/\+?\d{7,}/);
          if (phoneMatch) {
            currentContact.phone = phoneMatch[0];
            document.getElementById('sinocv-phone').textContent = '📱 ' + phoneMatch[0];
            loadContactData(phoneMatch[0]);
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
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
    status.textContent = 'Saving...';
    status.className = 'sinocv-status-loading';
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentContact.phone,
          name: document.getElementById('sinocv-input-name').value,
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

  async function loadHistory() {
    if (!currentContact.phone) return;
    try {
      const res = await fetch(`${API}/history?phone=${encodeURIComponent(currentContact.phone)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        alert('History:\n' + data.history.map(h => `${h.time}: ${h.action}`).join('\n'));
      } else {
        alert('No history for this contact');
      }
    } catch(e) {}
  }

  // Start when WhatsApp Web loads
  const check = setInterval(() => {
    const app = document.querySelector('#app');
    if (app) { clearInterval(check); setTimeout(init, 1000); }
  }, 500);
})();
