const { Client } = require('pg');
const client = new Client({
  host: '127.0.0.1', port: 5432, user: 'sinocv',
  password: 'crm2025pass', database: 'sinocv_crm'
});

function deepMerge(target, source) {
  for (const k in source) {
    const sv = source[k];
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      if (!target[k] || typeof target[k] !== 'object' || Array.isArray(target[k])) target[k] = {};
      deepMerge(target[k], sv);
    } else if (Array.isArray(sv)) {
      if (!Array.isArray(target[k])) target[k] = [];
      sv.forEach(p => {
        const dup = target[k].some(e => ((e.name||e.model||'')===(p.name||p.model||'')) && ((e.fob||'')===(p.fob||'')));
        if (!dup) target[k].push(p);
      });
    } else {
      target[k] = sv;
    }
  }
  return target;
}

(async () => {
  await client.connect();
  const res = await client.query('SELECT id, data FROM products WHERE id = 1');
  const row = res.rows[0];
  const data = row.data || {};
  const shaTe = data['沙特'];
  if (!shaTe) { console.log('没有"沙特"key，无需合并'); await client.end(); return; }
  const merged = deepMerge(data['沙特阿拉伯'] || {}, shaTe);
  data['沙特阿拉伯'] = merged;
  delete data['沙特'];
  await client.query('UPDATE products SET data = $1 WHERE id = $2', [JSON.stringify(data), row.id]);
  const v = await client.query('SELECT data FROM products WHERE id = $1', [row.id]);
  const nd = v.rows[0].data;
  console.log('合并完成');
  console.log('"沙特"key 还存在吗:', '沙特' in nd);
  console.log('"沙特阿拉伯" 下的品牌:', Object.keys(nd['沙特阿拉伯'] || {}).join(', '));
  await client.end();
})().catch(e => { console.error('错误:', e.message); process.exit(1); });
