// auto-update.js — 自动更新所有可更新的扩展文件
(function(){
  var VERSION_URL = 'http://47.96.255.110/crm-panel/version.json';
  var CACHE_DB    = 'crm_updates';
  var CACHE_VER   = 'sidepanel_version';

  var FILES = [
    { key: 'sidepanel_js', url: 'http://47.96.255.110/crm-panel/sidepanel.js' },
    { key: 'content_js',   url: 'http://47.96.255.110/crm-panel/content.js' }
  ];

  function downloadAndCache(file) {
    return fetch(file.url + '?t=' + Date.now())
      .then(function(r) { return r.text(); })
      .then(function(code) {
        return new Promise(function(resolve) {
          var req = indexedDB.open(CACHE_DB, 1);
          req.onupgradeneeded = function(e) { e.target.result.createObjectStore('scripts'); };
          req.onsuccess = function(e) {
            var tx = e.target.result.transaction('scripts', 'readwrite');
            tx.objectStore('scripts').put(code, file.key);
            tx.oncomplete = function() { resolve(true); };
            tx.onerror = function() { resolve(false); };
          };
          req.onerror = function() { resolve(false); };
        });
      })
      .catch(function() { return false; });
  }

  function checkAndUpdate() {
    chrome.storage.local.get([CACHE_VER], function(d) {
      var localVer = d[CACHE_VER] || '';
      console.log('[AutoUpdate] 本地版本:', localVer, '检查服务器...');
      fetch(VERSION_URL + '?t=' + Date.now())
        .then(function(r) { return r.json(); })
        .then(function(remote) {
          console.log('[AutoUpdate] 服务器版本:', remote.version);
          if (remote.version !== localVer) {
            console.log('[AutoUpdate] 发现新版本，下载中...');
            Promise.all(FILES.map(function(f) { return downloadAndCache(f); }))
              .then(function(results) {
                chrome.storage.local.set(JSON.parse('{"' + CACHE_VER + '":"' + remote.version + '"}'), function() {
                  console.log('[AutoUpdate] 更新完成，刷新...');
                  location.reload();
                });
              });
          } else {
            console.log('[AutoUpdate] 已是最新版本');
          }
        })
        .catch(function(e) { console.log('[AutoUpdate] 服务器检测失败，使用缓存版本'); });
    });
  }

  checkAndUpdate();
  // 每30分钟检查更新
  setInterval(checkAndUpdate, 30 * 60 * 1000);
})();
