document.getElementById('btn-open-wa').onclick = () => {
  chrome.tabs.create({ url: 'https://web.whatsapp.com' });
};
document.getElementById('btn-dashboard').onclick = () => {
  chrome.tabs.create({ url: 'https://truckmarts.com/admin' });
};

// Load stats
(async () => {
  try {
    const res = await fetch('https://truckmarts.com/api/crm/stats');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('stat-contacts').textContent = data.contacts || 0;
      document.getElementById('stat-pi').textContent = data.pis || 0;
    }
  } catch(e) {}
})();
