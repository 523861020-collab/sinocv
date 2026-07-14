// SINOCV CRM v6
const API = 'https://truckmarts.com/api/crm';
const CACHE_KEY = 'crm_cache';
const STATS_KEY = 'crm_daily_stats';
let cache = {}; // {customers:{}, products:[], templates:[], lastSync:0}
let currentPhone = '';
let currentData = null;
let currentUser = '13001977959'; // default
let dailyStats = {}; // {date: {chats:0, customers:{}, pis:0}}
let activeTab = 'customer';

// Vehicle types
const VEHICLE_TYPES = ['牵引车','自卸车','油罐车','水罐车','随车吊','高空作业车','垃圾运输车','搅拌车','工程机械'];
const DRIVE_TYPES = ['4×2','6×4','4×4','6×6'];
const MACHINERY_TYPES = ['挖掘机','装载机','压路机'];

// Templates by country
const DEFAULT_TEMPLATES = {
  '通用': [
    {title:'首次问候',text:'Hello! Thanks for contacting XINYUNTONG CHINA. We are a professional truck exporter. How can I help you?'},
    {title:'报价请求',text:'Could you please tell me the specific model and quantity? I will send you the best price.'},
    {title:'付款方式',text:'We accept T/T (30% deposit, 70% before shipment) or L/C at sight. Delivery: 15-30 days after deposit.'},
  ]
};

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function(){
  loadCache();
  loadStats();
  initUser();
  document.querySelectorAll('.tabs button').forEach(function(b){
    b.addEventListener('click', function(){ switchTab(b.getAttribute('data-tab')); });
  });
  startChatWatcher();
  switchTab('customer');
  updateDashboard();
  setInterval(updateDashboard, 300000); // refresh stats every 5 min
});

function switchTab(tab){
  activeTab = tab;
  document.querySelectorAll('.tabs button').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tab')===tab);
  });
  if(tab==='customer') renderCustomerTab();
  else if(tab==='products') renderProductsTab();
  else if(tab==='templates') renderTemplatesTab();
}

// ====== CACHE ======
function loadCache(){
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'); } catch(e){}
  if(!cache.customers) cache.customers = {};
  if(!cache.products) cache.products = [];
  if(!cache.templates) cache.templates = DEFAULT_TEMPLATES;
}

function saveCache(){ localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }

// ====== CHAT CAPTURE (manual button) ======
function startChatWatcher(){} // disabled — use manual button

function captureCurrentChat(){
  chrome.runtime.sendMessage({type:'getCurrentChat'}, function(resp){
    if(!resp || !resp.ok || !resp.data || !resp.data.phone){
      toast('❌ 请先点开一个 WhatsApp 对话', false); return;
    }
    var d = resp.data;
    currentPhone = d.phone;
    currentData = cache.customers[currentPhone] || {
      phone: currentPhone, name: d.name||'', country: d.country||'',
      email:'', company:'', product:'', notes:'',
      orders: [{id:1, requirements:[], docs:[], totalAmt:'', depositAmt:'', depositDate:'', balanceAmt:'', balanceDate:'', orderNo:'', vins:'', shipDate:'', eta:'', status:'active'}],
      followUps: []
    };
    // Also load from CRM for existing data
    fetch(API+'?phone='+encodeURIComponent(currentPhone))
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(existing){
        if(existing && existing.contact){
          var c = existing.contact;
          currentData.name = c.name || currentData.name;
          currentData.country = c.country || currentData.country;
          currentData.email = c.email || '';
          currentData.company = c.company || '';
          currentData.notes = c.notes || '';
          currentData.orders = (c.orders && c.orders.length) ? c.orders : currentData.orders;
          currentData.followUps = c.followUps || [];
          cache.customers[currentPhone] = currentData;
          saveCache();
        }
        renderCustomerTab();
        toast('✅ '+(currentData.name||currentPhone)+' 已加载', true);
      })
      .catch(function(){ renderCustomerTab(); });
  });
}

