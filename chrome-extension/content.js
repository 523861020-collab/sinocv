// SINOCV CRM — injected directly into WhatsApp Web
(function(){
  const API = 'https://truckmarts.com/api/crm';
  let currentPhone = '';
  let currentData = null;
  let cache = {};

  function getChatInfo(){
    try {
      var s = window.Store;
      if(!s||!s.Chat) return null;
      var c = s.Chat.getActive?s.Chat.getActive():null;
      if(!c){ var chats=s.Chat.getModelsArray?s.Chat.getModelsArray():[]; for(var j=0;j<chats.length;j++){if(chats[j].__x_isActive){c=chats[j];break;}} }
      if(!c) return null;
      var ct=c.contact||c.__x_contact; if(!ct) return null;
      var p=''; if(ct.id&&ct.id.user)p=ct.id.user; else if(ct.id&&ct.id._serialized)p=ct.id._serialized.split('@')[0];
      var n=ct.name||ct.pushname||ct.verifiedName||ct.shortName||p||'';
      return {phone:p,name:n};
    }catch(e){ return null; }
  }

  function getCountry(p){
    if(!p||!p.startsWith('+')) return '';
    var m={'213':'Algeria','218':'Libya','234':'Nigeria','232':'Sierra Leone','224':'Guinea','221':'Senegal','223':'Mali','227':'Niger','229':'Benin','228':'Togo','233':'Ghana','225':'Ivory Coast','237':'Cameroon','254':'Kenya','251':'Ethiopia','252':'Somalia','256':'Uganda','255':'Tanzania','250':'Rwanda','27':'South Africa','20':'Egypt','212':'Morocco','216':'Tunisia','1':'US','44':'UK','86':'China','971':'UAE','63':'Philippines','91':'India','92':'Pakistan'};
    var c=p.replace('+','').replace(/[^0-9]/g,'');
    for(var l=3;l>=1;l--){ var pr=c.substring(0,l); if(m[pr])return m[pr]; }
    return '';
  }

  // ====== BUILD UI ======
  function createUI(){
    var style = document.createElement('style');
    style.textContent = '#crm-panel{position:fixed;top:0;right:0;width:360px;height:100vh;background:#0a0a0a;z-index:99999;font-family:-apple-system,sans-serif;font-size:12px;color:#ccc;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s;border-left:1px solid #1a1a1a}#crm-panel.open{transform:translateX(0)}#crm-toggle{position:fixed;top:12px;right:372px;z-index:99999;padding:8px 14px;border-radius:6px;border:none;background:#f59e0b;color:#000;font-weight:700;font-size:13px;cursor:pointer;display:none}#crm-toggle.show{display:block}#crm-hdr{padding:12px;border-bottom:1px solid #1a1a1a;display:flex;align-items:center;gap:8px}#crm-hdr h3{color:#f59e0b;font-size:14px;flex:1;margin:0}#crm-body{flex:1;overflow:auto;padding:10px}#crm-body input,#crm-body textarea{width:100%;padding:8px;border-radius:4px;border:1px solid #1a1a1a;background:#111;color:#fff;font-size:12px;margin-bottom:6px;outline:none;box-sizing:border-box}#crm-body textarea{resize:vertical}#crm-body label{font-size:10px;color:#666;display:block;margin-bottom:2px}#crm-body .btn{padding:6px 14px;border-radius:4px;border:1px solid #333;background:none;color:#f59e0b;cursor:pointer;font-size:11px}#crm-body .btn-gold{background:#f59e0b;border-color:#f59e0b;color:#000;font-weight:700}#crm-body .card{border:1px solid #1a1a1a;border-radius:8px;padding:10px;margin-bottom:8px}#crm-toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:4px;font-size:11px;z-index:100000}';
    document.head.appendChild(style);

    var toggle = document.createElement('button');
    toggle.id = 'crm-toggle';
    toggle.textContent = '🚛 CRM';
    toggle.onclick = function(){ document.getElementById('crm-panel').classList.toggle('open'); };

    var panel = document.createElement('div');
    panel.id = 'crm-panel';
    panel.innerHTML = '<div id="crm-hdr"><h3>🚛 SINOCV CRM</h3><button class="btn" onclick="document.getElementById(\'crm-panel\').classList.remove(\'open\')">✕</button></div><div id="crm-body"><div style="text-align:center;padding:40px;color:#666">点击 <b style="color:#f59e0b">📥 获取客户</b> 按钮开始</div></div>';

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    setTimeout(function(){ toggle.classList.add('show'); }, 2000);
  }

  function toast(msg, ok){
    var t = document.createElement('div'); t.id = 'crm-toast';
    t.style.background = ok ? '#059669' : '#dc2626'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function(){ t.remove(); }, 2000);
  }

  // ====== WATCH CHAT ======
  function watchChat(){
    setInterval(function(){
      var info = getChatInfo();
      if(info && info.phone && info.phone !== currentPhone){
        currentPhone = info.phone;
        renderSuccess(info);
      }
    }, 3000);
  }

  function renderSuccess(info){
    currentData = {
      phone: info.phone, name: info.name||'', country: getCountry(info.phone),
      email:'', company:'', product:'', notes:'',
      orders: [{id:1, requirements:[], docs:[], totalAmt:'', status:'active'}],
      followUps: []
    };
    
    // Load from CRM
    fetch(API+'?phone='+encodeURIComponent(info.phone))
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(d){
        if(d&&d.contact){
          var c=d.contact;
          currentData.name=c.name||currentData.name;
          currentData.country=c.country||currentData.country;
          currentData.email=c.email||'';
          currentData.company=c.company||'';
          currentData.product=c.product||'';
          currentData.notes=c.notes||'';
          if(c.orders&&c.orders.length) currentData.orders=c.orders;
          if(c.followUps) currentData.followUps=c.followUps;
        }
        renderCustomerCard();
      })
      .catch(function(){ renderCustomerCard(); });
  }

  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderCustomerCard(){
    if(!currentData) return;
    var d = currentData;
    var h = '<div class="card"><b style="color:#f59e0b">📋 '+esc(d.name||d.phone)+'</b>';
    h += '<button class="btn btn-gold" onclick="window._crmSave()" style="float:right;margin-top:-4px">💾 保存</button></div>';
    h += '<label>手机号</label><input id="ciPhone" value="'+esc(d.phone)+'" readonly style="color:#666">';
    h += '<label>名称</label><input id="ciName" value="'+esc(d.name)+'">';
    h += '<label>国家</label><input id="ciCountry" value="'+esc(d.country||'')+'">';
    h += '<label>邮箱</label><input id="ciEmail" value="'+esc(d.email||'')+'" placeholder="选填">';
    h += '<label>公司</label><input id="ciCompany" value="'+esc(d.company||'')+'" placeholder="选填">';
    h += '<label>需求车型</label><input id="ciProduct" value="'+esc(d.product||'')+'" placeholder="HOWO 6×4 tractor...">';
    h += '<label>备注</label><textarea id="ciNotes" rows="2" placeholder="客户备注...">'+esc(d.notes||'')+'</textarea>';
    
    // Orders
    h += '<div class="card"><b style="color:#f59e0b">📦 订单</b> <button class="btn" onclick="window._crmNewOrder()">+ 新建</button>';
    (d.orders||[]).forEach(function(o,i){
      h += '<div style="border:1px solid #1a1a1a;border-radius:6px;padding:8px;margin:6px 0">';
      h += '<b>订单'+(i+1)+'</b> <span style="font-size:10px;color:'+(o.status==='done'?'#666':'#f59e0b')+'">'+(o.status==='done'?'已完成':'进行中')+'</span>';
      if(o.status!=='done'){
        h += '<button class="btn btn-gold" onclick="window._crmDoneOrder('+i+')" style="float:right">✅</button>';
      }
      h += '<input id="ordTotal'+i+'" placeholder="订单总金额" value="'+esc(o.totalAmt||'')+'">';
      h += '<input id="ordNo'+i+'" placeholder="订单号" value="'+esc(o.orderNo||'')+'">';
      h += '<input id="ordType'+i+'" placeholder="车型" value="'+esc(o.vehicleType||'')+'">';
      h += '</div>';
    });
    h += '</div>';
    
    // Follow-ups
    h += '<div class="card"><b style="color:#f59e0b">📝 跟进记录</b>';
    h += '<div style="display:flex;gap:4px;margin-top:6px"><input id="fuText" placeholder="新增跟进..."><button class="btn btn-gold" onclick="window._crmAddFollow()">添加</button></div>';
    h += '<div id="fuList">';
    (d.followUps||[]).forEach(function(f){ h += '<div style="padding:4px 0;border-bottom:1px solid #111;font-size:11px">📅 '+esc(f.date||'')+' '+esc(f.content||'')+'</div>' });
    h += '</div></div>';

    document.getElementById('crm-body').innerHTML = h;
    
    // Bind functions to window
    window._crmSave = function(){
      currentData.name = document.getElementById('ciName').value.trim();
      currentData.country = document.getElementById('ciCountry').value.trim();
      currentData.email = document.getElementById('ciEmail').value.trim();
      currentData.company = document.getElementById('ciCompany').value.trim();
      currentData.product = document.getElementById('ciProduct').value.trim();
      currentData.notes = document.getElementById('ciNotes').value.trim();
      (currentData.orders||[]).forEach(function(o,i){
        var t = document.getElementById('ordTotal'+i); if(t) o.totalAmt=t.value;
        var n = document.getElementById('ordNo'+i); if(n) o.orderNo=n.value;
        var v = document.getElementById('ordType'+i); if(v) o.vehicleType=v.value;
      });
      fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(currentData)}).then(function(){ toast('✅ 已保存',true); });
    };
    window._crmNewOrder = function(){
      if(!currentData.orders) currentData.orders = [];
      currentData.orders.push({id:currentData.orders.length+1, requirements:[], docs:[], status:'active'});
      renderCustomerCard();
    };
    window._crmDoneOrder = function(i){
      currentData.orders[i].status = 'done';
      window._crmSave();
      renderCustomerCard();
    };
    window._crmAddFollow = function(){
      var t = document.getElementById('fuText').value.trim();
      if(!t) return;
      if(!currentData.followUps) currentData.followUps = [];
      currentData.followUps.push({date: new Date().toISOString().split('T')[0], content: t});
      window._crmSave();
      renderCustomerCard();
    };
  }

  // ====== START ======
  function waitForStore(){
    if(window.Store && window.Store.Chat){
      createUI();
      watchChat();
      return;
    }
    setTimeout(waitForStore, 2000);
  }
  waitForStore();
})();
