// SINOCV CRM v5 — Structured Order + L/C + Timeline + Dashboard
const API = 'https://truck-export-pi-xi.vercel.app/api/crm';
let contacts=[], fltr='all', cur=null, scripts=[], sCat='all', sLang='en';
let currentUser='', isAdmin=false;
const USERS = ['Li Shanlong', '王小涵', '毛振威', '赵欢乐', '杜飞跃'];
// PINs — stored in localStorage so users can change their own
function getPins(){try{return JSON.parse(localStorage.getItem('sinocv_pins')||'{}')}catch(e){return{}}}
function savePins(p){localStorage.setItem('sinocv_pins',JSON.stringify(p))}
const defaultPins={'Li Shanlong':'1234','13001977959':'202502','Sales 1':'1111','Sales 2':'2222','Sales 3':'3333','Sales 4':'4444'};
function PINS(){const saved=getPins();return{...defaultPins,...saved}}

function doLogin(){
  const user=document.getElementById('loginUser').value;
  const pin=document.getElementById('loginPin').value;
  const err=document.getElementById('loginError');
  if(!user||!pin){err.textContent='Select user and enter PIN';err.style.display='block';return}
  if(PINS()[user]!==pin){err.textContent='Wrong PIN';err.style.display='block';return}
  currentUser=user;isAdmin=user==='Li Shanlong'||user==='13001977959';
  localStorage.setItem('sinocv_user',user);
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('mainApp').style.display='flex';
  renderUserSelect();
  loadScripts().then(()=>{loadContacts().then(()=>{renderDashboard();renderList();renderScriptCats();renderScripts()})});
  setInterval(async()=>{await loadContacts();renderDashboard();renderList()},20000);
}

(async function init(){
  // Check if already logged in (stored PIN session)
  const saved=localStorage.getItem('sinocv_user');
  if(saved&&PINS()[saved]){
    // Auto-login with saved user (PIN already verified)
    currentUser=saved;isAdmin=saved==='Li Shanlong'||saved==='13001977959';
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('mainApp').style.display='flex';
    renderUserSelect();
    await loadScripts();
    await loadContacts();
    renderDashboard();renderList();renderScriptCats();renderScripts();
    setInterval(async()=>{await loadContacts();renderDashboard();renderList()},20000);
  }
})();

function setUser(){
  currentUser = document.getElementById('curUser').value;
  localStorage.setItem('sinocv_user', currentUser);
  isAdmin = currentUser === 'Li Shanlong';
  document.getElementById('curUser').style.background='';
  loadContacts().then(()=>{renderDashboard();renderList()});
}

function renderUserSelect(){
  const sel = document.getElementById('curUser');
  sel.innerHTML = USERS.map(u => `<option value="${u}" ${currentUser===u?'selected':''}>${u==='Li Shanlong'?'👑 ':''}${u}</option>`).join('');
}

// Filter contacts by current user
function myContacts(){
  if(isAdmin) return contacts;
  return contacts.filter(c => !c.owner || c.owner === currentUser);
}

function switchTab(tab,el){
  document.querySelectorAll('.tab-row button').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-contacts').style.display=tab==='contacts'?'flex':'none';
  document.getElementById('tab-scripts').style.display=tab==='scripts'?'flex':'none';
  document.getElementById('tab-dash').style.display=tab==='dash'?'flex':'none';
}

