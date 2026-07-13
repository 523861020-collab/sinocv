// SINOCV CRM — Chrome Extension Side Panel
const API = 'https://truckmarts.com/api/crm';
const PINS = { '13001977959': '202502', '李善龙': '202502', '王小涵': '1111', '毛振威': '2222', '赵欢乐': '3333', '杜飞跃': '4444' };
const ADMIN_IDS = ['13001977959', '李善龙'];

let currentUser = '';
let isAdmin = false;
let contacts = [];
let filter = 'all';
let refreshTimer = null;

// ====== PERSISTENT LOGIN ======
function saveLogin(user) {
  chrome.storage.local.set({ crmUser: user, crmLoginTime: Date.now() });
}

function restoreLogin(callback) {
  chrome.storage.local.get(['crmUser', 'crmLoginTime'], function(data) {
    if (data.crmUser && data.crmLoginTime) {
      var elapsed = Date.now() - data.crmLoginTime;
      if (elapsed < 24 * 60 * 60 * 1000) { // 24h expiry
        callback(data.crmUser);
        return;
      }
    }
    callback(null);
  });
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  // Login button
  document.getElementById('loginBtn').addEventListener('click', doLogin);
  document.getElementById('loginPass').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('logoutBtn').addEventListener('click', doLogout);

  // Filter buttons
  document.querySelectorAll('.filter button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setFilter(btn.getAttribute('data-filter'), btn);
    });
  });

  // Auto-restore login
  restoreLogin(function(user) {
    if (user) {
      currentUser = user;
      isAdmin = ADMIN_IDS.indexOf(user) >= 0;
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('mainApp').style.display = 'flex';
      document.getElementById('curUser').textContent = (isAdmin ? '👑 ' : '') + user;
      loadContacts();
      refreshTimer = setInterval(loadContacts, 20000);
    }
  });
});

// ====== LOGIN ======
function doLogin() {
  var u = document.getElementById('loginUser').value.trim();
  var p = document.getElementById('loginPass').value.trim();
  var err = document.getElementById('loginErr');
  err.style.display = 'none';
  if (!u || !p) { err.textContent = '请输入用户名和密码'; err.style.display = 'block'; return; }
  
  var correctPin = PINS[u];
  if (!correctPin) { err.textContent = '用户名不存在'; err.style.display = 'block'; return; }
  if (p !== correctPin) { err.textContent = '密码错误'; err.style.display = 'block'; return; }

  currentUser = u;
  isAdmin = ADMIN_IDS.indexOf(u) >= 0;
  saveLogin(u);
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  document.getElementById('curUser').textContent = (isAdmin ? '👑 ' : '') + u;
  
  loadContacts();
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(loadContacts, 20000);
}

function doLogout() {
  chrome.storage.local.remove(['crmUser', 'crmLoginTime']);
  currentUser = '';
  contacts = [];
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// ====== DATA ======
async function loadContacts() {
  try {
    var r = await fetch(API + '?action=all');
    if (r.ok) {
      var d = await r.json();
      contacts = d.contacts || [];
      renderList();
    }
  } catch(e) {}
}

function myContacts() {
  if (isAdmin) return contacts;
  return contacts.filter(function(c) { return !c.owner || c.owner === currentUser; });
}

// ====== RENDER ======
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter button').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderList();
}

function renderList() {
  var mc = myContacts();
  var f = filter === 'all' ? mc : mc.filter(function(c) { return c.category === filter; });
  var el = document.getElementById('listEl');
  
  if (f.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:#ccc;padding:40px">暂无客户</div>';
    return;
  }
  
  var html = '';
  for (var i = 0; i < f.length; i++) {
    var c = f[i];
    var cls = c.category ? 'badge badge-' + c.category.toLowerCase() : 'badge badge-new';
    var dl = c.nextFollowUp ? Math.ceil((new Date(c.nextFollowUp) - Date.now()) / 86400000) : null;
    var overdue = dl !== null && dl <= 0;
    html += '<div class="item" data-phone="' + c.phone + '">' +
      '<div><div class="name">' + (c.name || c.phone) + ' <span class="' + cls + '">' + (c.category || '新') + '</span>' + (overdue ? ' ⚠️' : '') + '</div>' +
      '<div class="meta">' + c.phone + ' · ' + (c.country || '未知') + ' · ' + ((c.orders || []).length) + '个订单 ' + (dl !== null ? '· ' + dl + '天' : '') + '</div></div>' +
    '</div>';
  }
  el.innerHTML = html;

  el.querySelectorAll('.item').forEach(function(item) {
    item.addEventListener('dblclick', function() {
      openWA(item.getAttribute('data-phone'));
    });
    item.addEventListener('click', function() {
      openDetail(item.getAttribute('data-phone'));
    });
  });
}

function openWA(phone) {
  chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
    }
  });
}

function openDetail(phone) {
  var c = contacts.find(function(x) { return x.phone === phone; });
  if (!c) return;
  alert(
    '客户: ' + (c.name || c.phone) + '\n' +
    '手机: ' + c.phone + '\n' +
    '国家: ' + (c.country || '-') + '\n' +
    '分类: ' + (c.category || '新') + '\n' +
    '订单: ' + ((c.orders || []).length) + '个\n' +
    '邮箱: ' + (c.email || '-') + '\n' +
    '公司: ' + (c.company || '-') + '\n' +
    '下次回访: ' + (c.nextFollowUp || '-')
  );
}
