const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const ADMIN_PIN = process.env.ADMIN_PIN;

function slugify(s){
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || ('x'+Date.now());
}

// Endpoint de clientes: siempre protegido con el PIN del barbero (los nombres y
// telefonos de clientes son datos sensibles, a diferencia de barberos/servicios
// que son publicos).
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pin = req.headers['x-admin-pin'];
  if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'PIN incorrecto' });

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT
          c.id, c.name, c.phone, c.created_at,
          (SELECT MAX(a.appt_date) FROM appointments a WHERE a.phone = c.phone AND a.status = 'pagada') AS last_visit,
          (SELECT COUNT(*)::int FROM appointments a WHERE a.phone = c.phone AND a.status = 'pagada') AS visits
        FROM clients c
        ORDER BY c.name`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, phone } = req.body || {};
      if (!name || !phone) return res.status(400).json({ error: 'Falta nombre o telefono' });
      const id = slugify(phone);
      await sql`INSERT INTO clients (id, name, phone) VALUES (${id}, ${name}, ${phone})
                 ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`;
      return res.status(200).json({ ok: true, id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
