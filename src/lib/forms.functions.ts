import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail, emailLayout, escapeHtml } from "./email.server";
import { TEMPLATE_LICENCE } from "./licence";

const INTERNAL_TO = "hello@capacitiq.co.za";

/* -------------------- Contact -------------------- */
export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      phone: z.string().max(40).optional().or(z.literal("")),
      company: z.string().max(160).optional().or(z.literal("")),
      message: z.string().min(5).max(4000),
    }).parse,
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("submissions").insert({
      kind: "contact",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      payload: { company: data.company || null, message: data.message },
    });

    await sendEmail({
      to: INTERNAL_TO,
      subject: `New contact: ${data.name}`,
      reply_to: data.email,
      html: emailLayout(`
        <h2 style="margin:0 0 16px">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
        ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `),
    });

    await sendEmail({
      to: data.email,
      subject: "Thanks for reaching out to Capacitiq",
      html: emailLayout(`
        <h2 style="margin:0 0 16px">Thanks, ${escapeHtml(data.name)}.</h2>
        <p>We've received your message and will get back to you within one business day.</p>
        <p>If it's urgent, message us on <a href="https://wa.me/27640620354">WhatsApp</a>.</p>
        <p>— The Capacitiq team</p>
      `),
    });

    return { ok: true };
  });

/* -------------------- Spotter -------------------- */
export const sendSpotterReferral = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      spotter_name: z.string().min(1).max(120),
      spotter_email: z.string().email(),
      spotter_phone: z.string().max(40).optional().or(z.literal("")),
      lead_name: z.string().min(1).max(160),
      lead_company: z.string().max(160).optional().or(z.literal("")),
      lead_contact: z.string().min(1).max(200),
      lead_aware: z.string().max(20).optional().or(z.literal("")),
      notes: z.string().max(2000).optional().or(z.literal("")),
    }).parse,
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("submissions").insert({
      kind: "spotter",
      name: data.spotter_name,
      email: data.spotter_email,
      phone: data.spotter_phone || null,
      payload: data,
    });

    await sendEmail({
      to: INTERNAL_TO,
      reply_to: data.spotter_email,
      subject: `New Spotter referral from ${data.spotter_name}`,
      html: emailLayout(`
        <h2 style="margin:0 0 16px">New Spotter referral</h2>
        <p><strong>Spotter:</strong> ${escapeHtml(data.spotter_name)} (${escapeHtml(data.spotter_email)})</p>
        ${data.spotter_phone ? `<p><strong>Spotter phone:</strong> ${escapeHtml(data.spotter_phone)}</p>` : ""}
        <hr/>
        <p><strong>Lead:</strong> ${escapeHtml(data.lead_name)}</p>
        ${data.lead_company ? `<p><strong>Company:</strong> ${escapeHtml(data.lead_company)}</p>` : ""}
        <p><strong>Contact:</strong> ${escapeHtml(data.lead_contact)}</p>
        ${data.notes ? `<p><strong>Notes:</strong><br/>${escapeHtml(data.notes)}</p>` : ""}
      `),
    });

    await sendEmail({
      to: data.spotter_email,
      subject: "Capacitiq Spotter — referral received",
      html: emailLayout(`
        <h2 style="margin:0 0 16px">Thanks, ${escapeHtml(data.spotter_name)}.</h2>
        <p>We've logged your referral for <strong>${escapeHtml(data.lead_name)}</strong>. Our team will reach out within 48 hours and let you know the outcome.</p>
        <p>You earn commission on every deal that closes — we'll keep you posted.</p>
      `),
    });

    return { ok: true };
  });

/* -------------------- Pricing guide gate -------------------- */
export const sendPricingGuideLead = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      company: z.string().max(160).optional().or(z.literal("")),
    }).parse,
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("submissions").insert({
      kind: "pricing_guide",
      name: data.name,
      email: data.email,
      payload: { company: data.company || null },
    });

    await sendEmail({
      to: data.email,
      subject: "Your Capacitiq Pricing Guide",
      html: emailLayout(`
        <h2 style="margin:0 0 16px">Here's your Pricing Guide</h2>
        <p>Hi ${escapeHtml(data.name)}, thanks for downloading. Click below to access the guide.</p>
        <p><a href="https://capacitiq.co.za/pricing-guide.pdf" style="display:inline-block;background:#0b4650;color:#f4fbf9;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">Download the guide (PDF)</a></p>
        <p>Have questions? Reply to this email or message us on <a href="https://wa.me/27640620354">WhatsApp</a>.</p>
      `),
    });

    await sendEmail({
      to: INTERNAL_TO,
      subject: `Pricing guide downloaded: ${data.name}`,
      html: emailLayout(`<p>${escapeHtml(data.name)} (${escapeHtml(data.email)})${data.company ? ` — ${escapeHtml(data.company)}` : ""}</p>`),
    });

    return { ok: true };
  });

