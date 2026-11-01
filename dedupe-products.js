const { Client } = require('pg');
const client = new Client({ host:'127.0.0.1', port:5432, user:'sinocv', password:'crm2025pass', database:'sinocv_crm' });

(async () => {
  await client.connect();
  const res = await client.query('SELECT id, data FROM products WHERE id = 1');
  const row = res.rows[0];
  const data = row.data || {};
  let removed = 0, total = 0;

  for (const ct in data) {
    for (const bn in (data[ct]||{})) {
      for (const cn in (data[ct][bn]||{})) {
        for (const dn in (data[ct][bn][cn]||{})) {
          const items = data[ct][bn][cn][dn] || [];
          const seen = {};
          const deduped = [];
          items.forEach(p => {
            total++;
            const key = JSON.stringify({ n:(p.name||p.model||''), fob:(p.fob||''), imgs:(p.images||[]) });
            if (!seen[key]) { seen[key] = true; deduped.push(p); }
            else { removed++; console.log('  删除重复:', ct, '/', bn, '/', cn, '/', dn, '/', (p.name||p.model||'')); }
          });
          data[ct][bn][cn][dn] = deduped;
        }
      }
    }
  }

  await client.query('UPDATE products SET data = $1 WHERE id = $2', [JSON.stringify(data), row.id]);
  console.log('完成：总产品', total, '个，删除重复', removed, '个，剩余', total - removed, '个');
  await client.end();
})().catch(e => { console.error('错误:', e.message); process.exit(1); });
