// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';

const API = '/api/crm';
const USERS = ['Li Shanlong', '王小涵', '毛振威', '赵欢乐', '杜飞跃'];
const USER_INFO: Record<string,any> = {
  'Li Shanlong': {product:'全部',region:'全球'},
  '王小涵': {product:'牵引车/挂车/载货车/冷藏车',region:'北非/西非'},
  '毛振威': {product:'工程机械(自卸车/挖掘机/装载机/随车吊/搅拌车等)',region:'中非/东非'},
  '赵欢乐': {product:'工程机械(自卸车/挖掘机/装载机/随车吊/搅拌车等)',region:'北非/西非'},
  '杜飞跃': {product:'牵引车/挂车/载货车/冷藏车',region:'中非/东非'},
};
const PINS: Record<string,string> = {'Li Shanlong':'1234','13001977959':'202502','王小涵':'1111','毛振威':'2222','赵欢乐':'3333','杜飞跃':'4444'};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [tab, setTab] = useState('dash');
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [timeMonth, setTimeMonth] = useState(new Date().toISOString().slice(0,7));
  const [followUps, setFollowUps] = useState<any>({});
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const isAdmin = user === 'Li Shanlong' || user === '13001977959';
  const my = isAdmin ? contacts : contacts.filter(c => !c.owner || c.owner === user);

  const load = useCallback(async () => {
    try { const r = await fetch(API+'?action=all'); if(r.ok){setContacts((await r.json()).contacts||[])} } catch(e){}
  }, []);
  useEffect(() => { if(loggedIn){load();const i=setInterval(load,20000);return ()=>clearInterval(i)} }, [loggedIn,load]);

  const loadTime = useCallback(async (month:string) => {
    try { const r = await fetch(`${API}/time?month=${month}`); if(r.ok){setTimeLogs((await r.json()).logs||[])} } catch(e){}
  }, []);
  useEffect(() => { if(loggedIn && tab==='time') { loadTime(timeMonth); loadFups(); } }, [loggedIn,tab,timeMonth,loadTime]);

  const expTime = () => {
    let csv='日期,姓名,开始时间,结束时间,在线时长(分钟),工时(分钟)\n';
    timeLogs.forEach((l:any)=>{
      const start=l.sessionStart?new Date(l.sessionStart):null;
      const end=l.endTime?new Date(l.endTime):null;
      const dur=start&&end?Math.round((end.getTime()-start.getTime())/60000):0;
      let workMin=0;
      if(start&&end){for(let t=start.getTime();t<end.getTime();t+=60000){const d3=new Date(t);const h3=d3.getHours()+d3.getMinutes()/60;if(h3>=13&&h3<22.5&&!(h3>=17.5&&h3<18.5))workMin++;}}
      csv+=`${l.date||''},${l.user||''},${start?start.toLocaleTimeString('zh-CN',{hour12:false}):'-'},${end?end.toLocaleTimeString('zh-CN',{hour12:false}):'-'},${dur},${workMin}\n`;
    });
    const bl=new Blob(['\uFEFF'+csv],{type:'text/csv'});const a3=document.createElement('a');a3.href=URL.createObjectURL(bl);a3.download=`考勤_${timeMonth}.csv`;a3.click();
  };

  function doLogin(){ if(!user||!pin){setErr('请输入用户名和密码');return}; if(PINS[user]!==pin){setErr('密码错误');return}; setLoggedIn(true);setErr(''); }

  // ====== LOGIN ======
  if(!loggedIn) return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <img src="/images/logo-new.png" alt="" style={{height:'48px',marginBottom:'40px'}} />
      <div style={{width:'360px',background:'#0d0d0d',border:'1px solid #222',borderRadius:'12px',padding:'36px 28px'}}>
        <h2 style={{color:'#fff',fontSize:'16px',textAlign:'center',marginBottom:'24px'}}>CRM 管理系统</h2>
        <input value={user} onChange={e=>setUser(e.target.value)} placeholder="用户名" style={inp}/>
        <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="密码" onKeyDown={e=>e.key==='Enter'&&doLogin()} style={inp}/>
        {err&&<p style={{color:'#f87171',fontSize:'12px',textAlign:'center',margin:'0 0 12px'}}>{err}</p>}
        <button onClick={doLogin} style={{width:'100%',padding:'10px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#000',fontWeight:700,fontSize:'14px',cursor:'pointer'}}>登 录</button>
      </div>
    </div>
  );

  // ====== STATS ======
  const t = my.length, a = my.filter(c=>c.category==='A').length, b = my.filter(c=>c.category==='B').length, cc = my.filter(c=>c.category==='C').length;
  const orders = my.flatMap(c=>(c.orders||[]).map(o=>({...o,name:c.name||c.phone,phone:c.phone})));
  const oN = orders.length, pis = orders.flatMap(o=>o.pis||[]).length, shipped = orders.filter(o=>o.status==='shipped').length;
  const lcs = orders.filter(o=>o.paymentMethod==='LC').length;
  const overdue = my.filter(c=>c.nextFollowUp&&c.nextFollowUp<=new Date().toISOString().split('T')[0]).length;

  const cmap: Record<string,number>={}; my.forEach(c=>{const co=c.country||'未知';cmap[co]=(cmap[co]||0)+1});
  const cs = Object.entries(cmap).sort((a,b)=>b[1]-a[1]);
  const today = new Date().toISOString().split('T')[0], wk = (()=>{const d=new Date();d.setDate(d.getDate()-d.getDay());return d.toISOString().split('T')[0]})();

  function st(owner:string){
    const cs2=my.filter(c=>c.owner===owner);
    const moStart=(new Date().toISOString().slice(0,7));
    return {
      owner,
      today:cs2.filter(c=>c.firstSeen?.startsWith(today)).length,
      week:cs2.filter(c=>c.firstSeen>=wk).length,
      piToday:cs2.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date===today))).length,
      piWeek:cs2.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date>=wk))).length,
      piMonth:cs2.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>(p.date||'').startsWith(moStart)))).length,
    };
  }

  let ft = filter==='all'?my:my.filter(c=>c.category===filter);
  if(search) ft = ft.filter(c=>(c.name||''+c.phone||'').toLowerCase().includes(search.toLowerCase()));

  function exp(){
    let csv='负责人,客户名称,手机号,国家,分类,订单号,状态,金额,币种,付款方式,船名,ETA,VIN\n';
    my.forEach((c:any)=>{(c.orders||[]).forEach((o:any)=>{csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},${o.orderNo||''},${o.status||''},${o.totalAmt||''},${o.currency||''},${o.paymentMethod||''},${o.vessel||''},${o.eta||''},${(o.vins||[]).join(';')}\n`})});
    const bl=new Blob(['\uFEFF'+csv],{type:'text/csv'});const a2=document.createElement('a');a2.href=URL.createObjectURL(bl);a2.download='客户数据导出.csv';a2.click();
  }

  return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex'}}>
      {/* 侧边栏 */}
      <div style={{width:'200px',background:'#0a0a0a',borderRight:'1px solid #1a1a1a',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid #1a1a1a'}}>
          <img src="/images/logo-new.png" alt="" style={{height:'24px',marginBottom:'6px'}} />
          <p style={{color:'#555',fontSize:'10px',margin:0}}>CRM · 商用汽车出口</p>
        </div>
        <div style={{padding:'8px',flex:1}}>
          {[{id:'dash',icon:'📊',l:'仪表盘'},{id:'contacts',icon:'📋',l:'客户列表'},{id:'time',icon:'⏱',l:'考勤记录'}].map(t=>
            <button key={t.id} onClick={()=>setTab(t.id)} style={{width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:'6px',border:'none',background:tab===t.id?'#1a1a1a':'transparent',color:tab===t.id?'#f59e0b':'#888',fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',marginBottom:'2px'}}>{t.icon} {t.l}</button>
          )}
        </div>
        <div style={{padding:'12px',borderTop:'1px solid #1a1a1a',fontSize:'11px',color:'#666'}}>
          👤 {user}
          <div style={{marginTop:'6px',display:'flex',gap:'4px'}}>
            <button onClick={exp} style={{flex:1,padding:'5px',borderRadius:'4px',border:'none',background:'#1a1a1a',color:'#999',fontSize:'10px',cursor:'pointer'}}>导出</button>
            <button onClick={()=>{setLoggedIn(false);setUser('');setPin('')}} style={{flex:1,padding:'5px',borderRadius:'4px',border:'none',background:'#1a1a1a',color:'#999',fontSize:'10px',cursor:'pointer'}}>退出</button>
          </div>
        </div>
      </div>

      {/* 主区域 */}
      <div style={{flex:1,overflow:'auto'}}>
        {tab==='dash'&&<div style={{padding:'32px',maxWidth:'960px'}}>
          <h2 style={{color:'#fff',fontSize:'18px',marginBottom:'24px'}}>📊 数据概览</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'12px',marginBottom:'32px'}}>
            {[[t,'总客户数'],[a,'A类'],[b,'B类'],[cc,'C类'],[oN,'订单数'],[pis,'PI数'],[lcs,'信用证'],[shipped,'已发货'],[overdue,'逾期提醒']].map(([n,l],i)=><div key={i} style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'20px 16px'}}>
              <div style={{fontSize:'28px',fontWeight:700,color:i===8&&(n as number)>0?'#f87171':'#f59e0b'}}>{n as number}</div>
              <div style={{fontSize:'12px',color:'#666',marginTop:'4px'}}>{l}</div>
            </div>)}
          </div>

          <div style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'24px',marginBottom:'24px'}}>
            <h3 style={{color:'#fff',fontSize:'14px',marginBottom:'16px'}}>🌍 国家分布（共 {t} 客户）</h3>
            {cs.slice(0,8).map(([co,n])=><div key={co} style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px',fontSize:'13px'}}>
              <span style={{width:'80px',textAlign:'right',color:'#888'}}>{co}</span>
              <div style={{flex:1,background:'#1a1a1a',borderRadius:'4px',height:'8px',overflow:'hidden'}}><div style={{height:'100%',borderRadius:'4px',background:'linear-gradient(90deg,#f59e0b,#d97706)',width:Math.max((n/t)*100,1)+'%'}}></div></div>
              <span style={{width:'36px',color:'#f59e0b',fontWeight:600}}>{Math.round((n/t)*100)}%</span>
            </div>)}
          </div>

          <div style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'24px'}}>
            <h3 style={{color:'#fff',fontSize:'14px',marginBottom:'16px'}}>📊 每日业绩</h3>
            <table style={{width:'100%',fontSize:'13px',borderCollapse:'collapse'}}>
              <thead><tr style={{color:'#666',borderBottom:'1px solid #1a1a1a'}}><th style={{textAlign:'left',padding:'8px',fontWeight:400}}>销售员</th><th style={{padding:'8px',fontWeight:400}}>今日</th><th style={{padding:'8px',fontWeight:400}}>PI</th><th style={{padding:'8px',fontWeight:400}}>本周</th><th style={{padding:'8px',fontWeight:400}}>PI</th><th style={{padding:'8px',fontWeight:400}}>本月PI</th></tr></thead>
              <tbody>{USERS.map(u=>{const s=st(u);return<tr key={u} onClick={()=>{setFilter('all');setSearch('');setTab('contacts');setTimeout(()=>setSearch(u),100)}} style={{borderBottom:'1px solid #111',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='#111'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><td style={{padding:'10px 8px',color:'#fff',fontWeight:500}}>{u}</td><td style={{padding:'10px 8px',textAlign:'center',color:'#ccc'}}>{s.today}</td><td style={{padding:'10px 8px',textAlign:'center',color:'#f59e0b',fontWeight:600}}>{s.piToday}</td><td style={{padding:'10px 8px',textAlign:'center',color:'#ccc'}}>{s.week}</td><td style={{padding:'10px 8px',textAlign:'center',color:'#f59e0b',fontWeight:600}}>{s.piWeek}</td><td style={{padding:'10px 8px',textAlign:'center',color:'#f59e0b',fontWeight:600}}>{s.piMonth}</td></tr>})}</tbody>
            </table>
          </div>
        </div>}

        {tab==='contacts'&&<div style={{padding:'32px',maxWidth:'960px'}}>
          <h2 style={{color:'#fff',fontSize:'18px',marginBottom:'20px'}}>📋 客户列表</h2>
          <div style={{display:'flex',gap:'8px',marginBottom:'20px'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索客户..." style={{flex:1,padding:'10px 14px',borderRadius:'6px',border:'1px solid #1a1a1a',background:'#0d0d0d',color:'#fff',fontSize:'13px',outline:'none'}} />
            <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'10px',borderRadius:'6px',border:'1px solid #1a1a1a',background:'#0d0d0d',color:'#fff',fontSize:'13px',outline:'none'}}>
              <option value="all">全部分类</option><option value="A">A类</option><option value="B">B类</option><option value="C">C类</option>
            </select>
          </div>
          {ft.map(c=>{
            const d=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
            return <div key={c.phone} onClick={()=>setSelected(c)} style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'8px',padding:'14px 18px',marginBottom:'6px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{color:'#fff',fontSize:'14px',fontWeight:600}}>{c.name||c.phone}
                  {c.category&&<span style={{marginLeft:'8px',padding:'2px 6px',borderRadius:'4px',fontSize:'10px',background:c.category==='A'?'#7c3aed':c.category==='B'?'#2563eb':'#333',color:'#fff'}}>{c.category}类</span>}
                  {d!==null&&d<=0&&<span style={{marginLeft:'6px',color:'#f87171',fontSize:'11px'}}>⚠ 逾期</span>}
                </div>
                <div style={{color:'#666',fontSize:'11px',marginTop:'2px'}}>{c.phone} · {c.country||'未知'} {(c.orders||[]).length?`· ${(c.orders||[]).length}个订单`:''} {d!==null?`· ${d}天`:''}</div>
              </div>
              <span style={{color:'#444'}}>→</span>
            </div>
          })}
          {ft.length===0&&<p style={{color:'#444',textAlign:'center',padding:'60px'}}>暂无客户数据</p>}
        </div>}

        {tab==='time'&&<div style={{padding:'32px',maxWidth:'960px'}}>
          <h2 style={{color:'#fff',fontSize:'18px',marginBottom:'20px'}}>⏱ 考勤记录</h2>
          <div style={{marginBottom:'20px',display:'flex',gap:'8px'}}>
            <input type="month" value={timeMonth} onChange={e=>setTimeMonth(e.target.value)} style={{padding:'8px 12px',borderRadius:'6px',border:'1px solid #1a1a1a',background:'#0d0d0d',color:'#fff',fontSize:'13px',outline:'none'}} />
            <button onClick={expTime} style={{padding:'8px 16px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#000',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>📥 导出考勤</button>
          </div>

          {/* Per-user summary */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px',marginBottom:'24px'}}>
            {USERS.map(u=>{
              const ulogs = timeLogs.filter((l:any)=>l.user===u);
              const totalMin = ulogs.reduce((sum:number,l:any)=>sum+(l.endTime&&l.sessionStart?Math.round((l.endTime-l.sessionStart)/60000):0),0);
              const days = ulogs.length;
              // Calculate work hours (13:00-22:30, minus 17:30-18:30 = 8h/day)
              const workMin = ulogs.reduce((sum:number,l:any)=>{
                if(!l.sessionStart||!l.endTime) return sum;
                const start = new Date(l.sessionStart);
                const end = new Date(l.endTime);
                // Count minutes within work hours
                let min = 0;
                for(let t=start.getTime();t<end.getTime();t+=60000){
                  const d = new Date(t);
                  const h = d.getHours(), m = d.getMinutes();
                  const hm = h + m/60;
                  if(hm >= 13 && hm < 22.5 && !(hm >= 17.5 && hm < 18.5)) min++;
                }
                return sum + min;
              }, 0);
              return <div key={u} style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'16px'}}>
                <div style={{color:'#fff',fontWeight:600,fontSize:'14px',marginBottom:'4px'}}>{u}</div>
                <div style={{color:'#666',fontSize:'10px',marginBottom:'8px'}}>{(USER_INFO[u]||{}).product||''} · {(USER_INFO[u]||{}).region||''}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',fontSize:'12px'}}>
                  <div><span style={{color:'#666'}}>出勤天数</span><div style={{color:'#fff',fontSize:'16px',fontWeight:700}}>{days}</div></div>
                  <div><span style={{color:'#666'}}>总工时</span><div style={{color:'#f59e0b',fontSize:'16px',fontWeight:700}}>{Math.round(workMin/60)}h</div></div>
                  <div><span style={{color:'#666'}}>在线时长</span><div style={{color:'#ccc',fontSize:'14px'}}>{Math.round(totalMin/60)}h {totalMin%60}m</div></div>
                  <div><span style={{color:'#666'}}>日均在线</span><div style={{color:'#ccc',fontSize:'14px'}}>{days?Math.round(totalMin/days):0}m</div></div>
                </div>
              </div>
            })}
          </div>

          {/* Follow-up compliance */}
          <div style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'20px',marginBottom:'24px'}}>
            <h3 style={{color:'#fff',fontSize:'14px',marginBottom:'12px'}}>📲 今日回访（自动检测 YCloud 发信记录）</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'8px'}}>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <div style={{fontSize:'24px',fontWeight:700,color:'#34d399'}}>{followUps.followedUpToday||0}</div>
                <div style={{fontSize:'11px',color:'#666'}}>今日已回访</div>
              </div>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <div style={{fontSize:'24px',fontWeight:700,color:'#f59e0b'}}>{followUps.totalContacts||0}</div>
                <div style={{fontSize:'11px',color:'#666'}}>总客户数</div>
              </div>
              <div style={{background:'#111',borderRadius:'8px',padding:'12px'}}>
                <div style={{fontSize:'24px',fontWeight:700,color:'#f87171'}}>{overdue}</div>
                <div style={{fontSize:'11px',color:'#666'}}>今日逾期未回</div>
              </div>
            </div>
            <p style={{color:'#666',fontSize:'11px',marginTop:'8px'}}>
              ✅ 回访判定：员工给<b style={{color:'#fff'}}>非今日新增</b>的客户发信息 = 回访成功<br/>
              ❌ 未回访判定：逾期但今日未给该客户发信息
            </p>
          </div>

          {/* Daily log */}
          <div style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'20px'}}>
            <h3 style={{color:'#fff',fontSize:'14px',marginBottom:'16px'}}>📅 每日明细</h3>
            <table style={{width:'100%',fontSize:'12px',borderCollapse:'collapse'}}>
              <thead><tr style={{color:'#666',borderBottom:'1px solid #1a1a1a'}}><th style={{textAlign:'left',padding:'6px',fontWeight:400}}>日期</th><th style={{padding:'6px',fontWeight:400}}>姓名</th><th style={{padding:'6px',fontWeight:400}}>开始</th><th style={{padding:'6px',fontWeight:400}}>结束</th><th style={{padding:'6px',fontWeight:400}}>工时</th></tr></thead>
              <tbody>
                {timeLogs.slice(0,50).map((l:any,i:number)=>{
                  const start = l.sessionStart ? new Date(l.sessionStart) : null;
                  const end = l.endTime ? new Date(l.endTime) : null;
                  const dur = start&&end ? Math.round((end.getTime()-start.getTime())/60000) : 0;
                  const fmt = (d:Date|null) => d ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : '-';
                  return <tr key={i} style={{borderBottom:'1px solid #111'}}>
                    <td style={{padding:'6px',color:'#888'}}>{l.date||''}</td>
                    <td style={{padding:'6px',color:'#fff'}}>{l.user||''}</td>
                    <td style={{padding:'6px',color:'#ccc'}}>{fmt(start)}</td>
                    <td style={{padding:'6px',color:'#ccc'}}>{fmt(end)}</td>
                    <td style={{padding:'6px',color:'#f59e0b',fontWeight:600}}>{Math.floor(dur/60)}h {dur%60}m</td>
                  </tr>
                })}
              </tbody>
            </table>
            {timeLogs.length===0&&<p style={{color:'#444',textAlign:'center',padding:'30px'}}>暂无考勤数据（员工使用插件后自动记录）</p>}
          </div>
        </div>}

        {/* 客户详情 */}
        {selected&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:50,display:'flex',justifyContent:'flex-end'}} onClick={()=>setSelected(null)}>
          <div style={{width:'100%',maxWidth:'500px',background:'#0d0d0d',borderLeft:'1px solid #1a1a1a',overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid #1a1a1a',display:'flex',alignItems:'center',gap:'12px',position:'sticky',top:0,background:'#0d0d0d'}}>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'#fff',fontSize:'18px',cursor:'pointer'}}>←</button>
              <div style={{flex:1}}><div style={{color:'#fff',fontWeight:600}}>{selected.name||selected.phone}</div><div style={{color:'#666',fontSize:'11px'}}>{selected.phone} · {selected.country||'未知'}</div></div>
              <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'10px',fontWeight:600,background:selected.category==='A'?'#7c3aed':selected.category==='B'?'#2563eb':selected.category==='C'?'#333':'#f59e0b',color:selected.category?'#fff':'#000'}}>{selected.category?selected.category+'类':'新'}</span>
            </div>
            <div style={{padding:'20px'}}>
              {/* Info grid */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',fontSize:'13px',marginBottom:'20px'}}>
                {[{l:'邮箱',v:selected.email},{l:'公司',v:selected.company},{l:'产品',v:selected.product},{l:'负责人',v:selected.owner}].map((f,i)=>f.v&&<div key={i}><div style={{color:'#666',fontSize:'10px',marginBottom:'2px'}}>{f.l}</div><div style={{color:'#ccc'}}>{f.v}</div></div>)}
              </div>
              {selected.notes&&<div style={{background:'#111',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#999',marginBottom:'16px'}}>{selected.notes}</div>}
              {selected.nextFollowUp&&<div style={{background:'#1a1200',border:'1px solid #2d2000',borderRadius:'8px',padding:'12px',fontSize:'13px',color:'#f59e0b',marginBottom:'16px'}}>📅 下次回访：{selected.nextFollowUp}</div>}

              {(selected.orders||[]).length>0&&<div>
                <h4 style={{color:'#f59e0b',fontSize:'14px',marginBottom:'12px'}}>📦 订单（{(selected.orders||[]).length}）</h4>
                {(selected.orders||[]).map((o:any,i:number)=><details key={i} style={{background:'#111',borderRadius:'8px',marginBottom:'8px',overflow:'hidden'}}>
                  <summary style={{padding:'12px 16px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'#fff',display:'flex',justifyContent:'space-between'}}>
                    <span>订单 #{i+1} {o.orderNo||''}</span>
                    <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'3px',background:o.status==='shipped'?'#064e3b':o.status==='delivered'?'#333':'#1a1200',color:o.status==='shipped'?'#34d399':o.status==='delivered'?'#888':'#f59e0b'}}>{o.status||'待处理'}</span>
                  </summary>
                  <div style={{padding:'16px',borderTop:'1px solid #1a1a1a',fontSize:'12px',color:'#aaa',lineHeight:'1.8'}}>
                    {o.requirements&&<p><span style={{color:'#666'}}>需求：</span>{o.requirements}</p>}
                    {o.totalAmt&&<p><span style={{color:'#666'}}>金额：</span><b style={{color:'#fff'}}>{o.totalAmt} {o.currency||'USD'}</b></p>}
                    {o.paymentMethod&&<p><span style={{color:'#666'}}>付款方式：</span>{o.paymentMethod==='LC'?'信用证':'T/T'}</p>}
                    {(o.depositDate||o.depositAmt)&&<p><span style={{color:'#666'}}>定金：</span>{o.depositDate} {o.depositAmt}</p>}
                    {(o.balanceDate||o.balanceAmt)&&<p><span style={{color:'#666'}}>尾款：</span>{o.balanceDate} {o.balanceAmt}</p>}
                    {(o.lcOpenDate||o.lcAmt)&&<div style={{background:'#0a1628',borderRadius:'6px',padding:'10px',margin:'8px 0'}}>
                      <p style={{color:'#38bdf8',fontWeight:600,marginBottom:'4px'}}>🏦 信用证</p>
                      {o.lcOpenDate&&<p><span style={{color:'#666'}}>开证日期：</span>{o.lcOpenDate}</p>}
                      {o.lcAmt&&<p><span style={{color:'#666'}}>金额：</span><b style={{color:'#fff'}}>{o.lcAmt}</b></p>}
                      {o.lcShipDate&&<p><span style={{color:'#666'}}>最晚装船：</span>{o.lcShipDate}</p>}
                      {o.lcDepartDate&&<p><span style={{color:'#666'}}>最晚离港：</span>{o.lcDepartDate}</p>}
                      {o.docsDate&&<p><span style={{color:'#666'}}>交单日期：</span>{o.docsDate}</p>}
                      {o.lcPayDate&&<p><span style={{color:'#666'}}>收款日期：</span>{o.lcPayDate} {o.lcPayAmt}</p>}
                    </div>}
                    {o.shipDate&&<p><span style={{color:'#666'}}>发运日期：</span>{o.shipDate}</p>}
                    {o.eta&&<p><span style={{color:'#666'}}>预计到港：</span>{o.eta}</p>}
                    {o.vessel&&<p><span style={{color:'#666'}}>船名：</span>{o.vessel} · 订舱号：{o.bookingNo||''}</p>}
                    {(o.pis||[]).length>0&&<p><span style={{color:'#666'}}>PI：</span>{o.pis.map((p:any)=><span key={p.number} style={{color:'#f59e0b',marginRight:'6px'}}>{p.number} {p.date}</span>)}</p>}
                    {(o.vins||[]).length>0&&<p style={{fontSize:'11px',marginTop:'4px'}}><span style={{color:'#666'}}>VIN：</span>{(o.vins||[]).join('、')}</p>}
                  </div>
                </details>)}
              </div>}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width:'100%',padding:'10px 14px',borderRadius:'6px',border:'1px solid #222',
  background:'#000',color:'#fff',fontSize:'14px',marginBottom:'12px',
  outline:'none',boxSizing:'border-box'
};
