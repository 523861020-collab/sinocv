// WhatsApp content bridge — sends data to background via messaging
(function(){
  var lastPhone = '';
  
  function getChatInfo(){
    try {
      var s = window.Store;
      if(!s||!s.Chat) return {error:'noStore'};
      var c = s.Chat.getActive?s.Chat.getActive():null;
      if(!c){ var chats=s.Chat.getModelsArray?s.Chat.getModelsArray():[]; for(var j=0;j<chats.length;j++){if(chats[j].__x_isActive){c=chats[j];break;}} }
      if(!c) return {error:'noChat'};
      var ct=c.contact||c.__x_contact; if(!ct) return {error:'noContact'};
      var p=''; if(ct.id&&ct.id.user)p=ct.id.user; else if(ct.id&&ct.id._serialized)p=ct.id._serialized.split('@')[0];
      var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      if(!p) return {error:'noPhone'};
      return {phone:p,name:n};
    }catch(e){ return {error:String(e)}; }
  }

  function poll(){
    var info = getChatInfo();
    if(!info || info.error){
      chrome.runtime.sendMessage({type:'waDiag', storeReady:!!window.Store, hasChat:!!(window.Store&&window.Store.Chat)});
      return;
    }
    if(info.phone !== lastPhone){
      lastPhone = info.phone;
      chrome.runtime.sendMessage({type:'waChat', phone:info.phone, name:info.name, time:Date.now()});
    }
  }

  poll();
  setInterval(poll, 2000);
})();
