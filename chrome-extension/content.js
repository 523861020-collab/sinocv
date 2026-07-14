// WhatsApp content bridge — polls active chat, writes to chrome.storage
(function(){
  var lastPhone = '';
  
  function getChatInfo(){
    try {
      var s = window.Store;
      if(!s||!s.Chat) return null;
      var c = s.Chat.getActive?s.Chat.getActive():null;
      if(!c){
        var chats = s.Chat.getModelsArray?s.Chat.getModelsArray():[];
        for(var j=0;j<chats.length;j++){ if(chats[j].__x_isActive){ c=chats[j]; break; } }
      }
      if(!c) return null;
      var ct = c.contact||c.__x_contact;
      if(!ct) return null;
      var p='';
      if(ct.id&&ct.id.user) p=ct.id.user;
      else if(ct.id&&ct.id._serialized) p=ct.id._serialized.split('@')[0];
      var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      if(!p) return null;
      return {phone:p, name:n};
    }catch(e){ return null; }
  }

  function poll(){
    var info = getChatInfo();
    if(info && info.phone !== lastPhone){
      lastPhone = info.phone;
      info.time = Date.now();
      chrome.storage.local.set({ wa_active_chat: info }, function(){
        console.log('CRM: saved', info.phone, info.name);
      });
    }
  }

  // Try immediately and every 2 seconds
  poll();
  setInterval(poll, 2000);
  
  // Also try after a delay for Store to initialize
  setTimeout(poll, 5000);
  setTimeout(poll, 10000);
})();
