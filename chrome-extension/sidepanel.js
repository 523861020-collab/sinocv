// SINOCV CRM v6 — Diagnostic build
const API = 'https://truckmarts.com/api/crm';
const CACHE_KEY = 'crm_cache';
let cache = { customers:{}, products:[], templates:{} };
let currentPhone = '';
let currentData = null;
let currentUser = '13001977959';
let activeTab = 'customer';

const VEHICLE_TYPES = ['牵引车','自卸车','油罐车','水罐车','随车吊','高空作业车','垃圾运输车','搅拌车','工程机械'];

const DEFAULT_TEMPLATES = {
  '通用': [
    {title:'首次问候',text:'Hello! Thanks for contacting XINYUNTONG CHINA. We are a professional truck exporter. How can I help you?'},
    {title:'报价请求',text:'Could you please tell me the specific model and quantity? I will send you the best price.'},
    {title:'付款方式',text:'We accept T/T (30% deposit, 70% before shipment) or L/C at sight.'},
  ]
};

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function(){
  console.log('CRM INIT');
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'); } catch(e){}
  if(!cache.customers) cache.customers = {};
  if(!cache.products) cache.products = [];
  if(!cache.templates) cache.templates = DEFAULT_TEMPLATES;
  
  initUser();
  document.querySelectorAll('.tabs button').forEach(function(b){
    b.addEventListener('click', function(){ switchTab(b.getAttribute('data-tab')); });
  });
  switchTab('customer');
  updateDashboard();
  setInterval(updateDashboard, 300000);
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

function initUser(){
  document.getElementById('userName').textContent = '👤 '+currentUser;
}

function saveCache(){ localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }

// ====== CAPTURE — STEP BY STEP ======
function captureCurrentChat(){
  var el = document.getElementById('userName');
  el.textContent = '⏳ 查询标签页...';
  
  chrome.tabs.query({}, function(tabs) {
    el.textContent = '找到'+tabs.length+'个标签';
    
    // Find WhatsApp tabs
    var waTabs = [];
    for(var i=0; i<tabs.length; i++){
      if(tabs[i].url && tabs[i].url.indexOf('web.whatsapp.com')>-1){
        waTabs.push(tabs[i]);
      }
    }
    
    if(!waTabs.length){
      el.textContent = '❌ 未找到WhatsApp标签';
      return;
    }
    
    el.textContent = '找到'+waTabs.length+'个WA标签, 尝试通信...';
    
    // Try each WhatsApp tab with executeScript
    function tryTab(i){
      if(i >= waTabs.length){
        el.textContent = '❌ 所有WA标签获取失败';
        return;
      }
      el.textContent = '标签'+waTabs[i].id+'...';
      
      chrome.scripting.executeScript({
        target: { tabId: waTabs[i].id },
        func: function(){
          try {
            var s = window.Store;
            if(!s||!s.Chat) return {error:'notloaded'};
            var c = s.Chat.getActive?s.Chat.getActive():null;
            if(!c){ var chats=s.Chat.getModelsArray?s.Chat.getModelsArray():[]; for(var j=0;j<chats.length;j++){if(chats[j].__x_isActive){c=chats[j];break;}} }
            if(!c) return {error:'nochat'};
            var ct=c.contact||c.__x_contact; if(!ct) return {error:'nocontact'};
            var p=''; if(ct.id&&ct.id.user)p=ct.id.user; else if(ct.id&&ct.id._serialized)p=ct.id._serialized.split('@')[0];
            var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
            return {phone:p,name:n};
          }catch(e){ return {error:String(e)}; }
        }
      }, function(results){
        if(chrome.runtime.lastError){
          el.textContent = '❌ 标签'+waTabs[i].id+':'+chrome.runtime.lastError.message;
          setTimeout(function(){ tryTab(i+1); }, 500);
          return;
        }
        var d = results&&results[0]?results[0].result:null;
        if(d&&d.phone&&!d.error){
          el.textContent = '✅ '+d.name+' '+d.phone;
          onCaptureSuccess(d);
        } else {
          el.textContent = '❌ 标签'+waTabs[i].id+':'+(d?d.error:'nodata');
          tryTab(i+1);
        }
      });
    }
    tryTab(0);
  });
}

function onCaptureSuccess(d){
  currentPhone = d.phone;
  currentData = cache.customers[currentPhone] || {
    phone: currentPhone, name: d.name||'', country: getCountry(d.phone),
    email:'', company:'', product:'', notes:'',
    orders: [{id:1, requirements:[], docs:[], totalAmt:'', status:'active'}],
    followUps: []
  };
  renderCustomerTab();
  fetch(API+'?phone='+encodeURIComponent(currentPhone))
    .then(function(r){ return r.ok?r.json():null; })
    .then(function(existing){
      if(existing&&existing.contact){
        var c=existing.contact;
        if(c.name) currentData.name=c.name;
        if(c.country) currentData.country=c.country;
        if(c.email) currentData.email=c.email;
        if(c.company) currentData.company=c.company;
        if(c.notes) currentData.notes=c.notes;
        if(c.orders&&c.orders.length) currentData.orders=c.orders;
        if(c.followUps) currentData.followUps=c.followUps;
        cache.customers[currentPhone]=currentData;
        saveCache();
      }
      renderCustomerTab();
    })
    .catch(function(){});
}

function getCountry(p){
  if(!p||!p.startsWith('+')) return '';
  var m={'213':'Algeria','218':'Libya','234':'Nigeria','232':'Sierra Leone','224':'Guinea',
    '221':'Senegal','223':'Mali','227':'Niger','229':'Benin','228':'Togo','233':'Ghana',
    '225':'Ivory Coast','237':'Cameroon','243':'DR Congo','254':'Kenya','251':'Ethiopia',
    '252':'Somalia','253':'Djibouti','256':'Uganda','255':'Tanzania','250':'Rwanda',
    '257':'Burundi','265':'Malawi','260':'Zambia','263':'Zimbabwe','258':'Mozambique',
    '244':'Angola','27':'South Africa','20':'Egypt','212':'Morocco','216':'Tunisia',
    '222':'Mauritania','235':'Chad','231':'Liberia','220':'Gambia',
    '1':'US/Canada','44':'UK','971':'UAE','86':'China','63':'Philippines',
    '55':'Brazil','58':'Venezuela','591':'Bolivia','592':'Guyana','91':'India','92':'Pakistan'};
  var c=p.replace('+','').replace(/[^0-9]/g,'');
  for(var l=3;l>=1;l--){ var pr=c.substring(0,l); if(m[pr])return m[pr]; }
  return '';
}

function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function toast(msg,ok){
  var t=document.createElement('div'); t.className='toast';
  t.style.background=ok?'#059669':'#dc2626'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(function(){t.remove();},2000);
}

// ====== CUSTOMER TAB ======
function renderCustomerTab(){
  var el=document.getElementById('content');
  if(!currentData){
    el.innerHTML='<div style="text-align:center;padding:40px"><div style="color:#666;margin-bottom:16px">👆 WhatsApp点开客户对话</div><button class="btn btn-gold" id="captureBtn" style="width:auto;display:inline-block;padding:10px 24px">📥 添加客户信息</button></div>';
    setTimeout(function(){ var b=document.getElementById('captureBtn'); if(b)b.onclick=captureCurrentChat; },100);
    return;
  }
  var d=currentData,h='';
  h+='<div class="card"><div class="card-title">📋 客户信息 <button class="btn-sm" id="saveBtn">💾 保存</button></div>';
  h+='<label>手机号</label><input id="ciPhone" value="'+esc(d.phone)+'" readonly style="color:#666">';
  h+='<label>名称</label><input id="ciName" value="'+esc(d.name)+'">';
  h+='<label>国家</label><input id="ciCountry" value="'+esc(d.country||'')+'">';
  h+='<label>邮箱</label><input id="ciEmail" value="'+esc(d.email||'')+'" placeholder="选填">';
  h+='<label>公司</label><input id="ciCompany" value="'+esc(d.company||'')+'" placeholder="选填">';
  h+='</div>';
  h+='<div class="card"><div class="card-title">📦 订单 <button class="btn-sm" id="newOrderBtn">+ 新建</button></div>';
  (d.orders||[]).forEach(function(o,i){
    h+='<div class="order-box"><div class="order-hdr">📦 订单'+(o.id||(i+1))+' <span style="font-size:10px;color:'+(o.status==='done'?'#666':'#f59e0b')+'">'+(o.status==='done'?'已完成':'进行中')+'</span></div>';
    h+='<div class="order-body'+(i===0?' open':'')+'">';
    h+='<label>车型需求</label><select class="ordType" data-idx="'+i+'"><option value="">车型大类</option>';
    VEHICLE_TYPES.forEach(function(t){h+='<option '+(o.vehicleType===t?'selected':'')+'>'+t+'</option>';});
    h+='</select><input class="ordBrand" data-idx="'+i+'" placeholder="车辆品系" value="'+esc(o.brand||'')+'">';
    h+='<div class="row"><input class="ordQty" data-idx="'+i+'" type="number" placeholder="台数" value="'+(o.qty||'')+'"><input class="ordColor" data-idx="'+i+'" placeholder="颜色" value="'+esc(o.color||'')+'"></div>';
    h+='<label>成交信息</label><input class="ordTotal" data-idx="'+i+'" placeholder="订单总金额" value="'+esc(o.totalAmt||'')+'">';
    h+='<input class="ordNo" data-idx="'+i+'" placeholder="订单号" value="'+esc(o.orderNo||'')+'">';
    if(o.status!=='done') h+='<button class="btn btn-gold doneBtn" data-idx="'+i+'" style="margin-top:4px">✅ 确认完成</button>';
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="card"><div class="card-title">📝 跟进记录 <button class="btn-sm" id="newFollowBtn">+ 新增</button></div><div id="followList">';
  (d.followUps||[]).forEach(function(f){h+='<div class="follow-item">📅 '+esc(f.date||'')+' — '+esc(f.content||'')+'</div>';});
  h+='</div></div>';
  el.innerHTML=h;
  document.getElementById('saveBtn').addEventListener('click',saveCustomer);
  document.getElementById('newOrderBtn').addEventListener('click',newOrder);
  document.getElementById('newFollowBtn').addEventListener('click',newFollow);
  document.querySelectorAll('.order-hdr').forEach(function(hdr){ hdr.addEventListener('click',function(){hdr.nextElementSibling.classList.toggle('open');}); });
  document.querySelectorAll('.doneBtn').forEach(function(b){ b.addEventListener('click',function(){ var i=parseInt(b.getAttribute('data-idx')); currentData.orders[i].status='done'; saveCache(); syncToCRM(currentData); renderCustomerTab(); toast('✅ 订单已完成归档',true); }); });
}

function saveCustomer(){
  currentData.name=document.getElementById('ciName').value.trim();
  currentData.country=document.getElementById('ciCountry').value.trim();
  currentData.email=document.getElementById('ciEmail').value.trim();
  currentData.company=document.getElementById('ciCompany').value.trim();
  document.querySelectorAll('.order-body').forEach(function(b){
    var i=parseInt(b.querySelector('[data-idx]').getAttribute('data-idx')),o=currentData.orders[i];
    o.vehicleType=b.querySelector('.ordType')?b.querySelector('.ordType').value:'';
    o.brand=b.querySelector('.ordBrand')?b.querySelector('.ordBrand').value:'';
    o.qty=b.querySelector('.ordQty')?b.querySelector('.ordQty').value:'';
    o.color=b.querySelector('.ordColor')?b.querySelector('.ordColor').value:'';
    o.totalAmt=b.querySelector('.ordTotal')?b.querySelector('.ordTotal').value:'';
    o.orderNo=b.querySelector('.ordNo')?b.querySelector('.ordNo').value:'';
  });
  cache.customers[currentPhone]=currentData; saveCache(); syncToCRM(currentData); toast('✅ 已保存',true);
}
function newOrder(){ if(!currentData)return; currentData.orders.push({id:currentData.orders.length+1,requirements:[],docs:[],status:'active'}); saveCache(); renderCustomerTab(); }
function newFollow(){ if(!currentData)return; var t=prompt('跟进内容:'); if(!t)return; if(!currentData.followUps)currentData.followUps=[]; currentData.followUps.push({date:new Date().toISOString().split('T')[0],content:t}); saveCache(); renderCustomerTab(); }

// ====== PRODUCTS TAB ======
function renderProductsTab(){
  document.getElementById('content').innerHTML='<div style="text-align:center;color:#666;padding:40px">产品数据从CRM后台同步</div>';
}

// ====== TEMPLATES TAB ======
function renderTemplatesTab(){
  var h='<label>🌍 按国家筛选</label><select id="tplCountry"><option value="通用">通用</option></select><div id="tplList" style="margin-top:8px"></div>';
  document.getElementById('content').innerHTML=h;
  var tpls=cache.templates['通用']||[];
  var html=''; tpls.forEach(function(t){html+='<div class="card"><div class="card-title">'+esc(t.title)+' <span class="copy-btn" data-text="'+esc(t.text)+'">复制</span></div><div style="font-size:11px;color:#999">'+esc(t.text)+'</div></div>';});
  document.getElementById('tplList').innerHTML=html;
  document.querySelectorAll('.copy-btn').forEach(function(b){b.addEventListener('click',function(){navigator.clipboard.writeText(b.getAttribute('data-text'));toast('✅ 已复制',true);});});
}

function syncToCRM(data){ try{fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}catch(e){} }

function updateDashboard(){
  fetch(API+'/stats').then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(d){document.getElementById('dashChats').textContent=d.todayChats||0;document.getElementById('dashCustomers').textContent=d.totalCustomers||0;document.getElementById('dashPI').textContent=d.todayPis||0;document.getElementById('dashOrders').textContent=d.totalOrders||0;}
  }).catch(function(){});
}
