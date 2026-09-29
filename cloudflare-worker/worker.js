/**
 * Cloudflare Worker — receives the portfolio contact form and sends it
 * by email via Resend (https://resend.com), without needing Vercel or
 * any change to how the site itself is hosted (GitHub Pages stays as is).
 *
 * DEPLOY (no GitHub / no CLI needed):
 * 1. Go to dash.cloudflare.com -> Workers & Pages -> Create -> "Create Worker".
 * 2. Give it a name (e.g. "portfolio-contact"), click "Deploy" with the default code.
 * 3. Click "Edit code", delete everything, paste this whole file, click "Deploy".
 * 4. Go to Settings -> Variables and Secrets -> Add -> name it RESEND_API_KEY,
 *    paste your Resend API key, mark it as "Secret", then Save and redeploy.
 * 5. Copy the Worker's URL (looks like https://portfolio-contact.YOURNAME.workers.dev)
 *    and paste it as CONTACT_ENDPOINT at the top of script.js on the site.
 */

const TO_EMAIL = 'fofanamalika1224@gmail.com';
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

/* Set this to your exact site origin once you know it (e.g. "https://malikafofana.github.io")
   for tighter security, or leave as "*" to accept requests from anywhere. */
const ALLOWED_ORIGIN = '*';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

function json(data, status) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : ''; /* honeypot */

    /* silent bot trap: if the hidden field is filled, pretend success without sending anything */
    if (company) {
      return json({ ok: true }, 200);
    }

    if (!name || !email || !message) {
      return json({ error: 'Missing fields' }, 400);
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return json({ error: 'Fields too long' }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'Invalid email' }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: 'Server not configured' }, 500);
    }

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [TO_EMAIL],
          reply_to: email,
          subject: `Nouveau message de ${name} via le portfolio`,
          text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<p><strong>Nom :</strong> ${escapeHtml(name)}</p><p><strong>Email :</strong> ${escapeHtml(email)}</p><p><strong>Message :</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
        })
      });

      if (!resendRes.ok) {
        return json({ error: 'Email send failed' }, 502);
      }

      return json({ ok: true }, 200);
    } catch (err) {
      return json({ error: 'Server error' }, 500);
    }
  }
};
