// Background service worker
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function(){});

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action === 'openSidepanel') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length) chrome.sidePanel.open({ windowId: tabs[0].windowId });
    });
  }
  if (msg.action === 'openWhatsApp') {
    chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, { active: true });
        chrome.windows.update(tabs[0].windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: 'https://web.whatsapp.com' });
      }
    });
  }
  if (msg.action === 'syncToCRM') { return true; }
  if (msg.action === 'fetchFromCRM') { return true; }
});

var CRM_API = 'http://47.96.255.110/api/crm';
