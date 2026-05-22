
# Capacitiq — Final Build (Locked)

Approved. Executing in one push.

## GA4 — locked

Hardcoded `G-GE3KNS77P6` injected immediately after `<head>` in `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GE3KNS77P6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-GE3KNS77P6', { send_page_view: false });
</script>
```

`useAnalytics` hook fires `page_view` on every TanStack route change. Custom events: `cta_click`, `form_start`, `form_submit`, `spotter_modal_open`, `template_added_to_cart`, `checkout_started`, `payment_completed`, `exit_intent_shown`, `exit_intent_converted`.

## Secrets to request at build start
- `YOCO_SECRET_KEY`
- `VITE_YOCO_PUBLIC_KEY`

(GA4 is hardcoded — no env needed. Resend / Supabase already present.)

## Single migration

- `blog_posts`: add `status` (draft|scheduled|published), `scheduled_for timestamptz`; backfill from existing `published` bool; index `(status, scheduled_for)`.
- `CREATE TABLE template_waitlist (id, email, suggestion, created_at)` + RLS (anon insert; admin select/delete).
- `CREATE TABLE orders (id, customer_email, customer_name, items jsonb, amount_in_cents int, yoco_charge_id, status default 'pending', created_at)` + RLS (admin select only).
- `CREATE TABLE waitlist_notifications (id, template_id, sent_count, sent_at)`.
- 7 security fixes (legal_pages + profiles RLS tightening, replace permissive `true` policies with `has_role`-gated, `submissions` insert policy, `revoke select(canva_link) on templates`, SECURITY DEFINER audit).
- Seed `legal_pages` (5 verbatim).
- Seed `templates` (5 verbatim — names, descriptions, R249, preview URLs, canva_links, status=published).
- Seed `blog_posts`: BP0 published now, BP1–BP4 scheduled status with `scheduled_for` set to next 4 Thursdays 10:00 SAST (UTC = 08:00).
- `pg_cron` job `*/5 * * * *` → `UPDATE blog_posts SET status='published' WHERE status='scheduled' AND scheduled_for <= now()`.

## Code changes (grouped)

### Legal — zero loading state
Each of `/privacy-policy`, `/terms-of-service`, `/template-policy`, `/refund-policy`, `/cookie-policy` becomes a direct route with hardcoded `FALLBACK_CONTENT`. Renders instantly; `useEffect` overrides from DB if a row exists. Drop `_public.legal.$slug.tsx`.

### Public pages — no spinners
`/blog`, `/templates`, `/portfolio`: `useState([]) + useEffect`. Neumorphic empty states. `/templates` waitlist section is always rendered at bottom.

### Security
- `dompurify` wrapping every `dangerouslySetInnerHTML` (blog card excerpts, blog post body, admin preview).
- Public templates fetched via server fn projecting safe columns only — never `canva_link`.
- `/api/health` returns `{ supabase_url, service_role_key, resend_key, yoco_key }` booleans.
- `rg LOVABLE_API_KEY src/` must be empty.

### Mobile drawer (<768px)
Neumorphic Menu button → 250ms drawer with stacked pills (Home · Services · Templates · Portfolio · Blog · Careers · Company · Contact · Spotter Program), lime active dot, lime "Work With Us" CTA. Closes on link/outside/X/route change. Body scroll lock.

### Contact email
Rewrite `email.server.ts` contact template to labelled plain text (no JSON, no braces).

### Spotter modal isolation
Local-only state; `key={spotterModalOpenCount}` parent remount; full reset on close.

### Blog scheduling admin
3 radios (Publish Immediately / Schedule for Later / Save as Draft). Schedule = date picker (no past) + 15-min time dropdowns + SAST note → convert to UTC. List shows status pills.

### Template waitlist
- Templates page bottom: heading "Stay in the loop." + body + Email + Suggestion textarea + lime "Join the Waitlist".
- Submit: insert `template_waitlist`; Resend → hello@ ("New Template Waitlist Signup" body per spec); Resend → user from noreply@ (confirmation body per spec). Success replaces form.
- Admin Templates page: new Waitlist tab — count, table (Date / Email / Suggestion / Delete), Export CSV button.
- When admin publishes a new template, server fn iterates waitlist, sends "New Capacitiq Template — [Name] is Now Available" via Resend batch, logs to `waitlist_notifications`. Shown on admin templates page.