function updateStatus(txt){ document.getElementById('statusBar').textContent = txt||'就绪'; }

// ====== CUSTOMER TAB ======
function renderCustomerTab(){
  var el = document.getElementById('content');
  if(!currentData){
    el.innerHTML = '<div style="text-align:center;padding:40px"><div style="color:#666;margin-bottom:16px">👆 先在 WhatsApp 点开客户对话</div><button class="btn btn-gold" id="captureBtn" style="width:auto;display:inline-block;padding:10px 24px">📥 添加客户信息</button></div>';
    document.getElementById('captureBtn').addEventListener('click', captureCurrentChat);
    return;
  }
  var d = currentData;
  var h = '';
  // Client info
  h += '<div class="card">';
  h += '<div class="card-title">📋 客户信息 <button class="btn-sm" id="saveCustomerBtn">💾 保存</button></div>';
  h += '<label>手机号</label><input id="ciPhone" value="'+esc(d.phone)+'" readonly style="color:#666">';
  h += '<label>名称</label><input id="ciName" value="'+esc(d.name)+'">';
  h += '<label>国家</label><input id="ciCountry" value="'+esc(d.country)+'">';
  h += '<label>邮箱</label><input id="ciEmail" value="'+esc(d.email||'')+'" placeholder="选填">';
  h += '<label>公司</label><input id="ciCompany" value="'+esc(d.company||'')+'" placeholder="选填">';
  h += '</div>';
  
  // Orders
  h += '<div class="card">';
  h += '<div class="card-title">📦 订单 <button class="btn-sm" id="newOrderBtn">+ 新建订单</button></div>';
  (d.orders||[]).forEach(function(o,i){
    h += renderOrderHTML(o,i);
  });
  h += '</div>';
  
  // Follow-ups
  h += '<div class="card">';
  h += '<div class="card-title">📝 跟进记录 <button class="btn-sm" id="newFollowBtn">+ 新增</button></div>';
  h += '<div id="followList">';
  (d.followUps||[]).forEach(function(f){
    h += '<div class="follow-item">📅 '+esc(f.date||'')+' — '+esc(f.content||'')+'</div>';
  });
  h += '</div>';
  h += '</div>';
  
  el.innerHTML = h;
  
  // Event bindings
  document.getElementById('saveCustomerBtn').addEventListener('click', saveCustomer);
  document.getElementById('newOrderBtn').addEventListener('click', newOrder);
  document.getElementById('newFollowBtn').addEventListener('click', newFollow);
  
  // Order toggle
  document.querySelectorAll('.order-hdr').forEach(function(hdr){
    hdr.addEventListener('click', function(){
      var body = hdr.nextElementSibling;
      body.classList.toggle('open');
    });
  });
}