// ===== DASHBOARD =====
function renderDashboard(){
  const mc=myContacts();
  const orders=mc.flatMap(c=>(c.orders||[]).map(o=>({...o,name:c.name||c.phone,phone:c.phone,owner:c.owner})));
  const total=mc.length;
  const a=mc.filter(c=>c.category==='A').length;
  const b=mc.filter(c=>c.category==='B').length;
  const c=mc.filter(c=>c.category==='C').length;
  const totalOrders=orders.length;
  const pendingOrders=orders.filter(o=>o.status==='pending'||o.status==='processing').length;
  const shippedOrders=orders.filter(o=>o.status==='shipped').length;
  const pis=orders.flatMap(o=>o.pis||[]).length;
  const lcs=orders.filter(o=>o.paymentMethod==='LC').length;
  const overdue=mc.filter(c=>c.nextFollowUp&&c.nextFollowUp<=new Date().toISOString().split('T')[0]).length;

  // Country distribution
  const now=new Date();
  const weekAgo=new Date(now-7*86400000);
  const yearStart=new Date(now.getFullYear(),0,1);
  const monthStart=new Date(now.getFullYear(),now.getMonth(),1);

  function countryPct(list,label){
    const map={};
    list.forEach(c=>{const co=c.country||'Unknown';map[co]=(map[co]||0)+1});
    const sorted=Object.entries(map).sort((a,b)=>b[1]-a[1]);
    const total=list.length||1;
    return {label,sorted,total};
  }

  const allCt=countryPct(mc,'All Time');
  const wkCt=countryPct(mc.filter(c=>c.firstSeen>=weekAgo.toISOString()),'This Week');
  const moCt=countryPct(mc.filter(c=>c.firstSeen>=monthStart.toISOString()),'This Month');
  const yrCt=countryPct(mc.filter(c=>c.firstSeen>=yearStart.toISOString()),'This Year');

  function barChart(data){return data.sorted.slice(0,8).map(([co,n])=>`<div style="display:flex;align-items:center;gap:4px;margin:2px 0;font-size:9px"><span style="width:60px;text-align:right;color:#888">${co}</span><div style="flex:1;background:#f0f0f0;border-radius:2px;height:12px"><div style="width:${Math.max((n/data.total)*100,1)}%;background:#f59e0b;border-radius:2px;height:100%"></div></div><span style="width:32px;font-weight:600">${Math.round((n/data.total)*100)}%</span></div>`).join('')}

  const countryHTML=`<div style="padding:6px 10px">
    <div style="font-size:10px;font-weight:600;margin-bottom:4px;display:flex;gap:8px">
      <span style="cursor:pointer;color:#f59e0b;border-bottom:2px solid #f59e0b" id="ctTabAll" onclick="switchCtTab('all')">All</span>
      <span style="cursor:pointer" id="ctTabWeek" onclick="switchCtTab('week')">Week</span>
      <span style="cursor:pointer" id="ctTabMonth" onclick="switchCtTab('month')">Month</span>
      <span style="cursor:pointer" id="ctTabYear" onclick="switchCtTab('year')">Year</span>
    </div>
    <div id="ctChart">${barChart(allCt)}</div>
  </div>`;

  // Store chart data for tab switching
  window._ctData={all:allCt,week:wkCt,month:moCt,year:yrCt};

  // Daily per-salesperson stats
  const now2=new Date();const today2=now2.toISOString().split('T')[0];
  const wkStart=new Date(now2);wkStart.setDate(now2.getDate()-now2.getDay());const weekStart=wkStart.toISOString().split('T')[0];
  const moStart=new Date(now2.getFullYear(),now2.getMonth(),1).toISOString().split('T')[0];
  function statsFor(owner){const cs=mc.filter(c=>c.owner===owner);return{owner,today:cs.filter(c=>c.firstSeen?.startsWith(today2)).length,week:cs.filter(c=>c.firstSeen>=weekStart).length,month:cs.filter(c=>c.firstSeen>=moStart).length,piToday:cs.flatMap(c=>(c.orders||[]).flatMap(o=>(o.pis||[]).filter(p=>p.date===today2))).length,piWeek:cs.flatMap(c=>(c.orders||[]).flatMap(o=>(o.pis||[]).filter(p=>p.date>=weekStart))).length,piMonth:cs.flatMap(c=>(c.orders||[]).flatMap(o=>(o.pis||[]).filter(p=>p.date>=moStart))).length}}
  const owners=[...new Set(mc.map(c=>c.owner||'Unassigned'))].sort();
  const dailyRows=owners.map(o=>statsFor(o));
  const dailyHTML=`<table style="width:100%;font-size:9px;border-collapse:collapse;margin:6px 0"><tr style="color:#888;text-align:center"><th style="text-align:left">Salesperson</th><th>Today</th><th>PI</th><th>Week</th><th>PI</th><th>Month</th><th>PI</th></tr>${dailyRows.map(r=>`<tr style="text-align:center;border-top:1px solid #f0f0f0"><td style="text-align:left;font-weight:600">${r.owner}</td><td>${r.today}</td><td style="color:#f59e0b">${r.piToday}</td><td>${r.week}</td><td style="color:#f59e0b">${r.piWeek}</td><td>${r.month}</td><td style="color:#f59e0b">${r.piMonth}</td></tr>`).join('')}</table>`;

  document.getElementById('dashContent').innerHTML=`
      <div class="dash-card"><div class="dash-num">${total}</div><div class="dash-lbl">Contacts</div></div>
      <div class="dash-card"><div class="dash-num">${a}</div><div class="dash-lbl" style="color:#7c3aed">A-Class</div></div>
      <div class="dash-card"><div class="dash-num">${b}</div><div class="dash-lbl" style="color:#2563eb">B-Class</div></div>
      <div class="dash-card"><div class="dash-num">${c}</div><div class="dash-lbl" style="color:#6b7280">C-Class</div></div>
      <div class="dash-card"><div class="dash-num">${totalOrders}</div><div class="dash-lbl">Orders</div></div>
      <div class="dash-card"><div class="dash-num">${pendingOrders}</div><div class="dash-lbl" style="color:#d97706">In Progress</div></div>
      <div class="dash-card"><div class="dash-num">${shippedOrders}</div><div class="dash-lbl" style="color:#059669">Shipped</div></div>
      <div class="dash-card"><div class="dash-num">${pis}</div><div class="dash-lbl">PIs</div></div>
      <div class="dash-card"><div class="dash-num">${lcs}</div><div class="dash-lbl">L/Cs</div></div>
      <div class="dash-card"><div class="dash-num" style="color:#ef4444">${overdue}</div><div class="dash-lbl">⚠️ Overdue</div></div>
    </div>
    <div class="sec" style="margin:0 10px">🌍 By Country (${total} total)</div>
    ${countryHTML}
    <div class="sec" style="margin:0 10px">📊 Daily Performance</div>
    <div style="padding:0 10px">${dailyHTML}</div>
    <div class="sec" style="margin:0 10px">🚢 Active Shipments</div>
    <div style="padding:0 10px">${orders.filter(o=>o.status==='shipped').slice(0,5).map(o=>`
      <div class="item" onclick="navigator.clipboard.writeText('${o.vins?.[0]||''}')">
        <div class="n">${o.name} · ${o.orderNo||'#'}</div>
        <div class="m">${o.vessel||''} · ETA ${o.eta||'?'} · ${(o.vins||[]).length} VINs</div>
      </div>
    `).join('')||'<div style="padding:8px;color:#999">No active shipments</div>'}</div>
  `;
}

