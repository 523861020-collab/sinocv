const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ host: '127.0.0.1', port: 5432, database: 'sinocv_crm', user: 'sinocv', password: 'crm2025pass' });

(async () => {
  const r = await pool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
  if (!r.rows.length) { console.log('无产品数据'); process.exit(0); }
  const data = r.rows[0].data;
  const dir = path.join('/opt/truck-export/public', 'product_photos');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let count = 0;

  function walk(obj) {
    if (Array.isArray(obj)) { obj.forEach(walk); return; }
    if (obj && typeof obj === 'object') {
      if (obj.images && Array.isArray(obj.images)) {
        obj.images = obj.images.map(function (img) {
          const m = String(img).match(/^data:image\/(\w+);base64,(.+)$/);
          if (m) {
            const ext = m[1] === 'png' ? 'png' : 'jpg';
            const buf = Buffer.from(m[2], 'base64');
            const fn = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
            fs.writeFileSync(path.join(dir, fn), buf);
            count++;
            return '/product_photos/' + fn;
          }
          return img;
        });
        return;
      }
      Object.values(obj).forEach(walk);
    }
  }
  walk(data);
  await pool.query('UPDATE products SET data=$1, updated_at=NOW() WHERE id=$2', [JSON.stringify(data), r.rows[0].id]);
  const before = JSON.stringify(r.rows[0].data).length;
  const after = JSON.stringify(data).length;
  console.log('转换照片数:', count);
  console.log('数据大小: ' + (before / 1024 / 1024).toFixed(2) + 'MB -> ' + (after / 1024 / 1024).toFixed(2) + 'MB');
  process.exit(0);
})().catch(function (e) { console.error('错误:', e); process.exit(1); });
