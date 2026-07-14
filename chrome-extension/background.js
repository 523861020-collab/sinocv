// Background — side panel + inject content script into WhatsApp
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function() {});

chrome.action.onClicked.addListener(function(tab) {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(function() {});
});

// Inject content.js when WhatsApp Web loads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.indexOf('web.whatsapp.com') > -1) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(function(e) {
      console.log('Inject failed:', e);
    });
  }
});

// Also inject into existing WhatsApp tabs on extension startup
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      }).catch(function(e) {});
    });
  });
});