function switchCtTab(tab){
  const data=window._ctData[tab];
  if(!data)return;
  document.getElementById('ctChart').innerHTML=barChartLocal(data);
  ['all','week','month','year'].forEach(t=>{
    const el=document.getElementById('ctTab'+t.charAt(0).toUpperCase()+t.slice(1));
    if(el)el.style.cssText=t===tab?'cursor:pointer;color:#f59e0b;border-bottom:2px solid #f59e0b':'cursor:pointer';
  });
}
function barChartLocal(data){return data.sorted.slice(0,8).map(([co,n])=>`<div style="display:flex;align-items:center;gap:4px;margin:2px 0;font-size:9px"><span style="width:60px;text-align:right;color:#888">${co}</span><div style="flex:1;background:#f0f0f0;border-radius:2px;height:12px"><div style="width:${Math.max((n/data.total)*100,1)}%;background:#f59e0b;border-radius:2px;height:100%"></div></div><span style="width:32px;font-weight:600">${Math.round((n/data.total)*100)}%</span></div>`).join('')}

// ===== CONTACTS =====
async function loadContacts(){
  try{const r=await fetch(API+'?action=all');if(r.ok){const d=await r.json();contacts=d.contacts||[]}}catch(e){}
}
function setFltr(f,el){fltr=f;document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderList()}
function renderList(){
  const q=(document.getElementById('search')?.value||'').toLowerCase();
  const mc=myContacts();
  let f=fltr==='all'?mc:mc.filter(c=>c.category===fltr);
  if(q)f=f.filter(c=>(c.name||''+c.phone||''+c.company||'').toLowerCase().includes(q));
  document.getElementById('list').innerHTML=f.map(c=>{
    const cls=c.category?'badge badge-'+c.category.toLowerCase():'badge badge-new';
    const dl=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
    const orders=c.orders||[];
    return `<div class="item" onclick="openDetail('${c.phone}')">
      <div class="n">${c.name||c.phone} <span class="${cls}">${c.category||'NEW'}</span>${dl!==null&&dl<=0?' ⚠️':''} ${c.owner&&isAdmin?'·'+c.owner:''}</div>
      <div class="m">${c.phone||''} ${c.country?'· '+c.country:''} ${orders.length?'· 📦'+orders.length:''} ${dl!==null?'· '+dl+'d':''}</div>
    </div>`;
  }).join('')||'<div style="padding:16px;text-align:center;color:#999">No contacts</div>';
}