function renderOrderHTML(o, idx){
  var open = idx===0 ? ' open' : '';
  var h = '<div class="order-box">';
  h += '<div class="order-hdr">📦 订单'+(o.id||(idx+1))+' <span style="font-size:10px;color:#'+(o.status==='done'?'666':'f59e0b')+'">'+(o.status==='done'?'已完成':'进行中')+'</span></div>';
  h += '<div class="order-body'+open+'">';
  
  // Requirements
  h += '<label>车型需求</label>';
  h += '<select class="ordType" data-idx="'+idx+'"><option value="">车型大类</option>';
  VEHICLE_TYPES.forEach(function(t){ h += '<option '+(o.vehicleType===t?'selected':'')+'>'+t+'</option>'; });
  h += '</select>';
  h += '<input class="ordBrand" data-idx="'+idx+'" placeholder="车辆品系" value="'+esc(o.brand||'')+'">';
  h += '<div class="row"><input class="ordQty" data-idx="'+idx+'" type="number" placeholder="台数" value="'+(o.qty||'')+'"><input class="ordColor" data-idx="'+idx+'" placeholder="颜色" value="'+esc(o.color||'')+'"></div>';
  h += '<input class="ordPlanDate" data-idx="'+idx+'" placeholder="客户计划用车时间" value="'+esc(o.planDate||'')+'">';
  
  // Documents
  h += '<label style="margin-top:8px">📎 文件上传</label>';
  h += '<div class="flex"><select class="docType" data-idx="'+idx+'"><option>PI单据</option><option>信用证(LC)</option><option>交单单据</option></select>';
  h += '<input type="file" class="docFile" data-idx="'+idx+'" style="margin:0"><button class="btn-sm uploadDoc" data-idx="'+idx+'">上传</button></div>';
  h += '<div class="docList" id="docList'+idx+'"></div>';
  
  // Deal info
  h += '<label style="margin-top:8px">成交信息</label>';
  h += '<input class="ordTotal" data-idx="'+idx+'" placeholder="订单总金额" value="'+esc(o.totalAmt||'')+'">';
  h += '<div class="row"><input class="ordDeposit" data-idx="'+idx+'" placeholder="定金金额" value="'+esc(o.depositAmt||'')+'"><input class="ordDepositDate" data-idx="'+idx+'" placeholder="定金日期" value="'+esc(o.depositDate||'')+'"></div>';
  h += '<div class="row"><input class="ordBalance" data-idx="'+idx+'" placeholder="尾款金额" value="'+esc(o.balanceAmt||'')+'"><input class="ordBalanceDate" data-idx="'+idx+'" placeholder="尾款日期" value="'+esc(o.balanceDate||'')+'"></div>';
  h += '<input class="ordNo" data-idx="'+idx+'" placeholder="车辆订单号" value="'+esc(o.orderNo||'')+'">';
  h += '<input class="ordVIN" data-idx="'+idx+'" placeholder="VIN号" value="'+esc(o.vins||'')+'">';
  h += '<div class="row"><input class="ordShip" data-idx="'+idx+'" placeholder="发运日期" value="'+esc(o.shipDate||'')+'"><input class="ordETA" data-idx="'+idx+'" placeholder="到港日期" value="'+esc(o.eta||'')+'"></div>';
  
  if(o.status !== 'done'){
    h += '<button class="btn btn-gold doneOrderBtn" data-idx="'+idx+'" style="margin-top:4px">✅ 确认完成</button>';
  }
  h += '</div></div>';
  return h;
}

// ====== CUSTOMER ACTIONS ======
function saveCustomer(){
  currentData.name = document.getElementById('ciName').value.trim();
  currentData.country = document.getElementById('ciCountry').value.trim();
  currentData.email = document.getElementById('ciEmail').value.trim();
  currentData.company = document.getElementById('ciCompany').value.trim();
  
  // Collect order data
  document.querySelectorAll('.order-body').forEach(function(body){
    var idx = parseInt(body.querySelector('[data-idx]').getAttribute('data-idx'));
    var o = currentData.orders[idx];
    o.vehicleType = body.querySelector('.ordType')?.value||'';
    o.brand = body.querySelector('.ordBrand')?.value||'';
    o.qty = body.querySelector('.ordQty')?.value||'';
    o.color = body.querySelector('.ordColor')?.value||'';
    o.planDate = body.querySelector('.ordPlanDate')?.value||'';
    o.totalAmt = body.querySelector('.ordTotal')?.value||'';
    o.depositAmt = body.querySelector('.ordDeposit')?.value||'';
    o.depositDate = body.querySelector('.ordDepositDate')?.value||'';
    o.balanceAmt = body.querySelector('.ordBalance')?.value||'';
    o.balanceDate = body.querySelector('.ordBalanceDate')?.value||'';
    o.orderNo = body.querySelector('.ordNo')?.value||'';
    o.vins = body.querySelector('.ordVIN')?.value||'';
    o.shipDate = body.querySelector('.ordShip')?.value||'';
    o.eta = body.querySelector('.ordETA')?.value||'';
  });
  
  cache.customers[currentPhone] = currentData;
  saveCache();
  syncToCRM(currentData);
  toast('✅ 已保存', true);
}

