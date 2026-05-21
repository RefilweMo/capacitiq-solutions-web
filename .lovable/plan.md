# Capacitiq — Correction & Completion Plan

Scope is large but grouped into 7 sequential phases. Each phase is independently verifiable.

---

## Phase 1 — Security & Infrastructure (BLOCKER)

**1.1 Delete `CNAME`** at project root (and `public/` if present).

**1.2 Lock down `ensureAdminUser`**
Currently any visitor can POST and reset the admin password. Fix:
- Require a server-side `ADMIN_BOOTSTRAP_TOKEN` (new secret) passed in the request body.
- If the whitelisted email already has the admin role, refuse password reset via this endpoint — force the normal Supabase `resetPasswordForEmail` flow.
- Only allow create-when-missing without token (true first-run), and only if zero admin users exist in `user_roles`.

**1.3 Lock down `sendTemplateOrder`**
Today it emails Canva links with no payment proof. Fix:
- Rename to `fulfilTemplateOrder`.
- Require a verified Yoco `chargeId` (or Paystack ref) parameter.
- Server re-verifies the charge against Yoco's API using `YOCO_SECRET_KEY` before reading `canva_link` and emailing.
- Old direct-call path removed from the checkout page.

**1.4 Protect `templates.canva_link` column**
- Replace public RLS policy with a SQL `security_barrier` view `public_templates` exposing every column EXCEPT `canva_link`.
- Revoke SELECT on `templates` from `anon`/`authenticated`, grant SELECT on the view.
- Update all public reads (`_public.templates.tsx`, `_public.templates.$id.tsx`) to query the view.

**1.5 `submissions` INSERT policy**
Add `CREATE POLICY "Anyone can submit" ON submissions FOR INSERT TO anon, authenticated WITH CHECK (true);` — public forms currently insert via server fn with service-role, but a policy is required for direct supabase-js inserts and silences the linter.

**1.6 SECURITY DEFINER review**
`has_role` is fine (needed for RLS). Audit any others — revoke EXECUTE from `authenticated` where not needed.

**1.7 Self-contained env — drop `LOVABLE_API_KEY` dependency**
- `email.server.ts`: rewrite to call `https://api.resend.com/emails` directly with `Authorization: Bearer ${RESEND_API_KEY}`. Remove gateway URL and `LOVABLE_API_KEY` reference.
- Server functions read only: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `YOCO_SECRET_KEY`, `ADMIN_BOOTSTRAP_TOKEN`.

**1.8 Supabase client env fallback**
`client.server.ts` is auto-generated and already reads `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` from `process.env`. The "Missing env var" admin-login error means `SUPABASE_SERVICE_ROLE_KEY` isn't set in the Lovable preview runtime (it IS in Vercel). Action: add `SUPABASE_SERVICE_ROLE_KEY` as a Lovable Cloud secret via `add_secret` so preview admin login works, AND keep code path env-only so Vercel deploy works unchanged.

---

## Phase 2 — Yoco Custom Checkout

- Add `<script src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js">` to `src/routes/__root.tsx` head.
- New `src/components/CapacitiqPay.tsx`: neumorphic inset inputs (Cardholder Name, Card Number with 4-group format, MM/YY, CVV), Visa+Mastercard SVGs, lock icon + "Secured by Yoco" muted text, lime full-width `Pay R{amount}` button.
- On submit calls `window.YocoSDK.createToken(...)`, then POSTs token to new server fn `chargeYocoToken` which hits `https://payments.yoco.com/api/charges/` with `YOCO_SECRET_KEY`.
- On success → call `fulfilTemplateOrder` with the verified chargeId → email customer + hello@capacitiq.co.za with Canva links → clear cart → success card.
- Error → neumorphic error card below form.
- Requires secrets: `YOCO_SECRET_KEY` (request via add_secret).

---

## Phase 3 — Multi-step Contact Form

Rewrite `src/routes/_public.contact.tsx`:
- 4-step wizard with neumorphic pill progress indicator (lime when active).
- Steps as specified: Your Details / Business Overview / Service Selection / Budget & Timeline.
- Back link + Continue button on each step; final Submit button posts ALL collected fields to `submitContact` server fn → Resend → `hello@capacitiq.co.za` → success card replaces form.

---

## Phase 4 — Copy Fixes (verbatim)

