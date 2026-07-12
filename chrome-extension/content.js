// Minimal WhatsApp content bridge
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
  }
  return true;
});
