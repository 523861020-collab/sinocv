// WhatsApp content bridge + chat capture
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  // Text insertion
  if (msg.type === 'insertScript') {
    var input = document.querySelector('div[contenteditable="true"][role="textbox"]') 
      || document.querySelector('footer div[contenteditable="true"]');
    if (input) {
      input.focus();
      input.textContent = '';
      document.execCommand('insertText', false, msg.text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    sendResponse({ ok: true });
  }
  
  // Capture current chat info
  if (msg.type === 'getCurrentChat') {
    try {
      var s = window.Store;
      if (!s || !s.Chat) { sendResponse({ ok: false, error: 'notloaded' }); return true; }
      
      var c = s.Chat.getActive ? s.Chat.getActive() : null;
      if (!c) {
        var chats = s.Chat.getModelsArray ? s.Chat.getModelsArray() : [];
        for (var j = 0; j < chats.length; j++) {
          if (chats[j].__x_isActive) { c = chats[j]; break; }
        }
      }
      if (!c) { sendResponse({ ok: false, error: 'nochat' }); return true; }
      
      var ct = c.contact || c.__x_contact;
      if (!ct) { sendResponse({ ok: false, error: 'nocontact' }); return true; }
      
      var p = '';
      if (ct.id && ct.id.user) p = ct.id.user;
      else if (ct.id && ct.id._serialized) p = ct.id._serialized.split('@')[0];
      
      var n = ct.name || ct.pushname || ct.verifiedName || ct.shortName || p || '';
      
      sendResponse({ ok: true, data: { phone: p, name: n } });
    } catch(e) {
      sendResponse({ ok: false, error: String(e) });
    }
  }
  
  return true;
});
