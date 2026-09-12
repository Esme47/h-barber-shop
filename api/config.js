const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const ADMIN_PIN = process.env.ADMIN_PIN;

function slugify(s){
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || ('x'+Date.now());
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const all = req.query.all === '1';
      const barbers = all
        ? await sql`SELECT * FROM barbers ORDER BY sort_order`
        : await sql`SELECT * FROM barbers WHERE active = true ORDER BY sort_order`;
      const services = all
        ? await sql`SELECT * FROM services ORDER BY sort_order`
        : await sql`SELECT * FROM services WHERE active = true ORDER BY sort_order`;
      return res.status(200).json({ barbers, services });
    }

    if (req.method === 'POST') {
      const pin = req.headers['x-admin-pin'];
      if (pin !== ADMIN_PIN) return res.status(401).json({ error: 'PIN incorrecto' });

      const { entity, action, id, name, description, price } = req.body || {};

      if (entity === 'barber' && action === 'add') {
        const newId = slugify(id || name);
        const [{ n }] = await sql`SELECT count(*)::int AS n FROM barbers`;
        await sql`INSERT INTO barbers (id, name, active, sort_order) VALUES (${newId}, ${name}, true, ${n+1})
                   ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, active = true`;
        return res.status(200).json({ ok: true, id: newId });
      }
      if (entity === 'barber' && action === 'toggle') {
        await sql`UPDATE barbers SET active = NOT active WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
      if (entity === 'barber' && action === 'edit') {
        await sql`UPDATE barbers SET name = ${name} WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }

      if (entity === 'service' && action === 'add') {
        const newId = slugify(id || name);
        const [{ n }] = await sql`SELECT count(*)::int AS n FROM services`;
        await sql`INSERT INTO services (id, name, description, price, active, sort_order)
                   VALUES (${newId}, ${name}, ${description || ''}, ${price}, true, ${n+1})
                   ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, active = true`;
        return res.status(200).json({ ok: true, id: newId });
      }
      if (entity === 'service' && action === 'toggle') {
        await sql`UPDATE services SET active = NOT active WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }
      if (entity === 'service' && action === 'edit') {
        await sql`UPDATE services SET name = ${name}, description = ${description || ''}, price = ${price} WHERE id = ${id}`;
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'Solicitud inválida' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