function openDetail(phone){
  cur=contacts.find(c=>c.phone===phone)||{phone,category:'C',orders:[],timeline:[]};
  if(!cur.orders)cur.orders=[];
  if(!cur.timeline)cur.timeline=[];
  // Auto-detect country + set owner (first-come)
  if(!cur.country&&cur.phone)cur.country=detectCountry(cur.phone);
  if(!cur.owner&&currentUser)cur.owner=currentUser;
  // If someone else owns this contact, flag it
  if(cur.owner&&cur.owner!==currentUser&&isAdmin){
    document.getElementById('detTitle').textContent=(cur.name||cur.phone)+' ⚠️ Owned by '+cur.owner;
  }
  showDetail();
}

function detectCountry(phone){
  const codes={'213':'Algeria','216':'Tunisia','212':'Morocco','20':'Egypt','234':'Nigeria','254':'Kenya','255':'Tanzania','233':'Ghana','221':'Senegal','225':'Côte d\'Ivoire','237':'Cameroon','971':'UAE','966':'Saudi Arabia','964':'Iraq','962':'Jordan','965':'Kuwait','974':'Qatar','973':'Bahrain','968':'Oman','967':'Yemen','84':'Vietnam','63':'Philippines','62':'Indonesia','95':'Myanmar','856':'Laos','855':'Cambodia','66':'Thailand','60':'Malaysia','65':'Singapore','86':'China','33':'France','49':'Germany','7':'Russia','1':'USA/Canada','44':'UK','39':'Italy','34':'Spain'};
  const clean=phone.replace(/[^0-9]/g,'');
  for(const[k,v]of Object.entries(codes))if(clean.startsWith(k))return v;
  return '';
}

function showDetail(){
  const c=cur;
  document.getElementById('detTitle').textContent=c.name||c.phone||'New';
  document.getElementById('detCat').value=c.category||'';
  
  // Timeline
  const tl=(c.timeline||[]).slice(-10).reverse().map(t=>`<div style="font-size:9px;padding:2px 0;color:#888">${t.date?.slice(0,10)} · ${t.event}</div>`).join('');

  const dl=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
  let remHTML='';
  if(c.nextFollowUp)remHTML=`<div class="rem"><span class="nx">${dl<=0?'⚠️ Overdue!':`📅 ${c.nextFollowUp} (${dl}d)`}</span><button class="btn btn-y" style="padding:2px 6px;font-size:9px" onclick="markDone()">✅ Done</button></div>`;

  // Orders
  const ordersHTML=(c.orders||[]).map((o,i)=>renderOrderCard(o,i)).join('');

  document.getElementById('detBody').innerHTML=remHTML+`
    <div class="row2"><div><label>Phone</label><input id="detPhone" value="${c.phone||''}" readonly style="opacity:.5"></div><div><label>Name</label><input id="detName" value="${c.name||''}"></div></div>
    <div class="row2"><div><label>Owner</label><select id="detOwner">${USERS.map(u=>`<option value="${u}" ${(c.owner||'')===u?'selected':''}>${u}</option>`).join('')}</select></div><div><label>Country</label><select id="detCountry">${['',...countryList()].map(v=>`<option value="${v}" ${(c.country||'')===v?'selected':''}>${v||'Auto'}</option>`).join('')}</select></div></div>
    <div class="row2"><div><label>Email</label><input type="email" id="detEmail" value="${c.email||''}"></div><div><label>Company</label><input id="detCompany" value="${c.company||''}"></div></div>
    <div class="row2"><div><label>Product</label><select id="detProduct">${['','tractor','dump','mixer','trailer','machinery','mining','light'].map(v=>`<option value="${v}" ${(c.product||'')===v?'selected':''}>${v||'Select'}</option>`).join('')}</select></div></div>
    <label>Notes</label><textarea id="detNotes" rows="2">${c.notes||''}</textarea>
    
    <div class="sec" style="margin-top:10px">🕐 Timeline</div>
    <div style="max-height:80px;overflow-y:auto;padding:4px 0">${tl||'<div style="font-size:9px;color:#999">No events yet</div>'}</div>
    
    <div class="sec">📦 Orders <button class="btn btn-y" style="padding:2px 6px;font-size:9px" onclick="addOrder()">+ New</button></div>
    <div id="ordersList">${ordersHTML}</div>
    <div style="display:flex;gap:6px;margin-top:10px"><button class="btn btn-y" style="flex:1" onclick="saveDetail()">💾 Save</button></div>
  `;
  document.getElementById('detail').classList.add('show');
}

