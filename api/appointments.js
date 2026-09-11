const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
const ADMIN_PIN = process.env.ADMIN_PIN;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { date, barber } = req.query;
      let rows;
      if (date && barber) {
        rows = await sql`SELECT * FROM appointments WHERE appt_date = ${date} AND barber_id = ${barber} AND status <> 'cancelada' ORDER BY appt_time`;
      } else if (date) {
        rows = await sql`SELECT * FROM appointments WHERE appt_date = ${date} ORDER BY appt_time`;
      } else {
        rows = await sql`SELECT * FROM appointments ORDER BY appt_date, appt_time`;
      }
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
      await sql`INSERT INTO appointments (id, barber_id, barber_name, service, price, appt_date, date_label, appt_time, client, phone, status)
                VALUES (${id}, ${b.barber_id}, ${b.barber_name}, ${b.service}, ${b.price}, ${b.date}, ${b.date_label}, ${b.time}, ${b.client}, ${b.phone}, 'pendiente')`;
      return res.status(200).json({ id });
    }

    // PATCH and DELETE are admin actions: require the shop PIN
    if (req.method === 'PATCH' || req.method === 'DELETE') {
      const pin = req.headers['x-admin-pin'];
      if (pin !== ADMIN_PIN) {
        return res.status(401).json({ error: 'PIN incorrecto' });
      }
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body || {};
      await sql`UPDATE appointments SET status = ${status} WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM appointments WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
