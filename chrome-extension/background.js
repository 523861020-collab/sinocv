// SINOCV CRM Background — reminders + side panel control
const API = 'https://truck-export-pi-xi.vercel.app/api/crm';

// Check reminders every 60 minutes
chrome.alarms.create('check-reminders', { periodInMinutes: 60 });
chrome.runtime.onInstalled.addListener(checkReminders);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'check-reminders') await checkReminders();
});

// Open side panel when extension icon clicked
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url?.includes('web.whatsapp.com')) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } else {
    // Open WhatsApp Web + side panel
    const tabs = await chrome.tabs.query({ url: '*://web.whatsapp.com/*' });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { active: true });
      await chrome.sidePanel.open({ windowId: tabs[0].windowId });
    } else {
      const newTab = await chrome.tabs.create({ url: 'https://web.whatsapp.com' });
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === newTab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.sidePanel.open({ windowId: newTab.windowId });
        }
      });
    }
  }
});

async function checkReminders() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const holidayRes = await fetch(`${API}/holidays?date=${today}`);
    const holidayData = await holidayRes.json();
    if (holidayData.isHoliday) return;

    const res = await fetch(`${API}/reminders/due`);
    const data = await res.json();
    const due = data.contacts || [];

    if (due.length > 0) {
      const names = due.map(c => c.name || c.phone).slice(0, 5).join(', ');
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon/48.png',
        title: `📋 ${due.length} customers need follow-up`,
        message: names + (due.length > 5 ? ` and ${due.length - 5} more` : ''),
        priority: 2,
      });
    }
  } catch(e) { console.error('Reminder check:', e); }
}
