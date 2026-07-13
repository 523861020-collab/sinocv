// Background — side panel + inject on demand
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(function() {});

chrome.action.onClicked.addListener(function(tab) {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(function() {});
});

// Get current chat info from WhatsApp Web
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === 'getCurrentChat') {
    chrome.tabs.query({ url: '*://web.whatsapp.com/*', active: true }, function(tabs) {
      if (!tabs.length) return sendResponse({ ok: false, error: 'no WhatsApp tab' });
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getChatInfo
      }, function(results) {
        sendResponse({ ok: true, data: results && results[0] ? results[0].result : null });
      });
    });
    return true; // keep channel open for async
  }
});

// This function runs inside the WhatsApp Web page
function getChatInfo() {
  try {
    var store = window.Store;
    if (!store || !store.Chat) return { error: 'WhatsApp not loaded' };

    // Try to get active chat
    var chat = null;
    if (store.Chat.getActive) {
      chat = store.Chat.getActive();
    } else {
      var chats = store.Chat.getModelsArray ? store.Chat.getModelsArray() : [];
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].__x_isActive) { chat = chats[i]; break; }
      }
    }

    if (!chat) return { error: 'No active chat - click a conversation first' };

    var contact = chat.contact || chat.__x_contact;
    if (!contact) return { error: 'No contact info found' };

    var phone = '';
    if (contact.id && contact.id.user) phone = contact.id.user;
    else if (contact.id && contact.id._serialized) phone = contact.id._serialized.split('@')[0];

    var name = contact.name || contact.pushname || contact.verifiedName || contact.shortName || phone || '';

    return { phone: phone, name: name };
  } catch(e) {
    return { error: String(e) };
  }
}