### Careers application modal
Shared `<CareerApplicationModal role="..." />`. Fields: Full Name, Email, Phone (opt), City + Country, Role (read-only), Why Capacitiq (textarea, min 100), Experience (textarea), LinkedIn (opt), CV upload (PDF/DOC/DOCX, max 5MB, drag-drop), consent checkbox, lime "Submit Application". On submit: Resend → careers@ with CV attachment + plain-text labelled body; insert `submissions` with `kind='career_application'`; success replaces form inside modal.

### Yoco Custom Pay (NO popup)
- `<script src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js">` in `index.html`.
- `CapacitiqPay.tsx`: neumorphic inset Cardholder / Card Number (auto group of 4, max 19) / Expiry (auto slash MM/YY, max 5) / CVV (password, max 4). Visa + Mastercard SVGs. Lock icon + "Secured by Yoco. Capacitiq does not store your card details." Lime 52px full-width `Pay R[total]`.
- Click → disable + spinner → `new YocoSDK({ publicKey: import.meta.env.VITE_YOCO_PUBLIC_KEY }).createToken(...)` → POST `/api/charge`.
- Error card: 4px solid `#dc2626` left border, AlertCircle 20px, red message + "Try again" link.

### `/api/charge` server route
Reads `YOCO_SECRET_KEY`; POST `https://online.yoco.com/v1/charges/` with `X-Auth-Secret-Key`. On success: insert `orders`, fetch each template's `canva_link` via `supabaseAdmin`, send delivery email per item (subject "Your Capacitiq Template — Here is Your Download Link", lime Open in Canva button, Canva-account reminder, licence reminder, technical issues line), send order notification to hello@ (subject "New Template Sale — [Name]", body: customer name, email, template, amount, charge id, timestamp). Returns `{ success, chargeId }`. On failure: `{ success: false, error: charge.displayMessage ?? 'Payment failed. Please try again.' }`.

### Admin Orders
Sidebar entry; table Date / Customer Name / Email / Items / Amount ZAR / Yoco Charge ID / Status.

### VAT/tax purge
Remove every VAT / 15% / tax line from cart, checkout, summary, all emails. Show only: Subtotal · Shipping FREE (Digital) · Total.

### Exit-intent popup
Desktop: mouseleave above top 10%. Mobile: 30s inactivity. `sessionStorage('capacitiq_exit_intent_shown')` one-shot. Suppressed on `/cart` and `/checkout`. Neumorphic modal "Before you go." + body + Name + Email + lime "Send Me the Guide" + "No spam. Unsubscribe anytime." On submit: Resend → hello@ ("Pricing Guide Request — Exit Intent"), trigger `/public/pricing-guide.pdf` download, set flag, success message. GA4 `exit_intent_shown` / `exit_intent_converted`.

### SEO / JSON-LD
- **Organization** in `__root.tsx` head: name, legalName "Capacitiq Solutions (Pty) Ltd", url, logo, contactPoint{telephone,email}, sameAs[LinkedIn, TikTok, Instagram], address Johannesburg/Gauteng/ZA.
- **Article** on blog post routes from loader data.
- **JobPosting** on `/careers` per open role (Spotter), with `baseSalary` `QuantitativeValue` description for commission-only.
- All as `<script type="application/ld+json">` in head.
- Sweep: titles ≤60ch, meta descriptions ≤155ch.

### Blog content
BP0 already published. BP1–BP4 seeded with full verbatim bodies you supplied, `status='scheduled'`, `scheduled_for` set to next 4 Thursdays 10:00 SAST.

## Validation before push
- `rg LOVABLE_API_KEY src/` empty.
- `rg "text-black|bg-black" src/` empty (replaced with tokens).
- `--surface: #e8edf0` intact, all neumorphic shadows present.
- All 5 legal routes render instantly with no spinner, no notFound.
- `/templates` shows 5 cards + waitlist section.
- Admin login at `/admin/login` works using env-based service role key.

Switching to build mode now.
