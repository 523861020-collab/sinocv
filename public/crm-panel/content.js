// Inject wa-js.js into WhatsApp Web page DOM to create window.WPP
(function inject() {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('wa-js.js');
  s.onload = function() { s.remove(); };
  (document.head || document.documentElement).appendChild(s);
})();

// 国别显示：直接用全名
function getCountryLabel(c) {
  if (!c) return '';
  return c;
}

// 构建 WhatsApp 显示名
function buildDisplayName(c) {
  var cn = getCountryLabel(c.country);
  var prefix = cn ? '[' + cn + '] ' : '';
  // 有昵称且不是纯电话号 → 用昵称
  var name = (c.name || '').trim();
  var digits = name.replace(/[^\d]/g, '');
  if (name && digits.length < 10) {
    return prefix + name + ' [' + (c.level||'C') + '级]';
  }
  // 无昵称或电话号 → 国家+电话+等级
  return prefix + (c.phone||'') + ' [' + (c.level||'C') + '级]';
}

// ===== Bridge: get WPP contacts from MAIN world via postMessage =====
(function bridge() {
  // Listen for contact data from MAIN world script
  window.addEventListener('message', function(ev) {
    if (ev.data && ev.data.type === 'XINYUNTONG_CONTACTS') {
      chrome.storage.local.get(['customers'], function(d) {
        var customers = d.customers || {};
        var map = {};
        (ev.data.contacts || []).forEach(function(c) {
          if (customers[c.phone]) map[c.fmt] = c.phone;
          // Also map by name
          if (customers[c.phone] && customers[c.phone].name) {
            map[customers[c.phone].name] = c.phone;
          }
        });
        chrome.storage.local.set({ contact_map: map });
      });
    }
    // Track active chat phone for sentTo (回访记录) + chat saver
    if (ev.data && ev.data.type === 'XINYUNTONG_ACTIVE_CHAT') {
      var phone = ev.data.phone;
      if (phone) {
        var prevPhone = window._activeChatPhone;
        window._activeChatPhone = phone;  // for chat saver
        // 切换到新客户时，延迟触发保存（等界面渲染完，识别 A 级客户）
        if (prevPhone !== phone && window._saveCurrentChat) {
          setTimeout(function() { window._saveCurrentChat(); }, 1500);
        }
              var _nd = new Date(); var now = _nd.toISOString(); var date = _nd.getFullYear() + '-' + String(_nd.getMonth()+1).padStart(2,'0') + '-' + String(_nd.getDate()).padStart(2,'0');
        chrome.storage.local.get(['daily_activity'], function(d) {
          var act = d.daily_activity || {};
          if (!act[date]) act[date] = { firstActivity: now, lastActivity: now, replyCount: 0 };
          act[date].lastActivity = now;
          if (!act[date].sentTo) act[date].sentTo = [];
          if (act[date].sentTo.indexOf(phone) < 0) act[date].sentTo.push(phone);
          chrome.storage.local.set({ daily_activity: act });
        });
      }
    }
  });

  // Inject MAIN world script to scan contacts
  var scanner = document.createElement('script');
  scanner.textContent = '(' + function() {
    function scan() {
      if (!window.WPP || !window.WPP.contact) { setTimeout(scan, 5000); return; }
      WPP.contact.list().then(function(cs) {
        var data = cs.filter(function(c) { return c.id && c.id.server === 'c.us'; }).map(function(c) {
          return {
            phone: '+' + (c.id.user || ''),
            fmt: (c.formattedUser || c.id._serialized || '').replace(/\s+/g, '').trim()
          };
        });
        window.postMessage({ type: 'XINYUNTONG_CONTACTS', contacts: data }, '*');
      }).catch(function() { setTimeout(scan, 10000); });
    }
    setTimeout(scan, 60000);  // WhatsApp完全打开1分钟后才开始
    // 不再设置interval轮询——contact_map在保存时已实时更新
  }.toString() + ')()';
  (document.head || document.documentElement).appendChild(scanner);

  // Inject MAIN world script to track active chat for sentTo reporting
  var chatTracker = document.createElement('script');
  chatTracker.textContent = '(' + function() {
    function trackActive() {
      try {
        if (!window.WPP || !window.WPP.chat) { setTimeout(trackActive, 5000); return; }
        var active = WPP.chat.getActiveChat();
        if (active && active.id) {
          var phone = active.id.user || '';
          if (phone) window.postMessage({ type: 'XINYUNTONG_ACTIVE_CHAT', phone: phone }, '*');
        }
      } catch(e) {}
    }
    setInterval(trackActive, 1500);    // 每1.5秒检测一次，切换客户后1.5秒内识别
    setTimeout(trackActive, 3000);
  }.toString() + ')()';
  (document.head || document.documentElement).appendChild(chatTracker);
})();

