// SINOCV CRM Side Panel
const API = 'https://truckmarts.com/api/crm';
const PINS = { '13001977959': '202502', '李善龙': '202502', '王小涵': '1111', '毛振威': '2222', '赵欢乐': '3333', '杜飞跃': '4444' };
const STORAGE_KEY = 'crm_login';

// Quick reply templates
const TEMPLATES = [
  { title: '首次问候', text: 'Hello! Thanks for contacting XINYUNTONG CHINA. We are a professional truck exporter. How can I help you?' },
  { title: '报价请求', text: 'Could you please tell me the specific model and quantity you need? I will send you the best price.' },
  { title: '运费说明', text: 'The shipping cost depends on the destination port and quantity. Please provide your port of destination.' },
  { title: '付款方式', text: 'We accept T/T (30% deposit, 70% before shipment) or L/C at sight.' },
  { title: '发货时间', text: 'Delivery time is 15-30 days after receiving deposit, depending on the model and quantity.' },
  { title: '售后保证', text: 'All our trucks come with 1 year warranty. We have after-sales service teams available.' },
  { title: 'WhatsApp联系', text: 'Please add me on WhatsApp for faster communication. My number is +86 130 0197 7959.' },
  { title: '公司介绍（中文）', text: '您好，我们是鑫运通中国，专业出口中国重汽、陕汽等品牌卡车，欢迎咨询！' },
  { title: '公司介绍', text: 'XINYUNTONG CHINA specializes in exporting HOWO, SHACMAN, and other Chinese brand trucks. We provide competitive prices and reliable service.' },
  { title: '追问需求', text: 'May I know your specific requirements? Such as: truck type, horsepower, transmission (manual/automatic), and any special configurations?' },
];

let currentUser = '';

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginBtn').addEventListener('click', doLogin);
  document.getElementById('loginPass').addEventListener('keydown', function(e) { if (e.key === 'Enter') doLogin(); });
  document.getElementById('logoutBtn').addEventListener('click', doLogout);
  
  document.getElementById('btnQuickReply').addEventListener('click', function() { showPanel('quickReply'); });
  document.getElementById('btnAddCustomer').addEventListener('click', function() { syncAndShowForm(); });
  document.getElementById('quickBack').addEventListener('click', function() { showPanel('main'); });
  document.getElementById('addBack').addEventListener('click', function() { showPanel('main'); });
  
  autoLogin();
});

// ====== PERSISTENT LOGIN ======
function autoLogin() {
  chrome.storage.local.get(['crmUser', 'crmLoginTime'], function(data) {
    if (data.crmUser && data.crmLoginTime && (Date.now() - data.crmLoginTime < 86400000)) {
      loginSuccess(data.crmUser);
    } else {
      // TEST MODE: auto-login as admin
      loginSuccess('13001977959');
    }
  });
}

function doLogin() {
  var u = document.getElementById('loginUser').value.trim();
  var p = document.getElementById('loginPass').value.trim();
  var err = document.getElementById('loginErr');
  err.style.display = 'none';
  if (!u || !p) { err.textContent = '请输入用户名和密码'; err.style.display = 'block'; return; }
  if (PINS[u] !== p) { err.textContent = '密码错误'; err.style.display = 'block'; return; }
  chrome.storage.local.set({ crmUser: u, crmLoginTime: Date.now() });
  loginSuccess(u);
}

function loginSuccess(user) {
  currentUser = user;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  document.getElementById('curUser').textContent = user;
  showPanel('main');
}

