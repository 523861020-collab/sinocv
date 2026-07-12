// SINOCV CRM Background Service — reminders & alarms
const API = 'https://truck-export-pi-xi.vercel.app/api/crm';

// Check reminders every hour
chrome.alarms.create('check-reminders', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'check-reminders') {
    await checkReminders();
  }
});

// Also check on startup
chrome.runtime.onStartup.addListener(checkReminders);
chrome.runtime.onInstalled.addListener(checkReminders);

async function checkReminders() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if today is a holiday
    const holidayRes = await fetch(`${API}/holidays?date=${today}`);
    const holidayData = await holidayRes.json();
    if (holidayData.isHoliday) {
      console.log('Today is a holiday, skipping reminders');
      return;
    }

    // Get contacts due for follow-up
    const res = await fetch(`${API}/reminders/due`);
    const data = await res.json();
    const due = data.contacts || [];

    if (due.length > 0) {
      const count = due.length;
      const names = due.map(c => c.name || c.phone).slice(0, 5).join(', ');
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        title: `📋 ${count} customers need follow-up`,
        message: names + (count > 5 ? ` and ${count - 5} more` : ''),
        priority: 2,
      });

      // Store notification data
      chrome.storage.local.set({ lastReminder: { date: today, count, contacts: due } });
    }
  } catch(e) {
    console.error('Reminder check failed:', e);
  }
}

// Open dashboard when extension icon clicked
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: 'dashboard.html',
    type: 'popup',
    width: 1100,
    height: 750,
  });
});