- `src/routes/_public.services.tsx`: full rewrite to spec (5 pillars w/ exact copy + Pricing Guide gate section + bottom CTA).
- `src/routes/_public.company.tsx`: full rewrite (Why, Philosophy, Vision/Mission, How We Work 5-step, FAQ, Registered/Compliant).
- `_public.index.tsx` FAQ: replace the logo/video answer with: "We currently do not create logos and video content as part of our Graphic Design pillar. We focus on static and document-based visual assets that support business positioning and execution."

---

## Phase 5 — Logo, Navbar, Footer

- `Logo.tsx`: wrap `<img>` in a 44×44 dark-teal neumorphic container (`bg:#0b4650`, raised shadow, radius 10, padding 8). Text next to it reads **Solutions** (Ubuntu Bold, `#0b4650`). Entire pair wrapped in single `<Link to="/">`.
- Update Navbar & Footer to use the new Logo (`showText`).

---

## Phase 6 — Legal Pages + CMS

**6.1 Migration**: new `legal_pages` table.
```
id text primary key (slug: 'privacy-policy' | 'terms-of-service' | 'template-policy' | 'refund-policy' | 'cookie-policy')
title text, effective_date date, content text (markdown),
updated_at timestamptz default now()
```
RLS: public SELECT; admin ALL via `has_role`. Seed all 5 policies with the verbatim text from the prompt.

**6.2 Public routes**: `/privacy-policy`, `/terms-of-service`, `/template-policy`, `/refund-policy`, `/cookie-policy` — render `content` as markdown (use `react-markdown`; install).

**6.3 Footer**: add "Legal & More" column with 5 links.

**6.4 Admin CMS**: `src/routes/admin.legal.tsx` — list 5 policies, each editable (title, effective_date, large textarea), Save button → `updateLegalPage` server fn (admin-only via auth middleware). Add to admin sidebar.

**6.5 Sitemap**: include all 5 legal routes; exclude `/admin/*` and `/reset-password`.

---

## Phase 7 — Misc cleanup

- **Cart/VAT**: in `src/lib/cart.ts` and checkout, remove any VAT/tax line. Show only Subtotal / `Shipping: FREE (Digital)` / Total.
- **SEO**: trim homepage title (<60ch) + 5 longest meta descriptions (<160ch). Add JSON-LD: Organization on root, Article on blog posts, JobPosting on careers. Add `public/llms.txt` (one-paragraph site summary + key URLs). Add `<html lang="en-ZA">` confirmation.
- **Cookie banner**: minimal neumorphic banner bottom-right; localStorage `capacitiq_cookies_ack`; links to `/cookie-policy`. No third-party CMP.

---

## Technical Details

**New/changed server functions**
- `admin-bootstrap.functions.ts` — add token gate + admin-exists check.
- `email.server.ts` — direct Resend fetch, no gateway.
- `forms.functions.ts` — rename `sendTemplateOrder` → `fulfilTemplateOrder` (chargeId-gated); keep `submitContact`, `submitSpotter`, `submitPricingGuide`, `submitCareerApplication` — each sends to the recipient table in the brief.
- `yoco.functions.ts` (new) — `chargeYocoToken({ token, amount_cents, currency:'ZAR', metadata })`.
- `content.functions.ts` — add `getLegalPage(slug)` (public) and `listLegalPages` / `updateLegalPage` (admin).

**New secrets to request**: `YOCO_SECRET_KEY`, `ADMIN_BOOTSTRAP_TOKEN`, plus surfacing `SUPABASE_SERVICE_ROLE_KEY` in Lovable preview env.

**Packages to add**: `react-markdown`.

**Files affected (high-level)**: ~30 files across `src/routes`, `src/components`, `src/lib`, plus 2 migrations and seed insert.

---

## Validation checklist (runs after Phase 7)

- `rg LOVABLE_API_KEY src/` returns nothing.
- `ls CNAME public/CNAME` both fail.
- Public REST query `GET /rest/v1/templates?select=canva_link` returns 401/403.
- `ensureAdminUser` POST without token returns 401 when an admin already exists.
- `fulfilTemplateOrder` without valid chargeId returns 402.
- Contact form: 4 steps, submit reaches hello@capacitiq.co.za.
- Admin can edit each legal page and changes show on the public route.
- Cart: no VAT line.
- Logo: lime SVG visible inside dark-teal pill on both navbar and footer; "Solutions" text; both clickable to `/`.
- Services & Company pages match verbatim copy.
- FAQ answer for logo/video updated.

Reply **"approve"** to implement, or call out any item to adjust.