function countryList(){
  return ['Algeria','Tunisia','Morocco','Egypt','Nigeria','Kenya','Tanzania','Ghana','Senegal','Côte d\'Ivoire','Cameroon','UAE','Saudi Arabia','Iraq','Jordan','Kuwait','Qatar','Vietnam','Philippines','Indonesia','Myanmar','France','UK','USA','Russia'];
}

function renderOrderCard(o,i){
  const pm=o.paymentMethod||'TT';
  const cur=o.currency||'USD';
  return `<div class="card">
    <div class="card-hdr" onclick="toggleOrder(${i})">
      <span>📦 Order #${i+1} ${o.orderNo||''} <span class="tag tag-${o.status||'pending'}">${o.status||'pending'}</span></span>
      <span style="font-size:9px;color:#999">▼</span>
    </div>
    <div class="card-body" id="ordBody${i}">
      <!-- 1. 报价 -->
      <div class="sec">💰 Quotation</div>
      <div class="row2"><div><label>Order No</label><input value="${o.orderNo||''}" id="ordNo${i}"></div><div><label>Date</label><input type="date" value="${o.date||''}" id="ordDate${i}"></div></div>
      <label>Requirements (model, qty, color)</label><textarea id="ordReq${i}" rows="2">${o.requirements||''}</textarea>
      <div class="row2"><div><label>Total Amount</label><input value="${o.totalAmt||''}" id="ordAmt${i}" placeholder="$"></div><div><label>Currency</label><select id="ordCur${i}">${['USD','EUR','CNY'].map(v=>`<option value="${v}" ${cur===v?'selected':''}>${v}</option>`).join('')}</select></div></div>

      <!-- 2. 付款方式 -->
      <div class="sec">💵 Payment</div>
      <div><label>Method</label><select id="ordPM${i}" onchange="toggleLCFields(${i},this.value)">${['TT','LC'].map(v=>`<option value="${v}" ${pm===v?'selected':''}>${v==='TT'?'T/T (电汇)':'L/C (信用证)'}</option>`).join('')}</select></div>
      <div class="row2" style="margin-top:4px"><div><label>Deposit Date</label><input type="date" value="${o.depositDate||''}" id="ordDep${i}"></div><div><label>Deposit Amount</label><input value="${o.depositAmt||''}" id="ordDepAmt${i}" placeholder="$"></div></div>
      <div class="row2"><div><label>Balance Date</label><input type="date" value="${o.balanceDate||''}" id="ordBal${i}"></div><div><label>Balance Amount</label><input value="${o.balanceAmt||''}" id="ordBalAmt${i}" placeholder="$"></div></div>

      <!-- 3. 信用证 -->
      <div id="lcBlock${i}" style="display:${pm==='LC'?'block':'none'}">
        <div class="sec">🏦 L/C (信用证)</div>
        <div class="row2"><div><label>L/C Opening Date</label><input type="date" value="${o.lcOpenDate||''}" id="ordLcOpen${i}"></div><div><label>L/C Amount</label><input value="${o.lcAmt||''}" id="ordLcAmt${i}" placeholder="$"></div></div>
        <div class="row2"><div><label>Latest Ship Date</label><input type="date" value="${o.lcShipDate||''}" id="ordLcShip${i}"></div><div><label>Latest Departure</label><input type="date" value="${o.lcDepartDate||''}" id="ordLcDepart${i}"></div></div>
        <label>Docs Presented Date</label><input type="date" value="${o.docsDate||''}" id="ordDocs${i}">
        <div class="row2"><div><label>Payment Received</label><input type="date" value="${o.lcPayDate||''}" id="ordLcPay${i}"></div><div><label>Amount</label><input value="${o.lcPayAmt||''}" id="ordLcPayAmt${i}" placeholder="$"></div></div>
        <label>L/C Note</label><input value="${o.lcNote||''}" id="ordLcNote${i}" placeholder="After docs presentation...">
      </div>

      <!-- 4. 传的信息 -->
      <div class="sec">📄 PI & Docs</div>
      <label>PI Sent Date</label><input type="date" value="${o.piSentDate||''}" id="ordPiSent${i}">
      <div style="margin-top:4px"><span style="font-size:10px;color:#888">PI List</span> <button class="btn btn-y" style="padding:1px 5px;font-size:9px" onclick="addPI(${i})">+</button></div>
      <div id="piList${i}">${(o.pis||[]).map((p,j)=>`<div class="pi-row"><span>${p.number}</span><span style="font-size:9px;color:#999">${p.date||''}</span><button style="color:#ef4444;background:none;border:none;cursor:pointer;font-size:10px" onclick="removePI(${i},'${p.number}')">✕</button></div>`).join('')}</div>
      <div style="display:flex;gap:4px;margin-top:3px"><input id="piNum${i}" placeholder="PI number" style="flex:1;font-size:10px;padding:3px 6px"><input type="date" id="piDate${i}" style="width:90px;font-size:10px;padding:3px 4px"></div>

      <!-- 5. Shipping -->
      <div class="sec">🚢 Shipping</div>
      <div><label>Status</label><select id="ordStatus${i}">${['pending','processing','shipped','delivered'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="row2" style="margin-top:4px"><div><label>Ship Date</label><input type="date" value="${o.shipDate||''}" id="ordShip${i}"></div><div><label>ETA</label><input type="date" value="${o.eta||''}" id="ordEta${i}"></div></div>
      <div class="row2"><div><label>Vessel</label><input value="${o.vessel||''}" id="ordVessel${i}"></div><div><label>Booking No</label><input value="${o.bookingNo||''}" id="ordBkN${i}"></div></div>
      
      <label>VIN Codes</label><textarea id="ordVin${i}" rows="2" placeholder="One VIN per line">${(o.vins||[]).join('\n')}</textarea>
      
      <div style="display:flex;gap:4px;margin-top:6px"><button class="btn btn-r" style="flex:1;font-size:9px" onclick="deleteOrder(${i})">🗑</button></div>
    </div>
  </div>`;
}

