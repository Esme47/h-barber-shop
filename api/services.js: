import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {

  if (req.method === "GET") {
    const data = await sql`SELECT * FROM services ORDER BY id`;
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { id, nombre, precio, duracion } = req.body;

    await sql`
      UPDATE services
      SET nombre=${nombre},
          precio=${precio},
          duracion=${duracion}
      WHERE id=${id};
    `;

    return res.status(200).json({ ok:true });
  }

  res.status(405).end();
}
