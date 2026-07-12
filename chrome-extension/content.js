// WhatsApp content bridge — receives scripts from sidepanel, inserts into chat input
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'insertScript') {
    const text = msg.text;
    insertIntoChat(text);
    sendResponse({ ok: true });
  }
  return true;
});

function insertIntoChat(text) {
  // Find WhatsApp's message input box
  // WhatsApp Web uses a contenteditable div or a textarea
  const selectors = [
    'div[contenteditable="true"][data-tab="10"]',
    'div[contenteditable="true"][role="textbox"]',
    'footer div[contenteditable="true"]',
    '#main footer div[contenteditable="true"]',
    'div.copyable-text.selectable-text[contenteditable="true"]',
  ];

  let input = null;
  for (const sel of selectors) {
    input = document.querySelector(sel);
    if (input) break;
  }

  if (!input) {
    console.error('WhatsApp input not found');
    return;
  }

  // Focus and insert text
  input.focus();
  
  // Use document.execCommand as fallback, or set directly
  if (input.contentEditable === 'true') {
    // Clear existing content
    input.textContent = '';
    // Insert new text
    document.execCommand('insertText', false, text);
  } else {
    // Regular input/textarea
    input.value = text;
  }

  // Trigger input event so WhatsApp detects the change
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
