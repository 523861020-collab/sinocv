// Background — side panel + inject content script + storage bridge
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function() {});

chrome.action.onClicked.addListener(function(tab) {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(function() {});
});

// Inject content.js when WhatsApp Web loads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.indexOf('web.whatsapp.com') > -1) {
    chrome.scripting.executeScript({ target: { tabId: tabId }, files: ['content.js'] }).catch(function(){});
  }
});

// Receive chat data from content.js, write to storage
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === 'waChat') {
    chrome.storage.local.set({ wa_active_chat: { phone: msg.phone, name: msg.name, time: msg.time } });
  }
  if (msg.type === 'waDiag') {
    chrome.storage.local.set({ wa_diag: { storeReady: msg.storeReady, hasChat: msg.hasChat } });
  }
});