// ===== Replace WhatsApp display names with CRM-saved names =====
function applyReplacements() {
  chrome.storage.local.get(['customers', 'contact_map'], function(d) {
    var customers = d.customers || {};
    var map = d.contact_map || {};
    var cKeys = Object.keys(customers);
    if (!cKeys.length && !Object.keys(map).length) return;

    var nameLookup = {};
    var phoneDigitsMap = {};  // 预建纯数字 → customer 的快速查找表
    // From contact_map
    Object.keys(map).forEach(function(waName) {
      var phone = map[waName];
      if (customers[phone]) nameLookup[waName] = customers[phone];
    });
    // Direct name match + phone digits map
    cKeys.forEach(function(phone) {
      var c = customers[phone];
      if (c.name) nameLookup[c.name] = c;
      var digits = phone.replace(/[^\d]/g, '');
      if (digits.length >= 7) phoneDigitsMap[digits] = c;
    });

    // Current chat header - also match by phone number
    var header = document.querySelector('[data-testid="conversation-info-header-chat-title"]') ||
                 document.querySelector('#main header span[dir="auto"]') ||
                 document.querySelector('header h1') ||
                 document.querySelector('header [role="heading"]');
    if (header) {
      var waName = (header.textContent || '').replace(/\s+/g, '').trim();
      // 防止 WhatsApp 多层 span 导致的号码重复拼接
      if (waName.length > 30) {
        var wm = waName.match(/\+\d{7,15}/);
        if (wm) waName = wm[0];
      }
      var hc = nameLookup[waName];
      // 纯数字匹配兜底
      if (!hc){
        var hDigits=waName.replace(/[^\d]/g,'');
        if(hDigits.length>=7 && hDigits.length<=15) hc=phoneDigitsMap[hDigits];
      }
      if (hc) {
        header.textContent = buildDisplayName(hc);
        header.style.color = '#059669';
      }
    }

    // Chat list items - update name + badge
    var scanned={};
    document.querySelectorAll('span[dir="auto"]').forEach(function(el) {
      var text = (el.getAttribute('title') || el.textContent || '').replace(/\s+/g, '').trim();
      if (!text || text.length < 2) return;
      // 防止多层 span 嵌套导致的号码重复拼接
      if (text.length > 30) {
        var tm = text.match(/\+\d{7,15}/);
        if (tm) text = tm[0];
      }
      var c = nameLookup[text];
      // 纯数字匹配（至少7位，完全匹配）
      if (!c){
        var digits=text.replace(/[^\d]/g,'');
        if(digits.length>=7 && digits.length<=15) c=phoneDigitsMap[digits];
        // contact_map 直接键匹配
        if(!c&&map[text])c=customers[map[text]];
      }
      if (!c) return;
      // Skip if already processed this element
      var elId=text+'_'+el.textContent;
      if(scanned[elId])return;scanned[elId]=true;
      el.textContent = buildDisplayName(c);
      el.style.color = '#059669';
      // Update or create badge
      var p = el.parentElement;
      if (p) {
        var badge = p.querySelector('.crm-level-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'crm-level-badge';
          p.appendChild(badge);
        }
        badge.textContent = (c.level || 'C');
        var colors={A:'#dc2626',B:'#f59e0b',C:'#059669'};
        badge.style.cssText = 'font-size:10px;margin-left:4px;font-weight:700;color:#fff;background:'+(colors[c.level]||'#059669')+';padding:0px 5px;border-radius:8px;display:inline-block;vertical-align:middle';
      }
    });
  });
}

