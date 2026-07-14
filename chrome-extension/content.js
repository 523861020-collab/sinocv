// WhatsApp content bridge — diagnostic version
(function(){
  var storeReady = false;
  var lastPhone = '';
  
  function getChatInfo(){
    try {
      var s = window.Store;
      if(!s){ return {error:'noStore'}; }
      if(!s.Chat){ return {error:'noChat'}; }
      storeReady = true;
      
      var c = s.Chat.getActive?s.Chat.getActive():null;
      if(!c){
        var chats = s.Chat.getModelsArray?s.Chat.getModelsArray():[];
        for(var j=0;j<chats.length;j++){ if(chats[j].__x_isActive){ c=chats[j]; break; } }
      }
      if(!c) return {error:'noActiveChat'};
      
      var ct = c.contact||c.__x_contact;
      if(!ct) return {error:'noContact'};
      
      var p='';
      if(ct.id&&ct.id.user) p=ct.id.user;
      else if(ct.id&&ct.id._serialized) p=ct.id._serialized.split('@')[0];
      
      if(!p) return {error:'noPhone'};
      
      var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      return {phone:p, name:n};
    }catch(e){ return {error:String(e)}; }
  }

  function poll(){
    var info = getChatInfo();
    var status = {
      time: Date.now(),
      storeReady: storeReady,
      hasStore: !!window.Store,
      hasChat: !!(window.Store&&window.Store.Chat)
    };
    
    if(info && info.phone && !info.error){
      if(info.phone !== lastPhone){
        lastPhone = info.phone;
        info.time = status.time;
        chrome.storage.local.set({ wa_active_chat: info });
      }
    }
    
    // Always write diagnostic status (but debounce to 10s)
    if(Math.random() < 0.2){ // ~20% chance per poll (every 10s average)
      chrome.storage.local.set({ wa_diag: status });
    }
  }

  poll();
  setInterval(poll, 2000);
  setTimeout(poll, 5000);
  setTimeout(poll, 10000);
  setTimeout(poll, 15000);
})();
