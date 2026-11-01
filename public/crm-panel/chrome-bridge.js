// chrome-bridge.js — 当 sidepanel 运行在 iframe 中时，将 chrome.* API 替换为 postMessage 桥接
// 用法：在 sidepanel.js 之前加载此脚本，将自动适配

(function() {
  // 如果不在 iframe 中（直接作为扩展 sidepanel 运行），不需要桥接
  if (window.chrome && chrome.runtime && chrome.runtime.id) return;
  
  var _pending = {}, _id = 0;
  
  function _send(msg, cb) {
    var bid = ++_id;
    _pending[bid] = cb;
    msg._bridgeId = bid;
    window.parent.postMessage(msg, '*');
  }
  
  window.addEventListener('message', function(e) {
    var d = e.data;
    if (!d || !d._bridgeId) return;
    var cb = _pending[d._bridgeId];
    if (cb) { delete _pending[d._bridgeId]; cb(d.result, d.error); }
  });
  
  // 创建假的 chrome 对象
  if (!window.chrome) window.chrome = {};
  if (!chrome.storage) chrome.storage = {};
  if (!chrome.storage.local) {
    chrome.storage.local = {
      get: function(keys, cb) { _send({action:'storage.get', keys:keys}, function(r,e){ cb(r); }); },
      set: function(data, cb) { _send({action:'storage.set', data:data}, function(r,e){ if(cb)cb(); }); },
      remove: function(keys, cb) { _send({action:'storage.remove', keys:keys}, function(r,e){ if(cb)cb(); }); },
      getBytesInUse: function(keys, cb) { _send({action:'storage.getBytesInUse', keys:keys}, function(r,e){ cb(r); }); }
    };
    chrome.storage.onChanged = { addListener: function(){} };
  }
  
  if (!chrome.runtime) chrome.runtime = {};
  if (!chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage = function(msg, cb) {
      _send({action:'runtime.sendMessage', msg:msg}, function(r,e){ if(cb)cb(r); });
    };
  }
  
  if (!chrome.tabs) chrome.tabs = {};
  chrome.tabs.query = function(query, cb) {
    _send({action:'wa.hasTab'}, function(hasTab, e) {
      if (hasTab) cb([{id:-1}]);
      else cb([]);
    });
  };
  if (!chrome.tabs.update) {
    chrome.tabs.update = function(id, opts, cb) { if(cb)setTimeout(cb,100); };
  }
  if (!chrome.tabs.create) {
    chrome.tabs.create = function(opts, cb) {
      window.open('https://web.whatsapp.com', '_blank');
      if(cb)setTimeout(function(){cb({id:-1});}, 1000);
    };
  }
  
  // chrome.scripting.executeScript → 桥接到扩展的 MAIN world 执行
  if (!chrome.scripting) chrome.scripting = {};
  chrome.scripting.executeScript = function(opts, cb) {
    if (opts.world === 'MAIN') {
      _send({action:'wa.getCustomer'}, function(r, e) {
        if (r && !r.error) cb([{result: r}]);
        else cb([]);
      });
    } else {
      _send({action:'wa.getMessages'}, function(r, e) {
        cb(r && r.length ? r : [{result: []}]);
      });
    }
  };
  
  console.log('[Bridge] Chrome API bridge activated for iframe mode');
})();
