// WhatsApp content bridge — waits for Store, monitors active chat, writes to storage
(function(){
  function getChatInfo(){
    try {
      var s = window.Store;
      if(!s||!s.Chat) return null;
      var c = s.Chat.getActive?s.Chat.getActive():null;
      if(!c){ var chats=s.Chat.getModelsArray?s.Chat.getModelsArray():[]; for(var j=0;j<chats.length;j++){if(chats[j].__x_isActive){c=chats[j];break;}} }
      if(!c) return null;
      var ct = c.contact||c.__x_contact;
      if(!ct) return null;
      var p='';
      if(ct.id&&ct.id.user) p=ct.id.user;
      else if(ct.id&&ct.id._serialized) p=ct.id._serialized.split('@')[0];
      var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      if(!p) return null;
      return {phone:p, name:n, time:Date.now()};
    }catch(e){ return null; }
  }

  function poll(){
    var info = getChatInfo();
    if(info){
      try { chrome.storage.local.set({ wa_active_chat: info }); } catch(e){}
    }
  }

  // Wait for Store to exist
  var tries = 0;
  function waitForStore(){
    if(window.Store && window.Store.Chat){ poll(); setInterval(poll, 2000); return; }
    if(++tries > 30) return; // give up after 60s
    setTimeout(waitForStore, 2000);
  }
  
  if(document.readyState==='complete') waitForStore();
  else window.addEventListener('load', waitForStore);
})();
