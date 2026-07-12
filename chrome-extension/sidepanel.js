// SINOCV CRM v4 — Full Order Tracking
const API = 'https://truck-export-pi-xi.vercel.app/api/crm';
let contacts=[], fltr='all', cur=null, scripts=[], sCat='all', sLang='en';

(async function init(){
  await loadScripts();
  await loadContacts();
  renderList();
  renderScriptCats();
  renderScripts();
})();

function switchTab(tab,el){
  document.querySelectorAll('.tab-row button').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-contacts').style.display=tab==='contacts'?'flex':'none';
  document.getElementById('tab-scripts').style.display=tab==='scripts'?'flex':'none';
}

// ========== CONTACTS ==========
async function loadContacts(){
  try{const r=await fetch(API+'?action=all');if(r.ok){const d=await r.json();contacts=d.contacts||[]}}catch(e){}
}
function setFltr(f,el){fltr=f;document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderList()}
function renderList(){
  const q=(document.getElementById('search')?.value||'').toLowerCase();
  let f=fltr==='all'?contacts:contacts.filter(c=>c.category===fltr);
  if(q)f=f.filter(c=>(c.name||''+c.phone||''+c.company||'').toLowerCase().includes(q));
  document.getElementById('list').innerHTML=f.map(c=>{
    const cls=c.category?'badge badge-'+c.category.toLowerCase():'badge badge-new';
    const dl=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
    const orders=c.orders||[];
    return `<div class="item" onclick="openDetail('${c.phone}')">
      <div class="n">${c.name||c.phone} <span class="${cls}">${c.category||'NEW'}</span>${dl!==null&&dl<=0?' ⚠️':''}</div>
      <div class="m">${c.phone||''} ${c.country?'· '+c.country:''} ${orders.length?'· 📦'+orders.length:''} ${dl!==null?'· '+dl+'d':''}</div>
    </div>`;
  }).join('')||'<div style="padding:16px;text-align:center;color:#999">No contacts</div>';
}

function openDetail(phone){
  cur=contacts.find(c=>c.phone===phone)||{phone,category:'C',orders:[]};
  if(!cur.orders)cur.orders=[];
  showDetail();
}