// WhatsApp完全打开1分钟后才开始名称替换，避免卡顿
setTimeout(applyReplacements, 60000);
// 30秒轮询，MutationObserver已经覆盖了实时变化
setInterval(applyReplacements, 30000);

chrome.storage.onChanged.addListener(function(changes) {
  if (changes.wa_active_chat || changes.contact_map || changes.customers) {
    applyReplacements();
  }
});

// MutationObserver：只看聊天列表区域，避免监听全局body导致WhatsApp重启
var _replaceTimer = null;
var _pendingReplace = false;
function startObserving() {
  var chatList = document.querySelector('#pane-side, [data-testid="chat-list"], div[aria-label="Chat list"]');
  var target = chatList || document.querySelector('#app');
  if (!target) { setTimeout(startObserving, 3000); return; }
  new MutationObserver(function() {
    if (_pendingReplace) return;
    if (_replaceTimer) clearTimeout(_replaceTimer);
    _replaceTimer = setTimeout(function() {
      _replaceTimer = null;
      _pendingReplace = true;
      var doWork = function() { applyReplacements(); _pendingReplace = false; };
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(doWork, { timeout: 2000 });
      } else {
        doWork();
      }
    }, 800);  // 增加到800ms，减少触发频率
  }).observe(target, { childList: true, subtree: true, attributes: false });
}
startObserving();

// ===== Message counter: track sent messages =====
(function msgCounter() {
  var lastCount = 0;
  function countSent() {
    // Count outgoing message bubbles (right-aligned, with tail)
    var sent = document.querySelectorAll('div[role="row"][data-id] .message-out, div[data-pre-plain-text]').length;
    if (sent > lastCount) {
      var newMsgs = sent - lastCount;
      lastCount = sent;
      chrome.storage.local.get(['attendance', 'current_user'], function(d) {
        var user = d.current_user;
        if (!user || !user.id) return;
        var today = new Date().toISOString().slice(0, 10);
        var att = d.attendance || {};
        if (!att[today]) att[today] = {};
        if (!att[today][user.id]) att[today][user.id] = { login: user.loginTime };
        att[today][user.id].messages = (att[today][user.id].messages || 0) + newMsgs;
        chrome.storage.local.set({ attendance: att });
      });
    }
  }
  setInterval(function() {
    // Only count on weekdays 13:00-22:00
    var now = new Date(), h = now.getHours(), d = now.getDay();
    if (d === 0 || d === 6) return; // weekend
    countSent();
  }, 30000);
})();

