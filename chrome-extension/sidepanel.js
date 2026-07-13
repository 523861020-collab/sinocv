// SINOCV CRM Side Panel v5
const API = 'https://truckmarts.com/api/crm';

const TEMPLATES = [
  { title: '首次问候', text: 'Hello! Thanks for contacting XINYUNTONG CHINA. We are a professional truck exporter. How can I help you?' },
  { title: '报价请求', text: 'Could you please tell me the specific model and quantity you need? I will send you the best price.' },
  { title: '运费说明', text: 'The shipping cost depends on the destination port and quantity. Please provide your port of destination.' },
  { title: '付款方式', text: 'We accept T/T (30% deposit, 70% before shipment) or L/C at sight.' },
  { title: '发货时间', text: 'Delivery time is 15-30 days after receiving deposit, depending on the model and quantity.' },
  { title: '售后保证', text: 'All our trucks come with 1 year warranty. We have after-sales service teams available.' },
  { title: 'WhatsApp联系', text: 'Please add me on WhatsApp for faster communication. My number is +86 130 0197 7959.' },
  { title: '追问需求', text: 'May I know your specific requirements? Such as: truck type, horsepower, transmission, and any special configurations?' },
];

let currentCustomer = null; // {phone, name, country, email, company, product, notes, ...}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚛 CRM loaded');
  loginSuccess('13001977959'); // test mode
  
  document.getElementById('btnQuickReply').addEventListener('click', showQuickReply);
  document.getElementById('btnAddCustomer').addEventListener('click', captureCurrentChat);
  document.getElementById('btnCustomerList').addEventListener('click', showCustomerList);
  document.getElementById('backToMain').addEventListener('click', showMain);
  document.getElementById('saveCustomer').addEventListener('click', saveCurrentCustomer);
  document.getElementById('logoutBtn').addEventListener('click', doLogout);
  
  showMain();
});

// ====== NAVIGATION ======
function showMain() {
  hideAll();
  document.getElementById('mainPanel').style.display = 'block';
}
function showQuickReply() {
  hideAll();
  document.getElementById('quickReplyPanel').style.display = 'block';
  renderTemplates();
}
function showCustomerCard() {
  hideAll();
  document.getElementById('customerCard').style.display = 'block';
  renderCustomerCard();
}
function showCustomerList() {
  hideAll();
  document.getElementById('customerListPanel').style.display = 'block';
  loadCustomerList();
}
function hideAll() {
  ['mainPanel','quickReplyPanel','customerCard','customerListPanel'].forEach(function(id) {
    document.getElementById(id).style.display = 'none';
  });
}

// ====== CAPTURE CURRENT CHAT ======
function captureCurrentChat() {
  toast('⏳ 读取中...', true);
  chrome.runtime.sendMessage({ type: 'getCurrentChat' }, function(resp) {
    if (!resp || !resp.ok || !resp.data || resp.data.error) {
      toast('❌ 请先在 WhatsApp 点开一个对话', false);
      return;
    }
    var d = resp.data;
    
    // Load existing data from CRM
    fetch(API + '?phone=' + encodeURIComponent(d.phone))
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(existing) {
        var c = existing && existing.contact ? existing.contact : {};
        currentCustomer = {
          phone: d.phone || '',
          name: c.name || d.name || '',
          country: c.country || d.country || '',
          email: c.email || '',
          company: c.company || '',
          product: c.product || '',
          notes: c.notes || '',
          orders: c.orders || [],
        };
        toast('✅ ' + (currentCustomer.name || currentCustomer.phone), true);
        showCustomerCard();
      })
      .catch(function() {
        currentCustomer = { phone: d.phone, name: d.name || '', country: d.country || '', email: '', company: '', product: '', notes: '', orders: [] };
        showCustomerCard();
      });
  });
}

// ====== CUSTOMER CARD ======
function renderCustomerCard() {
  if (!currentCustomer) return;
  var c = currentCustomer;
  var html = '' +
    '<div class="info-row"><span class="info-label">手机号</span><span class="info-val">' + esc(c.phone) + '</span></div>' +
    '<div class="info-row"><span class="info-label">名称</span><input id="edName" value="' + esc(c.name) + '" class="ed"></div>' +
    '<div class="info-row"><span class="info-label">国家</span><input id="edCountry" value="' + esc(c.country) + '" class="ed"></div>' +
    '<div class="info-row"><span class="info-label">邮箱</span><input id="edEmail" value="' + esc(c.email) + '" class="ed" placeholder="选填"></div>' +
    '<div class="info-row"><span class="info-label">公司</span><input id="edCompany" value="' + esc(c.company) + '" class="ed" placeholder="选填"></div>' +
    '<div class="info-row"><span class="info-label">需求车型</span><input id="edProduct" value="' + esc(c.product) + '" class="ed" placeholder="HOWO 6x4 tractor..."></div>' +
    '<div class="info-row"><span class="info-label">备注</span><textarea id="edNotes" class="ed" rows="3" placeholder="需求、价格、跟进...">' + esc(c.notes) + '</textarea></div>';
  
  // Orders section
  html += '<div style="margin-top:12px;font-size:12px;color:#f59e0b;font-weight:600">📦 订单 (' + (c.orders ? c.orders.length : 0) + ')</div>';
  if (c.orders && c.orders.length) {
    c.orders.forEach(function(o, i) {
      html += '<div class="order-item">' +
        '<b>#' + (i+1) + '</b> ' + esc(o.orderNo || '') + ' | ' + esc(o.status || '?') + ' | ' + esc(o.requirements || '') +
        '</div>';
    });
  }
  html += '<button id="addOrder" class="btn-sm">+ 添加订单</button>';
  
  document.getElementById('customerCardBody').innerHTML = html;
  
  // Event listeners
  document.getElementById('addOrder').addEventListener('click', showOrderForm);
}