function showDetail(){
  const c=cur;
  document.getElementById('detTitle').textContent=c.name||c.phone||'New';
  document.getElementById('detCat').value=c.category||'';
  
  const dl=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
  let remHTML='';
  if(c.nextFollowUp){
    remHTML=`<div class="rem"><span class="nx">${dl<=0?'⚠️ Overdue!':`📅 ${c.nextFollowUp} (${dl}d)`}</span><button class="btn btn-y" style="padding:2px 6px;font-size:9px" onclick="markDone()">✅ Done</button></div>`;
  }

  const ordersHTML=(c.orders||[]).map((o,i)=>`
    <div class="card">
      <div class="card-hdr" onclick="toggleOrder(${i})">
        <span>📦 Order #${i+1} ${o.orderNo||''} <span class="tag tag-${o.status||'pending'}">${o.status||'pending'}</span></span>
        <span style="font-size:9px;color:#999">▼</span>
      </div>
      <div class="card-body" id="ordBody${i}">
        <label>Order No</label><input value="${o.orderNo||''}" id="ordNo${i}">
        <div class="row2"><div><label>Date</label><input type="date" value="${o.date||''}" id="ordDate${i}"></div><div><label>Status</label><select id="ordStatus${i}">${['pending','processing','shipped','delivered'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></div></div>
        <label>Requirements (model, qty, color)</label><textarea id="ordReq${i}" rows="2">${o.requirements||''}</textarea>
        
        <div class="sec">💵 Payment</div>
        <div class="row2"><div><label>Deposit Date</label><input type="date" value="${o.depositDate||''}" id="ordDep${i}"></div><div><label>Deposit Amount</label><input value="${o.depositAmt||''}" id="ordDepAmt${i}" placeholder="$"></div></div>
        <div class="row2"><div><label>Balance Date</label><input type="date" value="${o.balanceDate||''}" id="ordBal${i}"></div><div><label>Balance Amount</label><input value="${o.balanceAmt||''}" id="ordBalAmt${i}" placeholder="$"></div></div>
        
        <div class="sec">📄 PI Documents <button class="btn btn-y" style="padding:2px 6px;font-size:9px" onclick="addPI(${i})">+ PI</button></div>
        <div id="piList${i}">${(o.pis||[]).map((p,j)=>`<div class="pi-row"><span>${p.number}</span><span style="font-size:9px;color:#999">${p.date||''}</span><button style="color:#ef4444;background:none;border:none;cursor:pointer;font-size:10px" onclick="removePI(${i},'${p.number}')">✕</button></div>`).join('')}</div>
        <div style="display:flex;gap:4px;margin-top:3px"><input id="piNum${i}" placeholder="PI number" style="flex:1;font-size:10px;padding:3px 6px"><input type="date" id="piDate${i}" style="width:90px;font-size:10px;padding:3px 4px"></div>
        
        <div class="sec">🚢 Shipping</div>
        <div class="row2"><div><label>Ship Date</label><input type="date" value="${o.shipDate||''}" id="ordShip${i}"></div><div><label>ETA</label><input type="date" value="${o.eta||''}" id="ordEta${i}"></div></div>
        <div class="row2"><div><label>Vessel</label><input value="${o.vessel||''}" id="ordVessel${i}" placeholder="Vessel name"></div><div><label>Booking No</label><input value="${o.bookingNo||''}" id="ordBkN${i}"></div></div>
        
        <div class="sec">🔢 VIN Codes</div>
        <textarea id="ordVin${i}" rows="2" placeholder="One VIN per line">${(o.vins||[]).join('\n')}</textarea>
        
        <div style="display:flex;gap:6px;margin-top:6px"><button class="btn btn-r" style="flex:1" onclick="deleteOrder(${i})">🗑 Delete</button></div>
      </div>
    </div>
  `).join('');

  document.getElementById('detBody').innerHTML=remHTML+`
    <label>Category</label><select id="detCat2" onchange="onCatChange()">${['','A','B','C'].map(v=>`<option value="${v}" ${(c.category||'')===v?'selected':''}>${v||'C·New'}${v==='A'?'·10d':v==='B'?'·30d':v==='C'?'·60d':''}</option>`).join('')}</select>
    <div class="row2"><div><label>Phone</label><input id="detPhone" value="${c.phone||''}" readonly style="opacity:.5"></div><div><label>Name</label><input id="detName" value="${c.name||''}"></div></div>
    <div class="row2"><div><label>Email</label><input type="email" id="detEmail" value="${c.email||''}"></div><div><label>Country</label><input id="detCountry" value="${c.country||''}"></div></div>
    <div class="row2"><div><label>Company</label><input id="detCompany" value="${c.company||''}"></div><div><label>Product</label><select id="detProduct">${['','tractor','dump','mixer','trailer','machinery','mining','light'].map(v=>`<option value="${v}" ${(c.product||'')===v?'selected':''}>${v||'Select'}</option>`).join('')}</select></div></div>
    <label>Notes</label><textarea id="detNotes" rows="2">${c.notes||''}</textarea>
    <div class="sec">📦 Orders <button class="btn btn-y" style="padding:2px 6px;font-size:9px" onclick="addOrder()">+ New Order</button></div>
    <div id="ordersList">${ordersHTML}</div>
    <div style="display:flex;gap:6px;margin-top:10px"><button class="btn btn-y" style="flex:1" onclick="saveDetail()">💾 Save</button></div>
  `;

  // Sync secondary category select
  document.getElementById('detCat2').addEventListener('change',function(){document.getElementById('detCat').value=this.value;});
  document.getElementById('detail').classList.add('show');
}

function toggleOrder(i){
  const b=document.getElementById('ordBody'+i);
  b.classList.toggle('open');
}

function addOrder(){
  if(!cur.orders)cur.orders=[];
  cur.orders.push({status:'pending',pis:[],vins:[],date:new Date().toISOString().split('T')[0]});
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
  showDetail();
}

function removePI(oi,num){
  cur.orders[oi].pis=cur.orders[oi].pis.filter(p=>p.number!==num);
  showDetail();
}

async function saveDetail(){
  const c=cur;
  // Read all order fields
  (c.orders||[]).forEach((o,i)=>{
    o.orderNo=document.getElementById('ordNo'+i)?.value||o.orderNo||'';
    o.date=document.getElementById('ordDate'+i)?.value||o.date||'';
    o.status=document.getElementById('ordStatus'+i)?.value||o.status||'pending';
    o.requirements=document.getElementById('ordReq'+i)?.value||'';
    o.depositDate=document.getElementById('ordDep'+i)?.value||'';
    o.depositAmt=document.getElementById('ordDepAmt'+i)?.value||'';
    o.balanceDate=document.getElementById('ordBal'+i)?.value||'';
    o.balanceAmt=document.getElementById('ordBalAmt'+i)?.value||'';
    o.shipDate=document.getElementById('ordShip'+i)?.value||'';
    o.eta=document.getElementById('ordEta'+i)?.value||'';
    o.vessel=document.getElementById('ordVessel'+i)?.value||'';
    o.bookingNo=document.getElementById('ordBkN'+i)?.value||'';
    const vinText=document.getElementById('ordVin'+i)?.value||'';
    o.vins=vinText.split('\n').map(v=>v.trim()).filter(Boolean);
  });

  c.category=document.getElementById('detCat')?.value||c.category||'';
  c.phone=document.getElementById('detPhone')?.value||c.phone;
  c.name=document.getElementById('detName')?.value||'';
  c.email=document.getElementById('detEmail')?.value||'';
  c.country=document.getElementById('detCountry')?.value||'';
  c.company=document.getElementById('detCompany')?.value||'';
  c.product=document.getElementById('detProduct')?.value||'';
  c.notes=document.getElementById('detNotes')?.value||'';

  try{
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(c)});
    if(r.ok){const d=await r.json();cur=d.contact;await loadContacts();renderList();toast('✓ Saved');showDetail();}
  }catch(e){toast('Error',true)}
}