function toggleLCFields(i,method){
  document.getElementById('lcBlock'+i).style.display=method==='LC'?'block':'none';
}

function toggleOrder(i){
  document.getElementById('ordBody'+i).classList.toggle('open');
}

function addOrder(){
  if(!cur.orders)cur.orders=[];
  cur.orders.push({status:'pending',pis:[],vins:[],date:new Date().toISOString().split('T')[0],paymentMethod:'TT',currency:'USD'});
  addTimeline('New order created');
  showDetail();
}

function deleteOrder(i){
  if(!confirm('Delete this order?'))return;
  cur.orders.splice(i,1);
  showDetail();
}

function addPI(oi){
  const n=document.getElementById('piNum'+oi)?.value.trim();
  const d=document.getElementById('piDate'+oi)?.value;
  if(!n)return;
  if(!cur.orders[oi].pis)cur.orders[oi].pis=[];
  cur.orders[oi].pis.push({number:n,date:d});
  addTimeline('PI '+n+' created');
  showDetail();
}

function removePI(oi,num){
  cur.orders[oi].pis=cur.orders[oi].pis.filter(p=>p.number!==num);
  showDetail();
}

function addTimeline(event){
  if(!cur.timeline)cur.timeline=[];
  cur.timeline.push({date:new Date().toISOString(),event});
}