function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

async function saveCurrentCustomer() {
  var data = {
    phone: currentCustomer.phone,
    name: document.getElementById('edName').value.trim(),
    country: document.getElementById('edCountry').value.trim(),
    email: document.getElementById('edEmail').value.trim(),
    company: document.getElementById('edCompany').value.trim(),
    product: document.getElementById('edProduct').value.trim(),
    notes: document.getElementById('edNotes').value.trim(),
  };
  try {
    var r = await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    if (r.ok) {
      currentCustomer.name = data.name;
      currentCustomer.email = data.email;
      currentCustomer.notes = data.notes;
      toast('✅ 已保存', true);
    } else {
      toast('❌ 保存失败', false);
    }
  } catch(e) { toast('❌ 网络错误', false); }
}

// ====== ORDER FORM ======
function showOrderForm() {
  var html = '' +
    '<div style="margin-top:8px;padding:8px;border:1px solid #1a1a1a;border-radius:6px">' +
    '<input id="ordNo" placeholder="订单号" class="ed">' +
    '<input id="ordReq" placeholder="车型需求" class="ed">' +
    '<input id="ordUnits" placeholder="数量" class="ed" type="number">' +
    '<input id="ordAmt" placeholder="金额 USD" class="ed">' +
    '<select id="ordStatus" class="ed" style="color:#fff;background:#000">' +
    '<option value="pending">待处理</option><option value="confirmed">已确认</option><option value="shipped">已发运</option><option value="delivered">已到港</option>' +
    '</select>' +
    '<button id="saveOrder" class="save-btn" style="margin-top:4px">保存订单</button>' +
    '</div>';
  
  var el = document.createElement('div');
  el.innerHTML = html;
  document.getElementById('addOrder').parentNode.appendChild(el);
  document.getElementById('addOrder').style.display = 'none';
  
  document.getElementById('saveOrder').addEventListener('click', saveOrder);
}

async function saveOrder() {
  var order = {
    orderNo: document.getElementById('ordNo').value.trim(),
    requirements: document.getElementById('ordReq').value.trim(),
    units: parseInt(document.getElementById('ordUnits').value) || 0,
    totalAmt: document.getElementById('ordAmt').value.trim(),
    status: document.getElementById('ordStatus').value,
    currency: 'USD',
  };
  if (!order.orderNo) { toast('❌ 请输入订单号', false); return; }
  
  if (!currentCustomer.orders) currentCustomer.orders = [];
  currentCustomer.orders.push(order);
  
  // Save full customer with orders
  try {
    var r = await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phone: currentCustomer.phone, orders: currentCustomer.orders }) });
    if (r.ok) {
      toast('✅ 订单已保存', true);
      showCustomerCard();
    }
  } catch(e) { toast('❌ 失败', false); }
}

// ====== CUSTOMER LIST ======
async function loadCustomerList() {
  try {
    var r = await fetch(API + '?action=all');
    if (r.ok) {
      var d = await r.json();
      var list = d.contacts || [];
      var html = '';
      list.forEach(function(c) {
        html += '<div class="cust-item" data-phone="' + esc(c.phone) + '">' +
          '<div class="cust-name">' + esc(c.name || c.phone) + '</div>' +
          '<div class="cust-meta">' + esc(c.phone) + ' · ' + esc(c.country || '') + ' · ' + (c.orders||[]).length + '单</div>' +
          '</div>';
      });
      document.getElementById('customerListBody').innerHTML = html || '<div style="color:#666;text-align:center;padding:20px">暂无客户</div>';
      
      document.querySelectorAll('.cust-item').forEach(function(el) {
        el.addEventListener('click', function() {
          var phone = el.getAttribute('data-phone');
          var c = list.find(function(x) { return x.phone === phone; });
          if (c) {
            currentCustomer = {
              phone: c.phone, name: c.name || '', country: c.country || '',
              email: c.email || '', company: c.company || '', product: c.product || '',
              notes: c.notes || '', orders: c.orders || []
            };
            showCustomerCard();
          }
        });
      });
    }
  } catch(e) {}
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
      sendToWA(t.text);
    });
  });
}

function sendToWA(text) {
  chrome.tabs.query({ url: '*://web.whatsapp.com/*' }, function(tabs) {
    if (!tabs.length) { toast('❌ 请先打开 WhatsApp Web', false); return; }
    chrome.tabs.sendMessage(tabs[0].id, { type: 'insertScript', text: text }, function() {
      toast('✅ 已填入', true);
    });
  });
}

// ====== LOGIN/LOGOUT ======
function loginSuccess(user) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'flex';
  document.getElementById('curUser').textContent = user;
}
function doLogout() {
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

// ====== TOAST ======
function toast(msg, ok) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.style.background = ok ? '#059669' : '#dc2626';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 2000);
}
