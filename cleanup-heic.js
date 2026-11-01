const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const decode = require('heic-decode');
const sharp = require('sharp');

const pool = new Pool({ host: '127.0.0.1', port: 5432, database: 'sinocv_crm', user: 'sinocv', password: 'crm2025pass' });

(async () => {
  const r = await pool.query('SELECT id, data FROM products ORDER BY id DESC LIMIT 1');
  const data = r.rows[0].data;
  const dir = path.join('/opt/truck-export/public', 'product_photos');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let count = 0;

  async function walk(obj) {
    if (Array.isArray(obj)) { for (const v of obj) await walk(v); return; }
    if (obj && typeof obj === 'object') {
      if (obj.images && Array.isArray(obj.images)) {
        for (let i = 0; i < obj.images.length; i++) {
          const s = String(obj.images[i]);
          const m = s.match(/^data:image\/(\w+);base64,(.+)$/);
          if (m && (m[1].toLowerCase() === 'heic' || m[1].toLowerCase() === 'heif')) {
            const buf = Buffer.from(m[2], 'base64');
            const filename = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.jpg';
            try {
              const decoded = await decode({ buffer: buf });
              await sharp(Buffer.from(decoded.data), { raw: { width: decoded.width, height: decoded.height, channels: 4 } })
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(path.join(dir, filename));
              obj.images[i] = '/api/photos/' + filename;
              count++;
            } catch (e) {
              console.error('HEIC 转换失败:', e.message);
            }
          }
        }
        return;
      }
      for (const v of Object.values(obj)) await walk(v);
    }
  }
  await walk(data);
  await pool.query('UPDATE products SET data=$1, updated_at=NOW() WHERE id=$2', [JSON.stringify(data), r.rows[0].id]);
  console.log('HEIC 转换完成:', count);
  process.exit(0);
})().catch(e => { console.error('错误:', e); process.exit(1); });