// ===== 聊天记录自动保存 =====
(function chatSaver(){
  var savedIds={};
  function getCurrentPhone(){
    // 从MAIN world的chatTracker获取（通过postMessage传入）
    if(window._activeChatPhone) return window._activeChatPhone;
    // Fallback: try URL
    var m=location.href.match(/\/\/(\d+)@c\.us/);
    if(m) return m[1];
    return null;
  }
  function saveCurrentChat(){
    var phone=getCurrentPhone();
    if(!phone)return;
    // 先判断 A 级，再抓取消息（避免非 A 级消息被 savedIds 标记导致漏存）
    chrome.storage.local.get(['customers'],function(d){
      var custs=d.customers||{};
      var c=custs[phone]||custs['+'+phone]||custs[String(phone).replace(/^\+/,'')];
      if(!c||c.level!=='A')return;
      var msgs=document.querySelectorAll('div[data-id]');
      var newMsgs=[];
      msgs.forEach(function(m){
        var id=m.getAttribute('data-id');
        if(savedIds[id])return;
        savedIds[id]=true;
        var t=m.querySelector('.copyable-text,.selectable-text');
        var txt=t?t.textContent.trim():'';
        var time='';
        try{var pre=m.querySelector('[data-pre-plain-text]');if(pre)time=pre.getAttribute('data-pre-plain-text').replace(/[\[\]]/g,'').trim();}catch(e){}
        if(!time)time=new Date().toISOString();
        var hasImg=m.querySelector('img[src^="blob:"],img[src^="data:"],[data-testid="image-thumb"]');
        var hasVid=m.querySelector('video');
        if(hasImg)txt=(txt||'')+' [图片]';
        if(hasVid)txt=(txt||'')+' [视频]';
        if(!txt)return;
        var sender=m.classList.contains('message-in')?'客户':'我';
        newMsgs.push({id:id,sender:sender,text:txt,time:time});
      });
      if(!newMsgs.length)return;
      var today=new Date().toISOString().slice(0,10);
      // 翻译非中文消息
      var isChinese=function(t){var cnt=0;for(var i=0;i<t.length;i++){var c=t.charCodeAt(i);if(c>=0x4E00&&c<=0x9FFF)cnt++;}return cnt>t.length*0.3;};
      var toTranslate=newMsgs.filter(function(x){return!isChinese(x.text);});
      var promises=toTranslate.map(function(x){
        var orig=x.text.replace(/\[.*?\]$/,'').trim();
        if(!orig)return Promise.resolve({id:x.id,cn:''});
        var ctrl=new AbortController();
        var tmr=setTimeout(function(){ctrl.abort();},5000);
        return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q='+encodeURIComponent(orig),{signal:ctrl.signal})
          .then(function(r){clearTimeout(tmr);return r.json();})
          .then(function(d){clearTimeout(tmr);return{id:x.id,cn:d[0]?d[0].map(function(s){return s[0];}).join(''):''};})
          .catch(function(){clearTimeout(tmr);return{id:x.id,cn:''};});
      });
      Promise.all(promises).then(function(trans){
        var cnMap={};trans.forEach(function(x){if(x.cn)cnMap[x.id]=x.cn;});
        newMsgs.forEach(function(x){if(cnMap[x.id])x.cn=cnMap[x.id];});
        // 统一 phone 为带 + 号（和 customers key 一致，保证能查到）
        var savePhone = (String(phone).indexOf('+') === 0) ? phone : ('+' + phone);
        chrome.storage.local.get(['chat_history'],function(d2){
          var hist=d2.chat_history||{};
          if(!hist[savePhone])hist[savePhone]={};
          if(!hist[savePhone][today])hist[savePhone][today]=[];
          var existing={};
          hist[savePhone][today].forEach(function(m){existing[m.id]=true;});
          newMsgs.forEach(function(m){if(!existing[m.id])hist[savePhone][today].push(m);});
          // 完整保存，不裁剪（用户要求：本地完整保存 + 云端备份 + 本地不删除）
          chrome.storage.local.set({chat_history:hist});
        });
      });
    });
  }
  window._saveCurrentChat = saveCurrentChat;  // 暴露给 bridge，切换客户时触发
  // 实时监听新消息：员工跟 A 级客户聊天时，有新消息立即识别并保存（不主动切换界面，无风控风险）
  var obsTimer = null;
  var obs = new MutationObserver(function() {
    if (obsTimer) return;  // 节流：3秒内只触发一次，避免滚动/输入时高频调用
    obsTimer = setTimeout(function() {
      obsTimer = null;
      saveCurrentChat();
    }, 3000);
  });
  function startObs(){
    var main = document.querySelector('#main');
    if (!main) { setTimeout(startObs, 5000); return; }
    obs.observe(main, { childList: true, subtree: true });
  }
  setTimeout(startObs, 30000);
  // 兜底：每60秒检测一次，防止 MutationObserver 漏掉
  setInterval(saveCurrentChat, 60000);
  setTimeout(saveCurrentChat, 10000);   // 启动10秒后先检测一次
})();