async function saveDetail(){
  const c=cur;
  (c.orders||[]).forEach((o,i)=>{
    o.orderNo=el('ordNo'+i)||o.orderNo;o.date=el('ordDate'+i)||o.date;
    o.status=el('ordStatus'+i)||o.status;o.requirements=el('ordReq'+i)||'';
    o.totalAmt=el('ordAmt'+i)||'';o.currency=el('ordCur'+i)||'USD';
    o.paymentMethod=el('ordPM'+i)||'TT';
    o.depositDate=el('ordDep'+i)||'';o.depositAmt=el('ordDepAmt'+i)||'';
    o.balanceDate=el('ordBal'+i)||'';o.balanceAmt=el('ordBalAmt'+i)||'';
    o.lcOpenDate=el('ordLcOpen'+i)||'';o.lcAmt=el('ordLcAmt'+i)||'';
    o.lcShipDate=el('ordLcShip'+i)||'';o.lcDepartDate=el('ordLcDepart'+i)||'';
    o.docsDate=el('ordDocs'+i)||'';o.lcPayDate=el('ordLcPay'+i)||'';o.lcPayAmt=el('ordLcPayAmt'+i)||'';
    o.lcNote=el('ordLcNote'+i)||'';
    o.piSentDate=el('ordPiSent'+i)||'';
    o.shipDate=el('ordShip'+i)||'';o.eta=el('ordEta'+i)||'';
    o.vessel=el('ordVessel'+i)||'';o.bookingNo=el('ordBkN'+i)||'';
    o.vins=(el('ordVin'+i)||'').split('\n').map(v=>v.trim()).filter(Boolean);
  });
  c.category=el('detCat');c.name=el('detName');c.email=el('detEmail');
  c.owner=el('detOwner')||c.owner;c.country=el('detCountry')||detectCountry(c.phone);c.company=el('detCompany');
  c.product=el('detProduct');c.notes=el('detNotes');
  try{
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)});
    if(r.ok){const d=await r.json();cur=d.contact;await loadContacts();renderList();renderDashboard();toast('✓ Saved');showDetail();}
  }catch(e){toast('Error',true)}
}

function el(id){return document.getElementById(id)?.value||''}
function onCatChange(){cur.category=document.getElementById('detCat')?.value;if(cur.category&&!cur.nextFollowUp){const days=cur.category==='A'?10:cur.category==='B'?30:60;const d=new Date();d.setDate(d.getDate()+days);cur.nextFollowUp=d.toISOString().split('T')[0]}}
async function markDone(){const days=cur.category==='A'?10:cur.category==='B'?30:60;const d=new Date();d.setDate(d.getDate()+days);try{const r=await fetch(API.replace('/crm','')+'/crm/holidays/next?from='+d.toISOString().split('T')[0]);if(r.ok){const h=await r.json();if(h.nextWorkday)d.setTime(Date.parse(h.nextWorkday))}}catch(e){}cur.nextFollowUp=d.toISOString().split('T')[0];addTimeline('Follow-up done → next '+cur.nextFollowUp);await saveDetail()}
function closeDetail(){document.getElementById('detail').classList.remove('show');cur=null;}

function showPinChange(){
  document.getElementById('pinDialog').style.display='flex';
  document.getElementById('oldPin').value='';
  document.getElementById('newPin').value='';
  document.getElementById('pinMsg').style.display='none';
}
function changePin(){
  const old=document.getElementById('oldPin').value.trim();
  const neu=document.getElementById('newPin').value.trim();
  const msg=document.getElementById('pinMsg');
  if(!old||!neu||neu.length<4){msg.textContent='New PIN must be 4-6 digits';msg.style.display='block';return}
  if(PINS()[currentUser]!==old){msg.textContent='Current PIN is wrong';msg.style.display='block';return}
  const pins=getPins();pins[currentUser]=neu;savePins(pins);
  document.getElementById('pinDialog').style.display='none';
  toast('✅ PIN changed');
}

