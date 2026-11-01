const { Pool } = require('pg');
const pool = new Pool({ host: '127.0.0.1', port: 5432, database: 'sinocv_crm', user: 'sinocv', password: 'crm2025pass' });
(async () => {
  const r = await pool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
  const data = r.rows[0].data;
  let count = 0;
  function walk(obj) {
    if (Array.isArray(obj)) { obj.forEach(walk); return; }
    if (obj && typeof obj === 'object') {
      if (obj.images && Array.isArray(obj.images)) {
        obj.images = obj.images.map(function (img) {
          const s = String(img);
          if (s.indexOf('/product_photos/') === 0) { count++; return s.replace('/product_photos/', '/api/photos/'); }
          return img;
        });
        return;
      }
      Object.values(obj).forEach(walk);
    }
  }
  walk(data);
  await pool.query('UPDATE products SET data=$1, updated_at=NOW() WHERE id=$2', [JSON.stringify(data), r.rows[0].id]);
  console.log('替换URL数:', count);
  process.exit(0);
})().catch(function (e) { console.error('错误:', e); process.exit(1); });