function onCatChange(){
  cur.category=document.getElementById('detCat')?.value||document.getElementById('detCat2')?.value||'';
  if(cur.category&&!cur.nextFollowUp){
    const days=cur.category==='A'?10:cur.category==='B'?30:60;
    const d=new Date();d.setDate(d.getDate()+days);
    cur.nextFollowUp=d.toISOString().split('T')[0];
  }
}

async function markDone(){
  const days=cur.category==='A'?10:cur.category==='B'?30:60;
  const d=new Date();d.setDate(d.getDate()+days);
  try{
    const r=await fetch(API.replace('/crm','')+'/crm/holidays/next?from='+d.toISOString().split('T')[0]);
    if(r.ok){const h=await r.json();if(h.nextWorkday)d.setTime(Date.parse(h.nextWorkday));}
  }catch(e){}
  cur.nextFollowUp=d.toISOString().split('T')[0];
  await saveDetail();
}

function closeDetail(){document.getElementById('detail').classList.remove('show');cur=null;}

// ========== SCRIPTS ==========
async function loadScripts(){
  try{
    const r=await fetch(chrome.runtime.getURL('scripts.json'));
    if(r.ok){scripts=await r.json();saveScripts();return}
  }catch(e){}
  const raw=localStorage.getItem('sinocv_scripts_v2');
  if(raw){scripts=JSON.parse(raw);return}
  scripts=[{id:'1',cat:'General',title:'Greeting',en:'Hello sir, this is Li from China.',fr:'Bonjour monsieur, je suis Li de Chine.',ar:'مرحباً سيدي، أنا لي من الصين.'}];
  saveScripts();
}
function saveScripts(){localStorage.setItem('sinocv_scripts_v2',JSON.stringify(scripts))}

function setLang(l,el){
  sLang=l;document.querySelectorAll('.lang-bar button').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderScripts();
}
function renderScriptCats(){
  const cats=new Set(scripts.map(s=>s.cat));
  document.getElementById('scriptCats').innerHTML=['all',...cats].slice(0,20).map(c=>`<button class="cats-btn${sCat===c?' active':''}" onclick="fltrScript('${c}',this)">${c}</button>`).join('');
}
function fltrScript(c,el){sCat=c;renderScriptCats();renderScripts()}
function renderScripts(){
  const q=(document.getElementById('scriptSearch')?.value||'').toLowerCase();
  let f=sCat==='all'?scripts:scripts.filter(s=>s.cat===sCat);
  if(q)f=f.filter(s=>(s.title+(s[sLang]||'')).toLowerCase().includes(q));
  document.getElementById('scriptList').innerHTML=f.map(s=>`
    <div class="scard" onclick="useScript('${s.id}')" style="border-left:3px solid ${sLang==='en'?'#2563eb':sLang==='fr'?'#dc2626':'#16a34a'}">
      <div class="t">${s.title||(s[sLang]||'').slice(0,25)}</div>
      <div class="p">${(s[sLang]||s.en||'').slice(0,60)}</div>
    </div>
  `).join('')||'<div style="padding:16px;text-align:center;color:#999">No scripts</div>';
}

function useScript(id){
  const s=scripts.find(sc=>sc.id===id);if(!s)return;
  const text=s[sLang]||s.en||'';
  chrome.tabs.query({url:'*://web.whatsapp.com/*'},tabs=>{
    if(tabs.length>0){
      chrome.tabs.sendMessage(tabs[0].id,{type:'insertScript',text},resp=>{
        if(resp?.ok){toast('✅ #'+id);document.getElementById('scriptInfo').textContent='#'+id+' ✓'}
        else toast('Error',true)
      });
    }else{navigator.clipboard.writeText(text).then(()=>toast('📋 #'+id))}
  });
}

function jumpToScript(){
  const num=document.getElementById('scriptNum').value.trim();if(!num)return;
  const s=scripts.find(sc=>sc.id===num);
  if(s)useScript(s.id);else toast('Not found: #'+num,true);
}

function toast(msg,err){
  const t=document.createElement('div');t.className='toast';
  t.textContent=msg;t.style.background=err?'#dc2626':'#059669';
  document.body.appendChild(t);setTimeout(()=>t.remove(),2000);
}