// ===== SCRIPTS =====
async function loadScripts(){
  try{const r=await fetch(chrome.runtime.getURL('scripts.json'));if(r.ok){scripts=await r.json();saveScripts();return}}catch(e){}
  const raw=localStorage.getItem('sinocv_scripts_v2');if(raw){scripts=JSON.parse(raw);return}
  scripts=[{id:'1',cat:'General',title:'Greeting',en:'Hello sir, this is Li from China.',fr:'Bonjour monsieur, je suis Li de Chine.',ar:'مرحباً سيدي، أنا لي من الصين.'}];saveScripts()
}
function saveScripts(){localStorage.setItem('sinocv_scripts_v2',JSON.stringify(scripts))}
function setLang(l,el){sLang=l;document.querySelectorAll('.lang-bar button').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderScripts()}
function renderScriptCats(){const cats=new Set(scripts.map(s=>s.cat));document.getElementById('scriptCats').innerHTML=['all',...cats].slice(0,20).map(c=>`<button class="cats-btn${sCat===c?' active':''}" onclick="fltrScript('${c}')">${c}</button>`).join('')}
function fltrScript(c){sCat=c;renderScriptCats();renderScripts()}
function renderScripts(){const q=(document.getElementById('scriptSearch')?.value||'').toLowerCase();let f=sCat==='all'?scripts:scripts.filter(s=>s.cat===sCat);if(q)f=f.filter(s=>(s.title+(s[sLang]||'')).toLowerCase().includes(q));document.getElementById('scriptList').innerHTML=f.map(s=>`<div class="scard" onclick="useScript('${s.id}')" style="border-left:3px solid ${sLang==='en'?'#2563eb':sLang==='fr'?'#dc2626':'#16a34a'}"><div class="t">${s.title||(s[sLang]||'').slice(0,25)}</div><div class="p">${(s[sLang]||s.en||'').slice(0,60)}</div></div>`).join('')||'<div style="padding:16px;text-align:center;color:#999">No scripts</div>'}
function useScript(id){const s=scripts.find(sc=>sc.id===id);if(!s)return;const text=s[sLang]||s.en||'';chrome.tabs.query({url:'*://web.whatsapp.com/*'},tabs=>{if(tabs.length>0){chrome.tabs.sendMessage(tabs[0].id,{type:'insertScript',text},resp=>{if(resp?.ok){toast('✅ #'+id);document.getElementById('scriptInfo').textContent='#'+id+' ✓'}else toast('Error',true)})}else{navigator.clipboard.writeText(text).then(()=>toast('📋 #'+id))}})}
function jumpToScript(){const num=document.getElementById('scriptNum').value.trim();if(!num)return;const s=scripts.find(sc=>sc.id===num);if(s)useScript(s.id);else toast('Not found: #'+num,true)}
function toast(msg,err){const t=document.createElement('div');t.className='toast';t.textContent=msg;t.style.background=err?'#dc2626':'#059669';document.body.appendChild(t);setTimeout(()=>t.remove(),2000)}

// Excel Export — admin gets all, sales get own
function exportAll(){
  const mc=myContacts();
  let csv='Owner,Name,Phone,Country,Category,Order#,Status,Requirements,Total,Currency,Payment,Deposit,Balance,Vessel,ETA,VINs\n';
  mc.forEach(c=>{(c.orders||[]).forEach(o=>{
    csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},${o.orderNo||''},${o.status||''},${(o.requirements||'').replace(/,/g,' ')},${o.totalAmt||''},${o.currency||''},${o.paymentMethod||''},${o.depositAmt||''},${o.balanceAmt||''},${o.vessel||''},${o.eta||''},${(o.vins||[]).join(';')}\n`;
  })});
  if(!mc.some(c=>(c.orders||[]).length>0)){
    mc.forEach(c=>{csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},,,,\n`;});
  }
  download('sinocv_export.csv','\uFEFF'+csv);
  toast('✓ Exported '+mc.length+' contacts');
}
function download(filename,text){const b=new Blob([text],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=filename;a.click();URL.revokeObjectURL(a.href)}
