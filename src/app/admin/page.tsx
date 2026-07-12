// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';

const API = '/api/crm';
const USERS = ['Li Shanlong', 'Sales 1', 'Sales 2', 'Sales 3', 'Sales 4'];
const PINS: Record<string,string> = {'Li Shanlong':'1234','13001977959':'202502','Sales 1':'1111','Sales 2':'2222','Sales 3':'3333','Sales 4':'4444'};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('dash');
  const [selected, setSelected] = useState<any>(null);

  const isAdmin = user === 'Li Shanlong' || user === '13001977959';
  const myContacts = isAdmin ? contacts : contacts.filter(c => !c.owner || c.owner === user);

  const loadContacts = useCallback(async () => {
    try { const r = await fetch(API+'?action=all'); if(r.ok){const d=await r.json();setContacts(d.contacts||[])} } catch(e){}
  }, []);

  useEffect(() => { if(loggedIn) { loadContacts(); const i=setInterval(loadContacts,20000); return ()=>clearInterval(i); } }, [loggedIn, loadContacts]);

  function doLogin(){ if(!user||!pin){setErr('Select user and enter PIN');return}; if(PINS[user]!==pin){setErr('Wrong PIN');return}; setLoggedIn(true);setErr(''); }

  if(!loggedIn) return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '360px',
        background: '#111',
        borderRadius: '16px',
        padding: '40px 32px',
        border: '1px solid #222',
      }}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'32px',marginBottom:'8px'}}>🚛</div>
          <h2 style={{color:'#fff',fontSize:'18px',fontWeight:700,margin:0}}>XINYUNTONG CRM</h2>
          <p style={{color:'#666',fontSize:'12px',marginTop:'4px'}}>Sign in to your account</p>
        </div>
        <input
          type="text"
          value={user}
          onChange={e=>setUser(e.target.value)}
          placeholder="Username"
          style={{
            width:'100%',padding:'12px 16px',borderRadius:'8px',
            background:'#000',border:'1px solid #333',color:'#fff',
            fontSize:'14px',marginBottom:'12px',outline:'none',boxSizing:'border-box'
          }}
        />
        <input
          type="password"
          value={pin}
          onChange={e=>setPin(e.target.value)}
          placeholder="Password"
          onKeyDown={e=>e.key==='Enter'&&doLogin()}
          style={{
            width:'100%',padding:'12px 16px',borderRadius:'8px',
            background:'#000',border:'1px solid #333',color:'#fff',
            fontSize:'14px',marginBottom:err?'8px':'16px',outline:'none',boxSizing:'border-box'
          }}
        />
        {err&&<p style={{color:'#f87171',fontSize:'12px',textAlign:'center',marginBottom:'12px'}}>{err}</p>}
        <button
          onClick={doLogin}
          style={{
            width:'100%',padding:'12px',borderRadius:'8px',border:'none',
            background:'#f59e0b',color:'#000',fontWeight:700,fontSize:'14px',
            cursor:'pointer'
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  // ====== COMPUTE STATS ======
  const mc = myContacts;
  const total = mc.length;
  const a = mc.filter(c=>c.category==='A').length;
  const b = mc.filter(c=>c.category==='B').length;
  const cc = mc.filter(c=>c.category==='C').length;
  const orders = mc.flatMap(c=>(c.orders||[]).map(o=>({...o,name:c.name||c.phone,phone:c.phone,owner:c.owner})));
  const totalOrders = orders.length;
  const pis = orders.flatMap(o=>o.pis||[]).length;
  const shipped = orders.filter(o=>o.status==='shipped').length;
  const overdue = mc.filter(c=>c.nextFollowUp&&c.nextFollowUp<=new Date().toISOString().split('T')[0]).length;
  const lcs = orders.filter(o=>o.paymentMethod==='LC').length;

  const cmap: Record<string,number>={};
  mc.forEach(c=>{const co=c.country||'Unknown';cmap[co]=(cmap[co]||0)+1});
  const cSorted = Object.entries(cmap).sort((a,b)=>b[1]-a[1]);

  const today = new Date().toISOString().split('T')[0];
  const wkStart = (()=>{const d=new Date();d.setDate(d.getDate()-d.getDay());return d.toISOString().split('T')[0]})();
  function statsFor(owner:string){
    const cs=mc.filter(c=>c.owner===owner);
    return {owner,today:cs.filter(c=>c.firstSeen?.startsWith(today)).length,week:cs.filter(c=>c.firstSeen>=wkStart).length,piToday:cs.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date===today))).length,piWeek:cs.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date>=wkStart))).length};
  }

  let filtered = filter==='all'?mc:mc.filter(c=>c.category===filter);
  if(search) filtered = filtered.filter(c=>(c.name||''+c.phone||''+c.company||'').toLowerCase().includes(search.toLowerCase()));

  function exportCSV(){
    let csv='Owner,Name,Phone,Country,Category,Order#,Status,Total,Currency,Payment,Vessel,ETA,VINs\n';
    mc.forEach((c:any)=>{(c.orders||[]).forEach((o:any)=>{csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},${o.orderNo||''},${o.status||''},${o.totalAmt||''},${o.currency||''},${o.paymentMethod||''},${o.vessel||''},${o.eta||''},${(o.vins||[]).join(';')}\n`})});
    const b2=new Blob(['\uFEFF'+csv],{type:'text/csv'});const a2=document.createElement('a');a2.href=URL.createObjectURL(b2);a2.download='sinocv_export.csv';a2.click();
  }

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <div className="w-56 bg-[#0a0a0a] border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="text-xl mb-1">🚛</div>
          <p className="text-gray-500 text-[10px]">XINYUNTONG CRM</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[{id:'dash',icon:'📊',label:'Dashboard'},{id:'contacts',icon:'📋',label:'Contacts'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all ${tab===t.id?'bg-amber-500/10 text-amber-500 font-semibold':'text-gray-400 hover:text-white hover:bg-gray-900'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-[10px]">{isAdmin?'👑':'👤'}</span>{user}</div>
          <div className="flex gap-1">
            <button onClick={exportCSV} className="flex-1 py-1.5 rounded bg-gray-900 text-gray-400 text-[10px] hover:text-white hover:bg-gray-800 transition-colors">📥 Export</button>
            <button onClick={()=>{setLoggedIn(false);setUser('');setPin('')}} className="flex-1 py-1.5 rounded bg-gray-900 text-gray-400 text-[10px] hover:text-red-400 hover:bg-gray-800 transition-colors">Logout</button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-[#0a0a0a] border-b border-gray-800 px-6 py-3 flex items-center">
          <h2 className="text-white font-bold text-sm">{tab==='dash'?'Dashboard':'Contacts'}</h2>
          {tab==='dash'&&<span className="ml-3 text-gray-600 text-xs">{total} contacts · {totalOrders} orders</span>}
        </div>

        {tab==='dash'&&(
          <div className="p-6 max-w-6xl">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {[
                {n:total,l:'Total Contacts',c:'text-white'},
                {n:a,l:'A-Class',c:'text-purple-400'},
                {n:b,l:'B-Class',c:'text-blue-400'},
                {n:cc,l:'C-Class',c:'text-gray-400'},
                {n:totalOrders,l:'Orders',c:'text-amber-500'},
                {n:pis,l:'PIs',c:'text-emerald-400'},
                {n:lcs,l:'L/Cs',c:'text-cyan-400'},
                {n:shipped,l:'Shipped',c:'text-green-400'},
                {n:overdue,l:'⚠ Overdue',c:overdue>0?'text-red-400':'text-gray-600'},
              ].map((s,i)=><div key={i} className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-5 hover:border-gray-700 transition-colors">
                <div className={`text-3xl font-bold ${s.c}`}>{s.n}</div>
                <div className="text-gray-500 text-xs mt-1">{s.l}</div>
              </div>)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Country Distribution */}
              <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">🌍 Countries <span className="text-gray-600 font-normal text-xs">{total} total</span></h3>
                {cSorted.slice(0,8).map(([co,n])=>(
                  <div key={co} className="flex items-center gap-3 mb-2 group">
                    <span className="w-24 text-right text-gray-400 text-xs">{co}</span>
                    <div className="flex-1 bg-gray-900 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-full h-full transition-all" style={{width:Math.max((n/total)*100,1)+'%'}}></div>
                    </div>
                    <span className="w-12 text-xs font-mono text-gray-300">{Math.round((n/total)*100)}%</span>
                    <span className="w-8 text-[10px] text-gray-600">{n}</span>
                  </div>
                ))}
              </div>

              {/* Daily Performance */}
              <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-white font-semibold text-sm mb-4">📊 Daily Performance</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-gray-500 text-xs border-b border-gray-800"><th className="text-left py-2 font-medium">Salesperson</th><th className="text-right py-2">Today</th><th className="text-right py-2">PI</th><th className="text-right py-2">Week</th><th className="text-right py-2">PI</th></tr></thead>
                  <tbody>
                    {USERS.map(u=>{const s=statsFor(u);return(
                      <tr key={u} className="border-b border-gray-800/50 hover:bg-gray-900/30"><td className="py-2.5 text-white font-medium">{u}</td><td className="text-right text-gray-300">{s.today}</td><td className="text-right text-amber-500 font-semibold">{s.piToday}</td><td className="text-right text-gray-300">{s.week}</td><td className="text-right text-amber-500 font-semibold">{s.piWeek}</td></tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab==='contacts'&&(
          <div className="p-6 max-w-6xl">
            <div className="flex gap-3 mb-6">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts..." className="flex-1 p-2.5 rounded-xl bg-[#0a0a0a] border border-gray-800 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
              <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2.5 rounded-xl bg-[#0a0a0a] border border-gray-800 text-white text-sm">
                <option value="all">All Categories</option><option value="A">A · 10d</option><option value="B">B · 30d</option><option value="C">C · 60d</option>
              </select>
            </div>
            <div className="space-y-2">
              {filtered.map(c=>{
                const dl=c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
                return (
                  <div key={c.phone} onClick={()=>setSelected(c)} className="bg-[#0a0a0a] border border-gray-800/50 rounded-xl p-4 cursor-pointer hover:border-gray-700 transition-all flex items-center justify-between group">
                    <div>
                      <div className="font-semibold text-white text-sm">{c.name||c.phone}
                        {c.category&&<span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${c.category==='A'?'bg-purple-500/20 text-purple-400':c.category==='B'?'bg-blue-500/20 text-blue-400':'bg-gray-700 text-gray-400'}`}>{c.category}</span>}
                        {dl!==null&&dl<=0&&<span className="ml-2 text-red-400 text-xs">⚠ Overdue</span>}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">{c.phone} {c.country?`· ${c.country}`:''} {(c.orders||[]).length?`· 📦${(c.orders||[]).length} orders`:''} {dl!==null?`· ${dl}d`:''} {isAdmin&&c.owner?`· 👤${c.owner}`:''}</div>
                    </div>
                    <div className="text-gray-600 group-hover:text-amber-500 transition-colors">→</div>
                  </div>
                );
              })}
              {filtered.length===0&&<div className="text-center py-16 text-gray-600">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">No contacts found</p>
              </div>}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/80 z-50 flex justify-end animate-in" onClick={()=>setSelected(null)}>
            <div className="w-full max-w-lg bg-[#0a0a0a] border-l border-gray-800 overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="sticky top-0 bg-[#0a0a0a] border-b border-gray-800 p-4 flex items-center gap-3 z-10">
                <button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-white text-lg">←</button>
                <div className="flex-1">
                  <h2 className="font-bold text-white">{selected.name||selected.phone}</h2>
                  <p className="text-gray-500 text-xs">{selected.phone} · {selected.country||'Unknown'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selected.category==='A'?'bg-purple-500/20 text-purple-400':selected.category==='B'?'bg-blue-500/20 text-blue-400':selected.category==='C'?'bg-gray-700 text-gray-400':'bg-amber-500/20 text-amber-500'}`}>{selected.category||'NEW'}</span>
              </div>
              <div className="p-5 space-y-4">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[{l:'Email',v:selected.email},{l:'Company',v:selected.company},{l:'Product',v:selected.product},{l:'Owner',v:selected.owner}].map((f,i)=>f.v&&<div key={i}><label className="text-gray-500 text-[10px] uppercase tracking-wider">{f.l}</label><div className="text-white mt-0.5">{f.v}</div></div>)}
                </div>
                {selected.notes&&<div className="bg-gray-900/50 rounded-lg p-3 text-sm text-gray-300 border border-gray-800/50">{selected.notes}</div>}
                {selected.nextFollowUp&&<div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 flex justify-between items-center"><span className="text-amber-400 text-sm">📅 Next follow-up: <b>{selected.nextFollowUp}</b></span></div>}

                {/* Orders */}
                {(selected.orders||[]).length>0&&<div>
                  <h4 className="text-amber-500 font-semibold text-sm mb-3">📦 Orders ({(selected.orders||[]).length})</h4>
                  {(selected.orders||[]).map((o:any,i:number)=>(
                    <details key={i} className="bg-gray-900/30 border border-gray-800/50 rounded-xl mb-3 overflow-hidden">
                      <summary className="p-3 cursor-pointer font-semibold text-sm flex items-center justify-between hover:bg-gray-900/50">
                        <span>Order #{i+1} {o.orderNo&&`· ${o.orderNo}`}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status==='shipped'?'bg-green-500/20 text-green-400':o.status==='delivered'?'bg-gray-700 text-gray-400':'bg-amber-500/20 text-amber-400'}`}>{o.status||'pending'}</span>
                      </summary>
                      <div className="p-4 border-t border-gray-800/50 text-sm space-y-2">
                        {o.requirements&&<p className="text-white">{o.requirements}</p>}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {o.totalAmt&&<p><span className="text-gray-500">Amount</span> <span className="text-white font-semibold">{o.totalAmt} {o.currency||'USD'}</span></p>}
                          {o.paymentMethod&&<p><span className="text-gray-500">Payment</span> <span className="text-white">{o.paymentMethod}</span></p>}
                          {o.depositDate&&<p><span className="text-gray-500">Deposit</span> <span className="text-white">{o.depositDate} {o.depositAmt}</span></p>}
                          {o.balanceDate&&<p><span className="text-gray-500">Balance</span> <span className="text-white">{o.balanceDate} {o.balanceAmt}</span></p>}
                          {o.shipDate&&<p><span className="text-gray-500">Shipped</span> <span className="text-white">{o.shipDate}</span></p>}
                          {o.eta&&<p><span className="text-gray-500">ETA</span> <span className="text-white">{o.eta}</span></p>}
                          {o.vessel&&<p><span className="text-gray-500">Vessel</span> <span className="text-white">{o.vessel}</span></p>}
                          {o.bookingNo&&<p><span className="text-gray-500">BKG</span> <span className="text-white">{o.bookingNo}</span></p>}
                        </div>
                        {/* L/C */}
                        {(o.lcOpenDate||o.lcAmt)&&<div className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3 mt-2">
                          <p className="text-cyan-400 text-xs font-semibold mb-1">🏦 Letter of Credit</p>
                          <div className="grid grid-cols-2 gap-1 text-[11px]">
                            {o.lcOpenDate&&<p><span className="text-gray-500">Open</span> <span className="text-white">{o.lcOpenDate}</span></p>}
                            {o.lcAmt&&<p><span className="text-gray-500">Amount</span> <span className="text-white">{o.lcAmt}</span></p>}
                            {o.lcShipDate&&<p><span className="text-gray-500">Latest Ship</span> <span className="text-white">{o.lcShipDate}</span></p>}
                            {o.lcDepartDate&&<p><span className="text-gray-500">Latest Depart</span> <span className="text-white">{o.lcDepartDate}</span></p>}
                            {o.docsDate&&<p><span className="text-gray-500">Docs Presented</span> <span className="text-white">{o.docsDate}</span></p>}
                            {o.lcPayDate&&<p><span className="text-gray-500">Payment Rec'd</span> <span className="text-white">{o.lcPayDate} {o.lcPayAmt}</span></p>}
                          </div>
                        </div>}
                        {(o.pis||[]).length>0&&<div className="flex flex-wrap gap-2 mt-2">{o.pis.map((p:any)=><span key={p.number} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-400">{p.number} {p.date}</span>)}</div>}
                        {(o.vins||[]).length>0&&<div className="mt-2"><span className="text-gray-500 text-[10px]">VINs:</span> <span className="text-xs text-gray-300 font-mono">{(o.vins||[]).join(', ')}</span></div>}
                      </div>
                    </details>
                  ))}
                </div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
