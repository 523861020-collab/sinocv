// SINOCV Time Tracker — monitors WhatsApp activity
(function(){
  'use strict';
  let lastActivity = Date.now();
  let msgCount = 0;
  let sessionStart = Date.now();
  const USER = localStorage.getItem('sinocv_user') || 'unknown';

  function heartbeat() {
    lastActivity = Date.now();
    // Save activity every 30 seconds
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_time_${today}`;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
    data.user = USER;
    data.lastActivity = lastActivity;
    data.sessionStart = data.sessionStart || sessionStart;
    data.msgCount = data.msgCount || 0;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Monitor user activity
  document.addEventListener('click', heartbeat);
  document.addEventListener('keydown', heartbeat);
  document.addEventListener('scroll', heartbeat);

  // Monitor WhatsApp send button clicks
  setInterval(() => {
    // Detect sent messages via the send button or Enter in input
    const sendBtn = document.querySelector('button[data-tab="11"]') || document.querySelector('span[data-icon="send"]');
    if (sendBtn) {
      const observer = new MutationObserver(() => heartbeat());
      observer.observe(sendBtn, { attributes: true });
    }
    heartbeat();
  }, 10000);

  // Listen for message inserts from CRM
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'insertScript') {
      insertIntoChat(msg.text);
      sendResponse({ ok: true });
      msgCount++;
      heartbeat();
    }
    return true;
  });

  function insertIntoChat(text) {
    const input = document.querySelector('div[contenteditable="true"][role="textbox"]') 
      || document.querySelector('footer div[contenteditable="true"]');
    if (!input) return;
    input.focus();
    input.textContent = '';
    document.execCommand('insertText', false, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Initial heartbeat
  heartbeat();
  // Save end-of-day data when tab closes
  window.addEventListener('beforeunload', () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_time_${today}`;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
    data.endTime = Date.now();
    data.date = today;
    data.user = USER;
    localStorage.setItem(key, JSON.stringify(data));
    // Sync to backend
    fetch('https://truck-export-pi-xi.vercel.app/api/crm/time', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data),
    }).catch(()=>{});
  });

  // Also sync every 5 minutes while working
  setInterval(() => {
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_time_${today}`;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
    data.date = today; data.user = USER; data.lastActivity = lastActivity;
    fetch('https://truck-export-pi-xi.vercel.app/api/crm/time', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data),
    }).catch(()=>{});
  }, 300000);
})();
