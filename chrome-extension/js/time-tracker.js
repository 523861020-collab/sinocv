// SINOCV Time Tracker — monitors WhatsApp activity + message sends
(function(){
  'use strict';
  let lastActivity = Date.now();
  let sessionStart = Date.now();
  const USER = localStorage.getItem('sinocv_user') || 'unknown';
  let lastSentPhone = '';

  function heartbeat() {
    lastActivity = Date.now();
    saveState();
  }

  function saveState() {
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_time_${today}`;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
    data.user = USER;
    data.lastActivity = lastActivity;
    data.sessionStart = data.sessionStart || sessionStart;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Monitor user activity
  document.addEventListener('click', heartbeat);
  document.addEventListener('keydown', heartbeat);
  document.addEventListener('scroll', heartbeat);

  // Detect sent messages by watching for outgoing message bubbles
  function watchSentMessages() {
    const msgs = document.querySelectorAll('div.message-out');
    msgs.forEach(msg => {
      if (msg.dataset.sinocvTracked) return;
      msg.dataset.sinocvTracked = '1';
      
      // Extract current chat phone from URL
      const hash = window.location.hash;
      const phoneMatch = hash.match(/phone=(\+\d+)/);
      if (phoneMatch) {
        lastSentPhone = phoneMatch[1];
        const today = new Date().toISOString().split('T')[0];
        const key = `sinocv_msgs_${today}`;
        let data;
        try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
        data[lastSentPhone] = (data[lastSentPhone] || 0) + 1;
        data.user = USER;
        localStorage.setItem(key, JSON.stringify(data));
        
        // Sync to backend immediately
        fetch('https://truck-export-pi-xi.vercel.app/api/crm/time', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            user: USER, date: today, phone: lastSentPhone,
            type: 'message_sent', timestamp: Date.now()
          }),
        }).catch(()=>{});
      }
    });
  }

  setInterval(watchSentMessages, 5000);
  setInterval(heartbeat, 10000);

  // Listen for message inserts from CRM
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'insertScript') {
      const input = document.querySelector('div[contenteditable="true"][role="textbox"]') 
        || document.querySelector('footer div[contenteditable="true"]');
      if (input) {
        input.focus();
        input.textContent = '';
        document.execCommand('insertText', false, msg.text);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      sendResponse({ ok: true });
      heartbeat();
    }
    return true;
  });

  // Sync to backend periodically
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

  window.addEventListener('beforeunload', () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_time_${today}`;
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e) { data = {}; }
    data.endTime = Date.now();
    data.date = today; data.user = USER;
    localStorage.setItem(key, JSON.stringify(data));
    fetch('https://truck-export-pi-xi.vercel.app/api/crm/time', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data),
    }).catch(()=>{});
  });

  // Provide API for side panel to check if message was sent to this phone today
  window._sinocvCheckSent = function(phone) {
    const today = new Date().toISOString().split('T')[0];
    const key = `sinocv_msgs_${today}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return (data[phone] || 0) > 0;
    } catch(e) { return false; }
  };

  heartbeat();
})();

