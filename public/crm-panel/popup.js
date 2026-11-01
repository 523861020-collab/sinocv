// XINYUNTONG CRM - Login
var EMPLOYEES = {
  'wangxiaohan': {name:'王小涵',pass:'123456',role:'employee',dept:'牵引车/挂车/冷藏车',region:'北非西非',salary:'3200'},
  'maozhenwei': {name:'毛振威',pass:'123456',role:'employee',dept:'工程机械',region:'中非东非',salary:'3200'},
  'zhaohuanle': {name:'赵欢乐',pass:'123456',role:'employee',dept:'工程机械',region:'北非西非',salary:'3000'},
  'dufeiyue': {name:'杜飞跃',pass:'123456',role:'employee',dept:'牵引车/挂车/冷藏车',region:'中非东非',salary:'3000'},
  'lishanlong': {name:'李善龙',pass:'admin123',role:'admin',dept:'管理',region:'全球',salary:'—'}
};

var msg = document.getElementById('msg');
function showMsg(txt, ok) { msg.textContent = txt; msg.className = 'msg show ' + (ok ? 'ok' : 'err'); }

// Quick login clicks
document.querySelectorAll('.emp').forEach(function(el) {
  el.onclick = function() {
    document.getElementById('username').value = this.dataset.user;
    document.getElementById('password').value = '123456';
    document.getElementById('btnLogin').click();
  };
});

// Password enter key
document.getElementById('password').onkeydown = function(e) { if (e.key === 'Enter') document.getElementById('btnLogin').click(); };

// Login
document.getElementById('btnLogin').onclick = function() {
  var user = document.getElementById('username').value.trim().toLowerCase();
  var pass = document.getElementById('password').value.trim();
  if (!user || !pass) { showMsg('请输入账号和密码', false); return; }
  var emp = EMPLOYEES[user];
  if (!emp) { showMsg('账号不存在', false); return; }
  if (emp.pass !== pass) { showMsg('密码错误', false); return; }

  // Login success
  chrome.storage.local.set({
    current_user: { id: user, name: emp.name, role: emp.role, dept: emp.dept, region: emp.region, salary: emp.salary, loginTime: new Date().toISOString() }
  }, function() {
    // Record attendance
    var today = new Date().toISOString().slice(0, 10);
    chrome.storage.local.get(['attendance'], function(d) {
      var att = d.attendance || {};
      if (!att[today]) att[today] = {};
      att[today][user] = { login: new Date().toISOString(), logout: null, messages: 0, clicks: 0 };
      chrome.storage.local.set({ attendance: att });
    });
    // Open sidepanel
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
      window.close();
    });
  });
};

// Auto-check if already logged in
chrome.storage.local.get(['current_user'], function(d) {
  if (d.current_user && d.current_user.id) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length) chrome.sidePanel.open({ windowId: tabs[0].windowId });
      window.close();
    });
  }
});