function newOrder(){
  if(!currentData) return;
  var id = (currentData.orders||[]).length + 1;
  currentData.orders.push({id:id, requirements:[], docs:[], status:'active'});
  saveCache();
  renderCustomerTab();
}

function newFollow(){
  if(!currentData) return;
  var txt = prompt('跟进内容:');
  if(!txt) return;
  if(!currentData.followUps) currentData.followUps = [];
  currentData.followUps.push({date: new Date().toISOString().split('T')[0], content: txt});
  saveCache();
  renderCustomerTab();
}

// Done button
document.addEventListener('click', function(e){
  if(e.target.classList.contains('doneOrderBtn')){
    var idx = parseInt(e.target.getAttribute('data-idx'));
    currentData.orders[idx].status = 'done';
    saveCache();
    syncToCRM(currentData);
    renderCustomerTab();
    toast('✅ 订单已完成归档', true);
  }
});

// ====== PRODUCTS TAB ======
function renderProductsTab(){
  var h = '<label>🌍 国家筛选</label>';
  h += '<select id="prodCountry"><option value="">全部</option>';
  var countries = {};
  (cache.products||[]).forEach(function(p){ if(p.country) countries[p.country]=1; });
  Object.keys(countries).sort().forEach(function(c){ h += '<option>'+c+'</option>'; });
  h += '<option value="machinery">工程机械(无国家限制)</option></select>';
  h += '<label>车型大类</label><select id="prodType"><option value="">全部</option></select>';
  h += '<label>驱动形式</label><select id="prodDrive"><option value="">全部</option></select>';
  h += '<div id="prodList" style="margin-top:8px"></div>';
  document.getElementById('content').innerHTML = h;
  
  document.getElementById('prodCountry').addEventListener('change', filterProducts);
  document.getElementById('prodType').addEventListener('change', filterProducts);
  document.getElementById('prodDrive').addEventListener('change', filterProducts);
  filterProducts();
}

function filterProducts(){
  var country = document.getElementById('prodCountry')?.value||'';
  var type = document.getElementById('prodType')?.value||'';
  var drive = document.getElementById('prodDrive')?.value||'';
  
  // Update type dropdown based on country
  var typeSel = document.getElementById('prodType');
  var types = country==='machinery' ? MACHINERY_TYPES : VEHICLE_TYPES.filter(function(t){ return t!=='工程机械'; });
  typeSel.innerHTML = '<option value="">全部</option>'+types.map(function(t){ return '<option>'+t+'</option>'; }).join('');
  if(type && types.indexOf(type)<0) typeSel.value = '';
  
  var driveSel = document.getElementById('prodDrive');
  if(country==='machinery'){ driveSel.parentElement.style.display='none'; }
  else{ driveSel.parentElement.style.display='block'; }
  
  var products = cache.products||[];
  var filtered = products.filter(function(p){
    if(country && country!=='machinery' && p.country!==country) return false;
    if(country==='machinery' && !MACHINERY_TYPES.includes(p.type)) return false;
    if(country!=='machinery' && p.type==='工程机械') return false;
    if(type && p.type!==type) return false;
    if(!country || country==='machinery'){ if(drive && p.drive!==drive) return false; }
    return true;
  });
  
  var h = '';
  filtered.forEach(function(p){
    h += '<div class="card">';
    h += '<div class="card-title">'+esc(p.title||p.type)+' '+esc(p.drive||'')+' <span class="copy-btn" data-text="'+esc(p.config||'')+'">📋 一键复制</span></div>';
    h += '<div style="font-size:11px;color:#999">'+esc(p.config||'')+'</div>';
    h += '<div style="margin-top:4px;font-size:12px">FOB: <b style="color:#f59e0b">'+esc(p.fob||'')+'</b>';
    if(p.seaFreight){ h += ' | CFR: <b style="color:#f59e0b">'+esc(p.cfr||'')+'</b> | CIF: <b style="color:#f59e0b">'+esc(p.cif||'')+'</b>'; }
    h += '</div></div>';
  });
  if(!filtered.length) h = '<div style="text-align:center;color:#666;padding:20px">产品数据从CRM后台同步，暂无数据</div>';
  document.getElementById('prodList').innerHTML = h;
  
  document.querySelectorAll('.copy-btn').forEach(function(b){
    b.addEventListener('click', function(){
      copyToClipboard(b.getAttribute('data-text'));
    });
  });
}

