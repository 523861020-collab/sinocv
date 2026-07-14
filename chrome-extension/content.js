// CRM Panel injected directly into WhatsApp Web page
(function(){
  if(document.getElementById('crm-panel-root')) return; // already injected
  
  var panel = document.createElement('div');
  panel.id = 'crm-panel-root';
  panel.innerHTML = `
    <div id="crm-panel" style="position:fixed;top:0;right:0;width:360px;height:100vh;background:#0a0a0a;color:#ccc;z-index:99999;font-family:-apple-system,sans-serif;font-size:13px;display:none;flex-direction:column;box-shadow:-4px 0 20px rgba(0,0,0,.5)">
      <div style="padding:10px 12px;border-bottom:1px solid #1a1a1a;display:flex;align-items:center;gap:8px">
        <span style="color:#f59e0b;font-weight:700">🚛 SINOCV CRM</span>
        <span id="crm-status" style="font-size:10px;color:#666;flex:1"></span>
        <button id="crm-capture-btn" style="padding:6px 12px;border-radius:4px;border:none;background:#f59e0b;color:#000;font-weight:700;font-size:11px;cursor:pointer">📥 添加客户</button>
        <button id="crm-close-btn" style="background:none;border:none;color:#666;font-size:16px;cursor:pointer">✕</button>
      </div>
      <div id="crm-content" style="flex:1;overflow:auto;padding:10px"></div>
    </div>
    <div id="crm-toggle" style="position:fixed;top:10px;right:10px;z-index:99998;padding:8px 12px;border-radius:6px;border:none;background:#f59e0b;color:#000;font-weight:700;font-size:12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3)">📋 CRM</div>
  `;
  document.body.appendChild(panel);
  
  var panelEl = document.getElementById('crm-panel');
  var toggleEl = document.getElementById('crm-toggle');
  var contentEl = document.getElementById('crm-content');
  var statusEl = document.getElementById('crm-status');
  
  toggleEl.onclick = function(){ panelEl.style.display='flex'; toggleEl.style.display='none'; };
  document.getElementById('crm-close-btn').onclick = function(){ panelEl.style.display='none'; toggleEl.style.display='block'; };
  
  // Capture current chat
  document.getElementById('crm-capture-btn').onclick = function(){
    statusEl.textContent = '⏳ 读取中...';
    try {
      var s = window.Store;
      var c = s&&s.Chat&&s.Chat.getActive ? s.Chat.getActive() : null;
      if(!c){ statusEl.textContent = '❌ 请先点开一个对话'; return; }
      var ct = c.contact||c.__x_contact;
      if(!ct){ statusEl.textContent = '❌ 无法读取联系人'; return; }
      var p='',n='';
      if(ct.id&&ct.id.user) p=ct.id.user;
      else if(ct.id&&ct.id._serialized) p=ct.id._serialized.split('@')[0];
      n = ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      if(!p){ statusEl.textContent = '❌ 无手机号'; return; }
      
      statusEl.textContent = '✅ '+n;
      showCustomerForm(p,n);
    }catch(e){ statusEl.textContent = '❌ '+e.message; }
  };
  
  function showCustomerForm(phone,name){
    var country = getCountry(phone);
    contentEl.innerHTML = `
      <div style="background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="color:#f59e0b;font-weight:600;margin-bottom:10px">📋 客户信息</div>
        <label style="color:#666;font-size:10px">手机号</label>
        <input id="cf-phone" value="${phone}" readonly style="color:#666;width:100%;padding:6px;border-radius:4px;border:1px solid #1a1a1a;background:#000;margin-bottom:6px;font-size:12px">
        <label style="color:#666;font-size:10px">名称</label>
        <input id="cf-name" value="${name}" style="width:100%;padding:6px;border-radius:4px;border:1px solid #333;background:#000;color:#fff;margin-bottom:6px;font-size:12px">
        <label style="color:#666;font-size:10px">国家</label>
        <input id="cf-country" value="${country}" style="width:100%;padding:6px;border-radius:4px;border:1px solid #333;background:#000;color:#fff;margin-bottom:6px;font-size:12px">
        <button id="cf-save" style="width:100%;padding:8px;border-radius:6px;border:none;background:#f59e0b;color:#000;font-weight:700;font-size:13px;cursor:pointer">💾 保存到CRM</button>
      </div>
    `;
    
    document.getElementById('cf-save').onclick = function(){
      var data = {
        phone: document.getElementById('cf-phone').value,
        name: document.getElementById('cf-name').value,
        country: document.getElementById('cf-country').value,
        source: 'whatsapp_panel'
      };
      fetch('https://truckmarts.com/api/crm', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
      }).then(function(r){ return r.json(); }).then(function(){
        statusEl.textContent = '✅ 已保存';
      }).catch(function(){ statusEl.textContent = '❌ 保存失败'; });
    };
  }
  
  function getCountry(p){
    var m={'213':'Algeria','218':'Libya','234':'Nigeria','232':'Sierra Leone','224':'Guinea',
      '221':'Senegal','223':'Mali','227':'Niger','229':'Benin','228':'Togo','233':'Ghana',
      '225':'Ivory Coast','254':'Kenya','251':'Ethiopia','252':'Somalia','256':'Uganda',
      '255':'Tanzania','250':'Rwanda','257':'Burundi','27':'South Africa','20':'Egypt',
      '212':'Morocco','216':'Tunisia','1':'US/Canada','44':'UK','971':'UAE','86':'China'};
    var c=(p||'').replace('+','').replace(/[^0-9]/g,'');
    for(var l=3;l>=1;l--){ var pr=c.substring(0,l); if(m[pr])return m[pr]; }
    return '';
  }
})();
