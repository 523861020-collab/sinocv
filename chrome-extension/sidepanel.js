// SINOCV CRM — clean rebuild
const API = 'https://truck-export-pi-xi.vercel.app/api/crm';
const PINS = { '13001977959': '202502', '李善龙': '202502', '王小涵': '1111', '毛振威': '2222', '赵欢乐': '3333', '杜飞跃': '4444' };
const ADMIN_IDS = ['13001977959', '李善龙'];

let currentUser = '';
let isAdmin = false;
let contacts = [];
let filter = 'all';

// ====== LOGIN ======
function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const err = document.getElementById('loginErr');
  err.style.display = 'none';
  if (!u || !p) { err.textContent = '请输入用户名和密码'; err.style.display = 'block'; return; }
  
  const correctPin = PINS[u];
  if (!correctPin) { err.textContent = '用户名不存在'; err.style.display = 'block'; return; }
  if (p !== correctPin) { err.textContent = '密码错误'; err.style.display = 'block'; return; }

  // Success
  currentUser = u;
  isAdmin = ADMIN_IDS.includes(u);
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  document.getElementById('curUser').textContent = (isAdmin ? '👑 ' : '') + u;
  
  loadContacts();
  setInterval(loadContacts, 20000);
}

function doLogout() {
  currentUser = '';
  contacts = [];
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// ====== DATA ======
async function loadContacts() {
  try {
    const r = await fetch(API + '?action=all');
    if (r.ok) {
      const d = await r.json();
      contacts = d.contacts || [];
      renderList();
    }
  } catch(e) {}
}

function myContacts() {
  if (isAdmin) return contacts;
  return contacts.filter(c => !c.owner || c.owner === currentUser);
}

// ====== RENDER ======
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderList();
}

function renderList() {
  const mc = myContacts();
  let f = filter === 'all' ? mc : mc.filter(c => c.category === filter);
  const el = document.getElementById('listEl');
  
  if (f.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:#ccc;padding:40px">暂无客户</div>';
    return;
  }
  
  el.innerHTML = f.map(c => {
    const cls = c.category ? 'badge badge-' + c.category.toLowerCase() : 'badge badge-new';
    const dl = c.nextFollowUp ? Math.ceil((new Date(c.nextFollowUp) - Date.now()) / 86400000) : null;
    const overdue = dl !== null && dl <= 0;
    return `<div class="item" ondblclick="openWA('${c.phone}')" onclick="openDetail('${c.phone}')">
      <div><div class="name">${c.name || c.phone} <span class="${cls}">${c.category || '新'}</span>${overdue ? ' ⚠️' : ''}</div>
      <div class="meta">${c.phone} · ${c.country || '未知'} · ${(c.orders || []).length}个订单 ${dl !== null ? '· ' + dl + '天' : ''}</div></div>
    </div>`;
  }).join('');
}

function openWA(phone) {
  chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, tabs => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { active: true });
    }
  });
}

function openDetail(phone) {
  const c = contacts.find(x => x.phone === phone);
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

function switchTab(id, btn) {
  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Toast
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