// ====== TEMPLATES TAB ======
function renderTemplatesTab(){
  var templates = cache.templates||DEFAULT_TEMPLATES;
  var h = '<label>🌍 按国家筛选</label><select id="tplCountry"><option value="通用">通用</option>';
  Object.keys(templates).filter(function(k){ return k!=='通用'; }).forEach(function(k){
    h += '<option>'+k+'</option>';
  });
  h += '</select>';
  h += '<div id="tplList" style="margin-top:8px"></div>';
  document.getElementById('content').innerHTML = h;
  
  function renderTpls(country){
    var tpls = templates[country]||templates['通用']||[];
    var html = '';
    tpls.forEach(function(t,i){
      html += '<div class="card"><div class="card-title">'+esc(t.title)+' <span class="copy-btn" data-text="'+esc(t.text)+'">复制</span></div>';
      html += '<div style="font-size:11px;color:#999">'+esc(t.text)+'</div></div>';
    });
    document.getElementById('tplList').innerHTML = html;
    document.querySelectorAll('.copy-btn').forEach(function(b){
      b.addEventListener('click', function(){ copyAndSend(b.getAttribute('data-text')); });
    });
  }
  
  document.getElementById('tplCountry').addEventListener('change', function(){
    renderTpls(this.value);
  });
  renderTpls('通用');
}

// ====== HELPERS ======
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toast(msg, ok){
  var t = document.createElement('div'); t.className='toast';
  t.style.background = ok ? '#059669' : '#dc2626'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2000);
}

function copyToClipboard(text){
  navigator.clipboard.writeText(text).then(function(){ toast('✅ 已复制',true); });
}

function copyAndSend(text){
  navigator.clipboard.writeText(text).then(function(){
    chrome.tabs.query({url:'*://web.whatsapp.com/*'}, function(tabs){
      if(tabs.length) chrome.tabs.sendMessage(tabs[0].id, {type:'insertScript',text:text}, function(){
        toast('✅ 已填入WhatsApp',true);
      });
    });
  });
}

function syncToCRM(data){
  try {
    fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
  } catch(e){}
}

// ====== DASHBOARD STATS ======
function initUser(){
  chrome.storage.local.get(['crmUser'], function(d){
    if(d.crmUser) currentUser = d.crmUser;
    document.getElementById('userName').textContent = '👤 '+currentUser;
  });
}

function loadStats(){
  try { dailyStats = JSON.parse(localStorage.getItem(STATS_KEY)||'{}'); } catch(e){ dailyStats = {}; }
}

function saveStats(){ localStorage.setItem(STATS_KEY, JSON.stringify(dailyStats)); }

function updateDashboard(){
  // Pull real stats from CRM backend
  fetch(API+'/stats')
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if(data){
        document.getElementById('dashChats').textContent = data.todayChats||0;
        document.getElementById('dashCustomers').textContent = data.totalCustomers||0;
        document.getElementById('dashPI').textContent = data.todayPis||0;
        document.getElementById('dashOrders').textContent = data.totalOrders||0;
      }
    })
    .catch(function(){});
}
