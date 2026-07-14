// @ts-nocheck
'use client';
import { useState, useEffect, useCallback } from 'react';

const API = '/api/crm';

export default function CrmPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'info'|'orders'|'follow'>('info');
  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [followText, setFollowText] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch(API+'?action=all');
      if(r.ok){ const d = await r.json(); setContacts(d.contacts||[]); }
    } catch(e){}
  }, []);
  
  useEffect(() => { load(); const i = setInterval(load, 20000); return () => clearInterval(i); }, [load]);

  const openCustomer = (c: any) => {
    setSelected(c);
    setEditName(c.name||'');
    setEditCountry(c.country||'');
    setEditEmail(c.email||'');
    setEditCompany(c.company||'');
    setEditProduct(c.product||'');
    setEditNotes(c.notes||'');
    setTab('info');
  };

  const save = async () => {
    if(!selected) return;
    const data = { phone: selected.phone, name: editName, country: editCountry, email: editEmail, company: editCompany, product: editProduct, notes: editNotes };
    await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    load();
  };

  const addFollow = async () => {
    if(!selected||!followText.trim()) return;
    const fups = [...(selected.followUps||[]), { date: new Date().toISOString().split('T')[0], content: followText }];
    await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ phone: selected.phone, followUps: fups }) });
    setFollowText('');
    load();
  };

  const completeOrder = async (orderIdx: number) => {
    if(!selected) return;
    const orders = [...(selected.orders||[])];
    orders[orderIdx] = { ...orders[orderIdx], status: 'done' };
    await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ phone: selected.phone, orders }) });
    load();
  };

  const addOrder = async () => {
    if(!selected) return;
    const orders = [...(selected.orders||[]), { id: (selected.orders||[]).length+1, requirements:[], docs:[], status:'active' }];
    await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ phone: selected.phone, orders }) });
    load();
  };

  const filtered = search ? contacts.filter(c => (c.name||c.phone||'').toLowerCase().includes(search.toLowerCase()) || (c.country||'').toLowerCase().includes(search.toLowerCase())) : contacts;

  return (
    <div style={{display:'flex',height:'100vh',background:'#000'}}>
      {/* Sidebar */}
      <div style={{width:'320px',borderRight:'1px solid #1a1a1a',display:'flex',flexDirection:'column',background:'#0a0a0a'}}>
        <div style={{padding:'16px',borderBottom:'1px solid #1a1a1a'}}>
          <div style={{color:'#f59e0b',fontWeight:700,fontSize:'16px',marginBottom:'4px'}}>🚛 SINOCV CRM</div>
          <div style={{color:'#666',fontSize:'12px'}}>{contacts.length} 客户</div>
        </div>
        <div style={{padding:'8px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索客户..." style={{width:'100%',padding:'10px',borderRadius:'6px',border:'1px solid #1a1a1a',background:'#000',color:'#fff',fontSize:'13px',outline:'none'}} />
        </div>
        <div style={{flex:1,overflow:'auto',padding:'4px 8px'}}>
          {filtered.map(c => (
            <div key={c.phone} onClick={()=>openCustomer(c)} style={{padding:'10px 12px',borderRadius:'8px',marginBottom:'4px',cursor:'pointer',background:selected?.phone===c.phone?'#1a1a1a':'transparent',border:selected?.phone===c.phone?'1px solid #333':'1px solid transparent'}}>
              <div style={{fontWeight:600,fontSize:'13px',color:'#fff'}}>{c.name||c.phone}</div>
              <div style={{fontSize:'11px',color:'#666',marginTop:'2px'}}>{c.phone} · {c.country||'未知'} · {(c.orders||[]).length}单</div>
            </div>
          ))}
          {filtered.length===0&&<div style={{textAlign:'center',color:'#444',padding:'40px'}}>暂无客户数据</div>}
        </div>
      </div>

      {/* Detail */}
      <div style={{flex:1,overflow:'auto',background:'#0d0d0d'}}>
        {!selected ? (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#666',fontSize:'14px'}}>👈 选择客户查看详情</div>
        ) : (
          <div style={{padding:'24px',maxWidth:'700px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{color:'#fff',fontSize:'18px',margin:0}}>{selected.name||selected.phone}</h2>
              <button onClick={save} style={{padding:'8px 20px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#000',fontWeight:700,cursor:'pointer'}}>💾 保存</button>
            </div>

            <div style={{display:'flex',gap:'0',marginBottom:'20px',borderBottom:'1px solid #1a1a1a'}}>
              {['info','orders','follow'].map(t => (
                <button key={t} onClick={()=>setTab(t as any)} style={{padding:'8px 16px',border:'none',background:'none',color:tab===t?'#f59e0b':'#666',fontSize:'13px',cursor:'pointer',borderBottom:tab===t?'2px solid #f59e0b':'2px solid transparent'}}>
                  {t==='info'?'📋 信息':t==='orders'?'📦 订单':'📝 跟进'}
                </button>
              ))}
            </div>

            {tab==='info' && (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <div><label style={lbl}>手机号</label><div style={val}>{selected.phone}</div></div>
                <div><label style={lbl}>名称</label><input value={editName} onChange={e=>setEditName(e.target.value)} style={inp}/></div>
                <div><label style={lbl}>国家</label><input value={editCountry} onChange={e=>setEditCountry(e.target.value)} style={inp}/></div>
                <div><label style={lbl}>邮箱</label><input value={editEmail} onChange={e=>setEditEmail(e.target.value)} style={inp} placeholder="选填"/></div>
                <div><label style={lbl}>公司</label><input value={editCompany} onChange={e=>setEditCompany(e.target.value)} style={inp} placeholder="选填"/></div>
                <div><label style={lbl}>需求车型</label><input value={editProduct} onChange={e=>setEditProduct(e.target.value)} style={inp} placeholder="例如:HOWO 6×4 tractor"/></div>
                <div><label style={lbl}>备注</label><textarea value={editNotes} onChange={e=>setEditNotes(e.target.value)} style={{...inp,minHeight:'80px'}} placeholder="客户备注..."/></div>
              </div>
            )}

            {tab==='orders' && (
              <div>
                <button onClick={addOrder} style={{padding:'6px 14px',borderRadius:'4px',border:'1px solid #333',background:'none',color:'#f59e0b',cursor:'pointer',marginBottom:'12px',fontSize:'12px'}}>+ 新建订单</button>
                {(selected.orders||[]).map((o:any,i:number) => (
                  <div key={i} style={{border:'1px solid #1a1a1a',borderRadius:'8px',padding:'16px',marginBottom:'8px',background:'#111'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                      <b style={{color:'#fff'}}>📦 订单{i+1}</b>
                      <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'3px',background:o.status==='done'?'#064e3b':'#1a1200',color:o.status==='done'?'#34d399':'#f59e0b'}}>{o.status==='done'?'已完成':'进行中'}</span>
                    </div>
                    <div style={{fontSize:'12px',color:'#999'}}>
                      <div>车型: {o.vehicleType||'-'} | 品系: {o.brand||'-'} | 台数: {o.qty||'-'} | 颜色: {o.color||'-'}</div>
                      <div style={{marginTop:'4px'}}>金额: {o.totalAmt||'-'} | 订单号: {o.orderNo||'-'}</div>
                      <div>发运: {o.shipDate||'-'} | 到港: {o.eta||'-'}</div>
                    </div>
                    {o.status!=='done' && (
                      <button onClick={()=>completeOrder(i)} style={{marginTop:'8px',padding:'4px 12px',borderRadius:'4px',border:'none',background:'#f59e0b',color:'#000',fontWeight:600,fontSize:'12px',cursor:'pointer'}}>✅ 确认完成</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab==='follow' && (
              <div>
                <div style={{display:'flex',gap:'8px',marginBottom:'12px'}}>
                  <input value={followText} onChange={e=>setFollowText(e.target.value)} placeholder="新增跟进记录..." style={{...inp,flex:1}} onKeyDown={e=>e.key==='Enter'&&addFollow()}/>
                  <button onClick={addFollow} style={{padding:'8px 16px',borderRadius:'6px',border:'none',background:'#f59e0b',color:'#000',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>添加</button>
                </div>
                {(selected.followUps||[]).map((f:any,i:number) => (
                  <div key={i} style={{padding:'10px 0',borderBottom:'1px solid #111',fontSize:'13px'}}>
                    <span style={{color:'#666',marginRight:'8px'}}>📅 {f.date}</span>
                    <span style={{color:'#ccc'}}>{f.content}</span>
                  </div>
                ))}
                {(!selected.followUps||selected.followUps.length===0)&&<div style={{textAlign:'center',color:'#444',padding:'40px'}}>暂无跟进记录</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { width:'100%',padding:'10px 14px',borderRadius:'6px',border:'1px solid #1a1a1a',background:'#000',color:'#fff',fontSize:'13px',outline:'none' };
const lbl: React.CSSProperties = { fontSize:'11px',color:'#666',display:'block',marginBottom:'4px' };
const val: React.CSSProperties = { color:'#999',fontSize:'13px',padding:'10px 0' };