// ===== 每日活动追踪 =====
(function activityTracker(){
  var today=new Date().toISOString().slice(0,10);
  var lastSendTime=null;
  
  // 监听发送消息
  var observer=new MutationObserver(function(){
    var now=new Date().toISOString();
    var date=now.slice(0,10);
    chrome.storage.local.get(['daily_activity'],function(d){
      var act=d.daily_activity||{};
      if(!act[date])act[date]={firstActivity:now,lastActivity:now,replyCount:0};
      act[date].lastActivity=now;
      act[date].replyCount=(act[date].replyCount||0)+1;
      chrome.storage.local.set({daily_activity:act});
    });
  });
  
  // 监听输入框发送（检测消息气泡出现）
  setInterval(function(){
    var sent=document.querySelectorAll('.message-out[data-id]').length;
    chrome.storage.local.get(['_sent_count'],function(d){
      var prev=d._sent_count||0;
      if(sent>prev){
        chrome.storage.local.set({_sent_count:sent});
        var now=new Date().toISOString(),date=now.slice(0,10);
        chrome.storage.local.get(['daily_activity'],function(d2){
          var act=d2.daily_activity||{};
          if(!act[date])act[date]={firstActivity:now,lastActivity:now,replyCount:0,firstReply:null,lastReply:null};
          act[date].lastActivity=now;act[date].lastReply=now;
          if(!act[date].firstReply)act[date].firstReply=now;
          act[date].replyCount=(act[date].replyCount||0)+(sent-prev);
          // 记录发给谁
          try{
            var activeChat=window.WPP&&WPP.chat?WPP.chat.getActiveChat():null;
            var targetPhone=activeChat?activeChat.id.user||'':'';
            if(targetPhone){
              if(!act[date].sentTo)act[date].sentTo=[];
              if(act[date].sentTo.indexOf(targetPhone)<0)act[date].sentTo.push(targetPhone);
            }
          }catch(e){}
          // 回访记录统一由 watchSentMessages 的 scheduleNextFollowUp 处理（本地时间+同步服务器），此处不再重复更新，避免 UTC 覆盖
          chrome.storage.local.set({daily_activity:act});
          try{localStorage.setItem('crm_daily_'+date,JSON.stringify(act[date]));}catch(e){}
        });
      }
    });
  },30000);
})();

// ===== 监听翻译复制请求，转发给sidepanel =====
window.addEventListener('message',function(ev){
  if(ev.data&&ev.data.type==='CRM_COPY_IMAGE'){
    chrome.runtime.sendMessage({type:'CRM_COPY_IMAGE',text:ev.data.text});
  }
});