/* -------------------- Career application -------------------- */
export const sendCareerApplication = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      role_title: z.string().min(1).max(200),
      name: z.string().min(1).max(120),
      email: z.string().email(),
      phone: z.string().max(40).optional().or(z.literal("")),
      portfolio_url: z.string().url().optional().or(z.literal("")),
      cover_letter: z.string().min(10).max(4000),
    }).parse,
  )
  .handler(async ({ data }) => {
    await supabaseAdmin.from("submissions").insert({
      kind: "career",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      payload: data,
    });

    await sendEmail({
      to: INTERNAL_TO,
      reply_to: data.email,
      subject: `Application: ${data.role_title} — ${data.name}`,
      html: emailLayout(`
        <h2 style="margin:0 0 16px">New application</h2>
        <p><strong>Role:</strong> ${escapeHtml(data.role_title)}</p>
        <p><strong>Name:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
        ${data.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${escapeHtml(data.portfolio_url)}">${escapeHtml(data.portfolio_url)}</a></p>` : ""}
        <p><strong>Cover letter:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(data.cover_letter)}</p>
      `),
    });

    await sendEmail({
      to: data.email,
      subject: `Capacitiq — application received for ${data.role_title}`,
      html: emailLayout(`
        <h2 style="margin:0 0 16px">Thanks, ${escapeHtml(data.name)}.</h2>
        <p>We've received your application for <strong>${escapeHtml(data.role_title)}</strong>. If your profile is a match, we'll be in touch within two weeks.</p>
      `),
    });

    return { ok: true };
  });

/* -------------------- Template order -------------------- */
export const sendTemplateOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      template_ids: z.array(z.string().uuid()).min(1).max(20),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("templates")
      .select("id,name,price_cents,canva_link")
      .in("id", data.template_ids)
      .eq("active", true);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new Error("No templates found");

    const totalCents = rows.reduce((s, r) => s + (r.price_cents ?? 0), 0);

    await supabaseAdmin.from("submissions").insert({
      kind: "template_order",
      name: data.name,
      email: data.email,
      payload: {
        items: rows.map((r) => ({ id: r.id, name: r.name, price_cents: r.price_cents })),
        total_cents: totalCents,
      },
    });

    const itemsHtml = rows
      .map(
        (r) => `
        <div style="margin:16px 0;padding:16px;border:1px solid #e2e8eb;border-radius:16px">
          <p style="margin:0 0 8px;font-weight:600;font-size:16px">${escapeHtml(r.name)}</p>
          <p style="margin:0 0 12px;color:#4b5560;font-size:13px">A Canva account is required to access this template.</p>
          <a href="${escapeHtml(r.canva_link)}" style="display:inline-block;background:#e6ff2b;color:#0e1417;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:600">Open in Canva</a>
        </div>`,
      )
      .join("");

    await sendEmail({
      to: data.email,
      subject: "Your Capacitiq Template — Here's Your Download Link",
      html: emailLayout(`
        <h2 style="margin:0 0 16px">Thanks for your order, ${escapeHtml(data.name)}.</h2>
        <p>Click the button(s) below to open each template in Canva.</p>
        ${itemsHtml}
        <h3 style="margin:24px 0 8px;font-size:14px">Licence</h3>
        <p style="font-size:12px;color:#4b5560;line-height:1.6">${escapeHtml(TEMPLATE_LICENCE)}</p>
      `),
    });

    await sendEmail({
      to: INTERNAL_TO,
      subject: `Template order: ${data.name} — R${(totalCents / 100).toFixed(0)}`,
      html: emailLayout(`
        <h2 style="margin:0 0 16px">New template order</h2>
        <p><strong>Customer:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
        <p><strong>Total:</strong> R${(totalCents / 100).toFixed(0)}</p>
        <ul>${rows.map((r) => `<li>${escapeHtml(r.name)} — R${((r.price_cents ?? 0) / 100).toFixed(0)}</li>`).join("")}</ul>
      `),
    });

    return { ok: true, total_cents: totalCents };
  });