function doLogout() {
  chrome.storage.local.remove(['crmUser', 'crmLoginTime']);
  currentUser = '';
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

// ====== NAVIGATION ======
function showPanel(name) {
  document.getElementById('mainPanel').style.display = name === 'main' ? 'block' : 'none';
  document.getElementById('quickReplyPanel').style.display = name === 'quickReply' ? 'block' : 'none';
  document.getElementById('addCustomerPanel').style.display = name === 'addCustomer' ? 'block' : 'none';
  
  if (name === 'quickReply') renderTemplates();
}

// ====== QUICK REPLY ======
function renderTemplates() {
  var html = '';
  TEMPLATES.forEach(function(t, i) {
    html += '<div class="template-item" data-idx="' + i + '">' +
      '<div class="title">' + t.title + '</div>' +
      '<div class="text">' + t.text + '</div></div>';
  });
  document.getElementById('templateList').innerHTML = html;
  
  document.querySelectorAll('.template-item').forEach(function(el) {
    el.addEventListener('click', function() {
      var t = TEMPLATES[parseInt(el.getAttribute('data-idx'))];
      sendToWhatsApp(t.text);
    });
  });
}

function sendToWhatsApp(text) {
  chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
    if (!tabs.length) { toast('❌ 请先打开 WhatsApp Web', false); return; }
    chrome.tabs.sendMessage(tabs[0].id, { type: 'insertScript', text: text }, function() {
      toast('✅ 已填入输入框', true);
    });
  });
}

// ====== ADD CUSTOMER ======
function syncAndShowForm() {
  toast('⏳ 读取客户信息...', true);
  chrome.runtime.sendMessage({ type: 'getCurrentChat' }, function(resp) {
    if (!resp || !resp.ok || !resp.data || resp.data.error) {
      toast('❌ 请先在 WhatsApp 点开一个对话', false);
      renderCustomerForm({});
      return;
    }
    var d = resp.data;
    toast('✅ ' + (d.name || d.phone), true);
    renderCustomerForm({ phone: d.phone, name: d.name, country: d.country });
  });
}

function renderCustomerForm(data) {
  data = data || {};
  var html = '<div style="margin-bottom:12px;color:#666;font-size:11px">' +
    '从当前 WhatsApp 对话获取</div>' +
    '<label style="color:#888;font-size:11px">手机号</label>' +
    '<input id="cfPhone" value="' + (data.phone || '') + '" placeholder="手机号">' +
    '<label style="color:#888;font-size:11px">客户名称</label>' +
    '<input id="cfName" value="' + (data.name || '') + '" placeholder="客户名称">' +
    '<label style="color:#888;font-size:11px">国家</label>' +
    '<input id="cfCountry" value="' + (data.country || '') + '" placeholder="国家">' +
    '<label style="color:#888;font-size:11px">邮箱</label>' +
    '<input id="cfEmail" placeholder="邮箱（选填）">' +
    '<label style="color:#888;font-size:11px">公司</label>' +
    '<input id="cfCompany" placeholder="公司名称（选填）">' +
    '<label style="color:#888;font-size:11px">需求车型</label>' +
    '<input id="cfProduct" placeholder="例如：HOWO 6x4 tractor">' +
    '<label style="color:#888;font-size:11px">备注</label>' +
    '<textarea id="cfNotes" rows="3" placeholder="客户备注、需求详情..."></textarea>' +
    '<button class="save-btn" id="saveCustomer">💾 保存客户</button>';
  
  document.getElementById('customerForm').innerHTML = html;
  showPanel('addCustomer');
  
  document.getElementById('saveCustomer').addEventListener('click', saveCustomer);
}

async function saveCustomer() {
  var data = {
    phone: document.getElementById('cfPhone').value.trim(),
    name: document.getElementById('cfName').value.trim(),
    country: document.getElementById('cfCountry').value.trim(),
    email: document.getElementById('cfEmail').value.trim(),
    company: document.getElementById('cfCompany').value.trim(),
    product: document.getElementById('cfProduct').value.trim(),
    notes: document.getElementById('cfNotes').value.trim(),
    source: 'whatsapp_plugin'
  };
  if (!data.phone) { toast('❌ 手机号不能为空', false); return; }
  
  try {
    var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (r.ok) {
      toast('✅ ' + (data.name || data.phone) + ' 已保存', true);
      showPanel('main');
    } else {
      toast('❌ 保存失败', false);
    }
  } catch(e) {
    toast('❌ 网络错误', false);
  }
}

// ====== TOAST ======
function toast(msg, ok) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.style.background = ok ? '#059669' : '#dc2626';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 2500);
}
