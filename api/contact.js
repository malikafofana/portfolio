/**
 * Vercel serverless function — receives the portfolio contact form
 * and sends it by email via Resend (https://resend.com).
 *
 * Requires an environment variable RESEND_API_KEY to be set in the
 * Vercel project (Settings -> Environment Variables). Never commit
 * the real API key to git.
 */

const TO_EMAIL = 'fofanamalika1224@gmail.com';
const FROM_EMAIL = 'Portfolio Contact <onboarding@resend.dev>';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : ''; /* honeypot */

  /* silent bot trap: if the hidden field is filled, pretend success without sending anything */
  if (company) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    res.status(400).json({ error: 'Fields too long' });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
      const errText = await resendRes.text();
      console.error('Resend error:', resendRes.status, errText);
      res.status(502).json({ error: 'Email send failed' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
