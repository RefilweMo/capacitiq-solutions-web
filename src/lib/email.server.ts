/**
 * Server-only Resend email helper.
 * Uses the connector gateway with LOVABLE_API_KEY + RESEND_API_KEY.
 */
const FROM = "Capacitiq <noreply@capacitiq.co.za>";
const GATEWAY = "https://connector-gateway.lovable.dev/resend";

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY missing");
  if (!resendKey) throw new Error("RESEND_API_KEY missing");

  const res = await fetch(`${GATEWAY}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.reply_to,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend send failed:", res.status, text);
    throw new Error(`Email send failed (${res.status})`);
  }
  return res.json();
}

export function emailLayout(content: string) {
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#e8edf0;padding:32px;color:#0e1417">
    <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,.05)">
      <div style="margin-bottom:24px"><strong style="font-size:20px;color:#0b4650">Capacitiq</strong></div>
      ${content}
      <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8eb"/>
      <p style="font-size:12px;color:#4b5560">Capacitiq · B-BBEE Level 1 · Cape Town, South Africa<br/>
      <a href="https://wa.me/27640620354" style="color:#0b4650">WhatsApp</a> · hello@capacitiq.co.za</p>
    </div></body></html>`;
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
