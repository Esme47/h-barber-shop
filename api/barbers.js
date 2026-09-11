import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const data = await sql`SELECT * FROM barbers ORDER BY id`;
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { nombre, telefono, especialidad } = req.body;

    await sql`
      INSERT INTO barbers (nombre, telefono, especialidad)
      VALUES (${nombre}, ${telefono}, ${especialidad});
    `;

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
