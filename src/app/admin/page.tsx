'use client';

import { useState, useEffect, useCallback } from 'react';

const API = '/api/crm';
const USERS = ['Li Shanlong', 'Sales 1', 'Sales 2', 'Sales 3', 'Sales 4'];
const PINS: Record<string,string> = {'Li Shanlong':'1234','Sales 1':'1111','Sales 2':'2222','Sales 3':'3333','Sales 4':'4444'};

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
  const [loading, setLoading] = useState(false);

  const isAdmin = user === 'Li Shanlong';
  const myContacts = isAdmin ? contacts : contacts.filter(c => !c.owner || c.owner === user);

  const loadContacts = useCallback(async () => {
    try { const r = await fetch(API+'?action=all'); if(r.ok){const d=await r.json();setContacts(d.contacts||[])} } catch(e){}
  }, []);

  useEffect(() => { if(loggedIn) { loadContacts(); const i=setInterval(loadContacts,20000); return ()=>clearInterval(i); } }, [loggedIn, loadContacts]);

  function doLogin(){
    if(!user||!pin){setErr('Select user and enter PIN');return}
    if(PINS[user]!==pin){setErr('Wrong PIN');return}
    setLoggedIn(true);setErr('');
  }

  if(!loggedIn) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-80 text-center">
        <div className="text-3xl mb-4">🚛</div>
        <h2 className="text-amber-500 font-bold text-lg mb-6">SINOCV CRM</h2>
        <select value={user} onChange={e=>setUser(e.target.value)} className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm">
          <option value="">Select user</option>
          {USERS.map(u=><option key={u} value={u}>{u==='Li Shanlong'?'👑 ':''}{u}</option>)}
        </select>
        <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN" className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm text-center" maxLength={6} onKeyDown={e=>e.key==='Enter'&&doLogin()} />
        {err&&<p className="text-red-500 text-xs mb-2">{err}</p>}
        <button onClick={doLogin} className="w-full bg-amber-500 text-black font-bold py-2 rounded hover:bg-amber-400">Login</button>
      </div>
    </div>
  );

  // Stats
  const mc = myContacts;
  const total = mc.length;
  const a = mc.filter(c=>c.category==='A').length;
  const b = mc.filter(c=>c.category==='B').length;
  const cc = mc.filter(c=>c.category==='C').length;
  const orders = mc.flatMap(c=>(c.orders||[]).map(o=>({...o,name:c.name||c.phone,phone:c.phone})));
  const totalOrders = orders.length;
  const pis = orders.flatMap(o=>o.pis||[]).length;
  const shipped = orders.filter(o=>o.status==='shipped').length;
  const overdue = mc.filter(c=>c.nextFollowUp&&c.nextFollowUp<=new Date().toISOString().split('T')[0]).length;

  // Country distribution
  const cmap: Record<string,number>={};
  mc.forEach(c=>{const co=c.country||'Unknown';cmap[co]=(cmap[co]||0)+1});
  const cSorted = Object.entries(cmap).sort((a,b)=>b[1]-a[1]);

  // Daily stats
  const today = new Date().toISOString().split('T')[0];
  const wkStart = (()=>{const d=new Date();d.setDate(d.getDate()-d.getDay());return d.toISOString().split('T')[0]})();
  const moStart = new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().split('T')[0];
  function statsFor(owner:string){
    const cs=mc.filter(c=>c.owner===owner);
    return {
      owner,
      todayChats:cs.filter(c=>c.firstSeen?.startsWith(today)).length,
      weekChats:cs.filter(c=>c.firstSeen>=wkStart).length,
      monthChats:cs.filter(c=>c.firstSeen>=moStart).length,
      todayPIs:cs.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date===today))).length,
      weekPIs:cs.flatMap(c=>(c.orders||[]).flatMap((o:any)=>(o.pis||[]).filter((p:any)=>p.date>=wkStart))).length,
    };
  }

  let filtered = filter==='all'?mc:mc.filter(c=>c.category===filter);
  if(search) filtered = filtered.filter(c=>(c.name||''+c.phone||''+c.company||'').toLowerCase().includes(search.toLowerCase()));

  function exportCSV(){
    let csv='Owner,Name,Phone,Country,Category,Order#,Status,Total,Currency,Payment,Vessel,ETA,VINs\n';
    mc.forEach((c:any)=>{(c.orders||[]).forEach((o:any)=>{csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},${o.orderNo||''},${o.status||''},${o.totalAmt||''},${o.currency||''},${o.paymentMethod||''},${o.vessel||''},${o.eta||''},${(o.vins||[]).join(';')}\n`})});
    if(!mc.some((c:any)=>(c.orders||[]).length>0)) mc.forEach((c:any)=>{csv+=`${c.owner||''},${c.name||''},${c.phone||''},${c.country||''},${c.category||''},,,,\n`});
    const b=new Blob(['\uFEFF'+csv],{type:'text/csv'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='sinocv_export.csv';a.click();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4">
        <h1 className="text-amber-500 font-bold">🚛 SINOCV CRM</h1>
        <span className="text-gray-400 text-sm">{isAdmin?'👑 ':''}{user}</span>
        <button onClick={exportCSV} className="ml-auto bg-amber-500 text-black text-xs px-3 py-1 rounded font-bold">📥 Export</button>
        <button onClick={()=>{setLoggedIn(false);setUser('');setPin('')}} className="text-gray-500 text-xs hover:text-white">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {['dash','contacts'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-6 py-2 text-sm font-bold ${tab===t?'text-amber-500 border-b-2 border-amber-500':'text-gray-400 hover:text-white'}`}>{t==='dash'?'📊 Dashboard':'📋 Contacts'}</button>
        ))}
      </div>

      {tab==='dash' && (
        <div className="p-6 max-w-5xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[[total,'Contacts'],[a,'A-Class'],[b,'B-Class'],[cc,'C-Class'],[totalOrders,'Orders'],[pis,'PIs'],[shipped,'Shipped'],[overdue,'⚠️ Overdue']].map(([n,l],i)=><div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center"><div className="text-2xl font-bold text-amber-500">{n}</div><div className="text-xs text-gray-400">{l}</div></div>)}
          </div>

          {/* Country Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-bold mb-3">🌍 By Country ({total})</h3>
            {cSorted.slice(0,10).map(([co,n])=>(
              <div key={co} className="flex items-center gap-2 mb-1 text-xs">
                <span className="w-20 text-right text-gray-400">{co}</span>
                <div className="flex-1 bg-gray-800 rounded h-4"><div className="bg-amber-500 rounded h-4" style={{width:Math.max((n/total)*100,1)+'%'}}></div></div>
                <span className="w-10 font-bold">{Math.round((n/total)*100)}%</span>
              </div>
            ))}
          </div>

          {/* Daily Performance */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-bold mb-3">📊 Daily Performance</h3>
            <table className="w-full text-xs">
              <thead><tr className="text-gray-400"><th className="text-left">Salesperson</th><th>Today</th><th>PI</th><th>Week</th><th>PI</th><th>Month</th></tr></thead>
              <tbody>
                {USERS.map(u=>{const s=statsFor(u);return(
                  <tr key={u} className="border-t border-gray-800"><td className="py-1 font-bold">{u}</td><td className="text-center">{s.todayChats}</td><td className="text-center text-amber-500">{s.todayPIs}</td><td className="text-center">{s.weekChats}</td><td className="text-center text-amber-500">{s.weekPIs}</td><td className="text-center">{s.monthChats}</td></tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='contacts' && (
        <div className="p-4 max-w-5xl mx-auto">
          <div className="flex gap-3 mb-4">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-white text-sm" />
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="p-2 rounded bg-gray-900 border border-gray-700 text-white text-sm">
              <option value="all">All</option><option value="A">A</option><option value="B">B</option><option value="C">C</option>
            </select>
          </div>
          <div className="space-y-2">
            {filtered.map(c=>{
              const cls = c.category?'badge badge-'+c.category.toLowerCase():'badge badge-new';
              const dl = c.nextFollowUp?Math.ceil((new Date(c.nextFollowUp)-Date.now())/86400000):null;
              return (
                <div key={c.phone} onClick={()=>setSelected(c)} className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:border-amber-500/50 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{c.name||c.phone} {c.category&&<span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${c.category==='A'?'bg-purple-600':c.category==='B'?'bg-blue-600':'bg-gray-600'} text-white`}>{c.category}</span>}
                      {dl!==null&&dl<=0&&' ⚠️'}
                      {isAdmin&&c.owner&&<span className="ml-2 text-gray-500 text-xs">·{c.owner}</span>}
                    </div>
                    <div className="text-gray-500 text-xs">{c.phone} {c.country?'· '+c.country:''} {(c.orders||[]).length?'· 📦'+(c.orders||[]).length:''}</div>
                  </div>
                </div>
              );
            })}
            {filtered.length===0&&<p className="text-gray-500 text-center py-8">No contacts</p>}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="w-full max-w-lg bg-gray-950 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-3 flex items-center gap-3">
              <button onClick={()=>setSelected(null)} className="text-gray-400 text-lg">←</button>
              <h2 className="font-bold flex-1">{selected.name||selected.phone}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${selected.category==='A'?'bg-purple-600':selected.category==='B'?'bg-blue-600':selected.category==='C'?'bg-gray-600':'bg-amber-500 text-black'}`}>{selected.category||'NEW'}</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-500 text-xs">Phone</label><div className="text-white">{selected.phone}</div></div>
                <div><label className="text-gray-500 text-xs">Country</label><div className="text-white">{selected.country||'-'}</div></div>
                <div><label className="text-gray-500 text-xs">Email</label><div className="text-white">{selected.email||'-'}</div></div>
                <div><label className="text-gray-500 text-xs">Product</label><div className="text-white">{selected.product||'-'}</div></div>
              </div>
              {selected.notes && <div><label className="text-gray-500 text-xs">Notes</label><div className="text-white">{selected.notes}</div></div>}
              
              {selected.nextFollowUp && <div className="bg-gray-900 border border-gray-800 rounded p-2 text-xs flex justify-between"><span className="text-amber-500">Next: {selected.nextFollowUp}</span></div>}

              {(selected.orders||[]).length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-500 mb-2">📦 Orders ({(selected.orders||[]).length})</h4>
                  {(selected.orders||[]).map((o:any,i:number)=>(
                    <details key={i} className="bg-gray-900 border border-gray-800 rounded-lg mb-2">
                      <summary className="p-2 cursor-pointer font-bold text-xs">Order #{i+1} {o.orderNo||''} <span className={`ml-1 px-1 rounded text-[9px] ${o.status==='shipped'?'bg-green-800 text-green-300':o.status==='delivered'?'bg-gray-700':'bg-amber-800 text-amber-300'}`}>{o.status||'pending'}</span></summary>
                      <div className="p-3 border-t border-gray-800 text-xs space-y-1">
                        {o.requirements&&<p><span className="text-gray-500">Req:</span> {o.requirements}</p>}
                        {o.totalAmt&&<p><span className="text-gray-500">Total:</span> {o.totalAmt} {o.currency||'USD'}</p>}
                        {o.paymentMethod&&<p><span className="text-gray-500">Payment:</span> {o.paymentMethod} {o.paymentMethod==='LC'&&o.lcAmt?`(L/C: ${o.lcAmt})`:''}</p>}
                        {o.depositDate&&<p><span className="text-gray-500">Deposit:</span> {o.depositDate} {o.depositAmt||''}</p>}
                        {o.balanceDate&&<p><span className="text-gray-500">Balance:</span> {o.balanceDate} {o.balanceAmt||''}</p>}
                        {o.lcOpenDate&&<p><span className="text-gray-500">L/C Open:</span> {o.lcOpenDate} · Ship:{o.lcShipDate} · Depart:{o.lcDepartDate}</p>}
                        {o.lcPayDate&&<p><span className="text-gray-500">L/C Paid:</span> {o.lcPayDate} {o.lcPayAmt||''}</p>}
                        {(o.pis||[]).length>0&&<p><span className="text-gray-500">PIs:</span> {(o.pis||[]).map((p:any)=><span key={p.number} className="text-amber-500 mr-2">{p.number} {p.date||''}</span>)}</p>}
                        {o.shipDate&&<p><span className="text-gray-500">Ship:</span> {o.shipDate} · ETA:{o.eta||'?'}</p>}
                        {o.vessel&&<p><span className="text-gray-500">Vessel:</span> {o.vessel} · BKG:{o.bookingNo||''}</p>}
                        {(o.vins||[]).length>0&&<p><span className="text-gray-500">VINs:</span> {(o.vins||[]).join(', ')}</p>}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