// ===== 数据持久化：备份到WhatsApp localStorage（卸载插件不丢失） =====
(function dataBackup() {
  var BK_KEY = 'crm_backup_v2';
  function doBackup() {
    chrome.storage.local.get(['customers','doc_records','chat_history','attendance'], function(d) {
      var cust = d.customers || {};
      var keys = Object.keys(cust);
      if (!keys.length && !Object.keys(d.doc_records||{}).length && !Object.keys(d.attendance||{}).length) return;
      try {
        var slim = { customers: {}, doc_records: {}, chat_history: {}, attendance: d.attendance || {} };
        // 客户信息（含订单）
        keys.forEach(function(phone) {
          var c = cust[phone];
          slim.customers[phone] = {
            name: c.name || '', phone: phone, country: c.country || '',
            level: c.level || 'C', company: c.company || '',
            notes: (c.notes || '').substring(0, 500),
            orders: c.orders || [],
            updatedAt: c.updatedAt || '', assignedTo: c.assignedTo || '',
            nextFollowUp: c.nextFollowUp || '', firstSeen: c.firstSeen || ''
          };
        });
        // PI/合同/交单文件（仅元数据，不含base64文件内容）
        var docs = d.doc_records || {};
        Object.keys(docs).forEach(function(key) {
          slim.doc_records[key] = (docs[key] || []).map(function(f) {
            return { fileName: f.fileName, size: f.size, type: f.type, uploadedAt: f.uploadedAt };
          });
        });
        // A级聊天记录（完整保存，不裁剪）
        var chats = d.chat_history || {};
        Object.keys(chats).forEach(function(phone) {
          slim.chat_history[phone] = chats[phone] || {};
        });
        localStorage.setItem(BK_KEY, JSON.stringify(slim));
      } catch(e) { /* 忽略quota错误 */ }
    });
  }
  setInterval(doBackup, 300000);  // 每5分钟

  // 监听storage变化触发备份
  chrome.storage.onChanged.addListener(function(changes) {
    if (!changes.customers && !changes.doc_records && !changes.chat_history && !changes.attendance) return;
    if (changes.customers) applyReplacements();  // 保存客户后立即刷新名称显示
    clearTimeout(window._bkTimer);
    window._bkTimer = setTimeout(doBackup, 10000);
  });

  // 恢复请求
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === 'refresh_names') { applyReplacements(); return; }
    if (msg.action === 'restoreFromLocalStorage') {
      try {
        var raw = localStorage.getItem(BK_KEY);
        if (raw) {
          var backup = JSON.parse(raw);
          sendResponse({ ok: true, customers: backup.customers || {}, doc_records: backup.doc_records || {}, chat_history: backup.chat_history || {}, attendance: backup.attendance || {} });
        } else {
          sendResponse({ ok: false, error: 'no backup' });
        }
      } catch(e) {
        sendResponse({ ok: false, error: e.message });
      }
      return true;
    }
  });

  // ===== 检测发出的消息 → 记录回访完成 =====
  (function watchSentMessages() {
    var _lastSent = {};
    function getPhone() {
      // 从MAIN world chatTracker获取（bridge已存入_activeChatPhone）
      if (window._activeChatPhone) return window._activeChatPhone;
      return '';
    }
    function record(phone) {
      if (!phone || phone.length < 7) return;
            var _nd = new Date(); var now = _nd.toISOString(); var date = _nd.getFullYear() + '-' + String(_nd.getMonth()+1).padStart(2,'0') + '-' + String(_nd.getDate()).padStart(2,'0');
      var key = 'followup_done';
      chrome.storage.local.get([key], function(d) {
        var done = d[key] || {};
        if (!done[date]) done[date] = {};
        if (!done[date][phone]) {
          done[date][phone] = now;
          var upd = {}; upd[key] = done;
          chrome.storage.local.set(upd);
          // 回访完成 → 按等级更新下次回访日期（A=15/B=30/C=60天）
          scheduleNextFollowUp(phone);
        }
      });
    }
    function scheduleNextFollowUp(phone) {
      chrome.storage.local.get(['customers', '_followup_sync_queue'], function(d) {
        var custs = d.customers || {};
        var c = custs[phone] || custs['+'+phone] || custs[String(phone).replace(/^\+/,'')];
        if (!c) return;
        var level = (c.level || 'C').toUpperCase();
        var days = level === 'A' ? 15 : level === 'B' ? 30 : 60;
        var nd = new Date();
        nd.setDate(nd.getDate() + days);
        while (nd.getDay() === 0 || nd.getDay() === 6) nd.setDate(nd.getDate() + 1);
        var m = String(nd.getMonth() + 1); if (m.length < 2) m = '0' + m;
        var dd = String(nd.getDate()); if (dd.length < 2) dd = '0' + dd;
        var nextDate = nd.getFullYear() + '-' + m + '-' + dd;
        c.nextFollowUp = nextDate;
        // 加入待同步队列（key 用 customers 里的 phone，带 + 号，保证 flush 能匹配到）
        var normPhone = c.phone || ('+' + String(phone).replace(/^\+/,''));
        var queue = d._followup_sync_queue || {};
        queue[normPhone] = { nextFollowUp: nextDate, level: level };
        chrome.storage.local.set({ customers: custs, _followup_sync_queue: queue });
      });
    }
    var obs = new MutationObserver(function(muts) {
      var phone = getPhone();
      if (!phone) return;
      muts.forEach(function(mu) {
        mu.addedNodes.forEach(function(n) {
          if (n.nodeType !== 1) return;
          var check = n.classList && n.classList.contains('message-out') ? n : n.querySelector && n.querySelector('.message-out');
          if (check) {
            var t = Date.now();
            if (!_lastSent[phone] || t - _lastSent[phone] > 5000) {
              _lastSent[phone] = t;
              record(phone);
            }
          }
        });
      });
    });
    setTimeout(function() { obs.observe(document.body, { childList: true, subtree: true }); }, 30000);
  })();
})();
