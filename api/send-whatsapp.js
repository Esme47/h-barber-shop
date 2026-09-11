// Sends the appointment-confirmation template via the WhatsApp Business Cloud API.
// Needs three secrets set as Vercel Environment Variables (not in this file):
//   WHATSAPP_TOKEN      -> permanent access token from Meta Business Manager
//   WHATSAPP_PHONE_ID   -> the "Phone number ID" for +57 301 844 2704 in Meta's API setup
//   WHATSAPP_TEMPLATE    -> (optional) approved template name, defaults to 'cita_confirmada'
// Until those are set, this endpoint responds 501 and the booking flow simply
// skips the real send and keeps showing the in-app preview.

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const TEMPLATE = process.env.WHATSAPP_TEMPLATE || 'cita_confirmada';

  if (!TOKEN || !PHONE_ID) {
    return res.status(501).json({ error: 'WhatsApp aún no está configurado (faltan WHATSAPP_TOKEN / WHATSAPP_PHONE_ID)' });
  }

  const { to, clientName, barberName, dateLabel, time, service } = req.body || {};
  if (!to) return res.status(400).json({ error: 'Falta el número del cliente' });

  try {
    const resp = await fetch(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: TEMPLATE,
          language: { code: 'es_CO' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: clientName },
              { type: 'text', text: barberName },
              { type: 'text', text: dateLabel },
              { type: 'text', text: time },
              { type: 'text', text: service }
            ]
          }]
        }
      })
    });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data });
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
