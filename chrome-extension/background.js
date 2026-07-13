// Background — opens side panel + injects sync scripts into WhatsApp Web
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
});

// Inject scripts into existing WhatsApp Web tabs when extension loads
async function injectToWhatsApp() {
  const tabs = await chrome.tabs.query({ url: '*://web.whatsapp.com/*' });
  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['js/wa-js.js'] });
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['js/time-tracker.js'] });
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['js/ycloud-sync.js'] });
      console.log('✅ Injected sync scripts into tab', tab.id);
    } catch(e) { console.error('Inject failed:', e); }
  }
}

// Inject on install/startup
chrome.runtime.onInstalled.addListener(injectToWhatsApp);
chrome.runtime.onStartup.addListener(injectToWhatsApp);

// Also inject on demand (from sidepanel)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'injectSync') {
    injectToWhatsApp().then(() => sendResponse({ ok: true }));
    return true;
  }
});
