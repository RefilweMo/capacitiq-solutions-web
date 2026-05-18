## Capacitiq Website — Final Build Plan (Approved Additions Included)

All decisions locked. Approve to execute.

### Confirmed decisions
- **CMS storage**: Lovable Cloud (Supabase) tables for blog, portfolio, templates, careers, submissions.
- **Resend**: Lovable Cloud enabled; `RESEND_API_KEY` stored as a server secret; emails sent from server functions (from `noreply@capacitiq.co.za` — domain must be verified in Resend).
- **Admin password**: `Ciq@Admin2026!` seeded for `admin@capacitiq.co.za` and `rmolapisi@capacitiq.co.za`; changeable via Settings.
- **Socials**: LinkedIn, TikTok, Instagram only. No Facebook / X / YouTube anywhere.

### New additions (from latest message)

1. **Single Spotter modal** — One `<SpotterModal />` component lives at the root of the public layout. The homepage "Spotters" banner CTA and the Sales Spotter career listing "Apply" button both call the same `openSpotter()` from a small context. One component, two triggers, identical fields, identical submission handler.

2. **TikTok icon** — Inline SVG component `<TikTokIcon />` (the exact path you provided), used in the footer and contact page wherever TikTok appears.

3. **Templates Manager — Canva link** — Templates table gets a `canva_link` column (URL, required). Field appears in the admin new/edit form. **Never selected or rendered on any public route.** Only fetched server-side inside `sendTemplateOrder`. RLS: public SELECT on templates excludes `canva_link` via an explicit safe-column view; admin SELECT sees everything.

4. **`sendTemplateOrder` server function** — On checkout:
   - Fetches purchased template rows server-side (including `canva_link`)
   - **Customer email**:
     - Subject: `Your Capacitiq Template — Here's Your Download Link`
     - Body per template: template name, Canva link rendered as a lime CTA button, "A Canva account is required to access this template."
     - Appends the full licence block (below) to every customer email
   - **Internal notification** to `hello@capacitiq.co.za` with customer details + line items

5. **Licence block** — Stored as a shared constant `TEMPLATE_LICENCE` in `src/lib/licence.ts`. Rendered verbatim on:
   - `/templates/checkout` confirmation step
   - Customer template-order email body
   ```
   Standard packs are licensed for your personal or business use only. You may
   edit and customise for your own brand, use final output commercially, and
   share final output with your clients if using for client work. You may not
   resell, redistribute, or share the original template file. You may not
   transfer the licence to another person or business. All digital product
   sales are final. Technical issues reported within 7 days will be resolved
   as a technical remedy. A Canva account is required.
   ```

### Routes
```
/, /services, /portfolio, /blog, /blog/$slug,
/templates, /templates/cart, /templates/checkout,
/careers, /contact, /company,
/admin/login, /admin (dashboard + blog/portfolio/templates/careers/submissions/settings),
/sitemap.xml (server route)
```

`_public.tsx` layout: Navbar + Footer + mounted `<SpotterModal />`.
`_admin.tsx` layout: sidebar + `beforeLoad` admin-role check.

### Server functions (`src/lib/*.functions.ts`, Resend via gateway)
- `sendContactEmail`, `sendSpotterReferral`, `sendPricingGuideLead`, `sendCareerApplication`, `sendTemplateOrder`
- `adminLogin`, `updateAdminPassword`

### Database (Lovable Cloud)
- `profiles`, `user_roles` (enum role: `admin`) with `has_role()` security-definer function
- `blog_posts`, `portfolio_items`, `templates` (with `canva_link`), `careers`, `submissions`
- Public SELECT only for published rows / safe columns; admin-only write via `has_role(auth.uid(), 'admin')`
- Seed: 2 careers listings, admin role for the two emails above

### Design system
Tailwind v4 tokens in `src/styles.css` — `--surface #e8edf0`, `--primary #0b4650`, `--accent #e6ff2b`, neumorphic shadows. Ubuntu (headings) + Inter (body) from Google Fonts. Primitives in `src/components/neu/`: `NeuCard`, `NeuButton`, `NeuInput`, `NeuTextarea`, `NeuPill`, `NeuIconBox`, `NeuAccordion`, `NeuModal`, `NeuStepArrow`. Shared `Navbar` (floating pill, lime-dot active indicator, hamburger on mobile) and `Footer` (4-column card → LinkedIn/TikTok/Instagram, C-bracket CTA arch).

### Content
All copy verbatim from your brief.

### SEO layer (your exact spec)
- `<html lang="en-ZA">` in root shell
- Per-route `head()` with unique title (`[Page] | Capacitiq — Business Strategy, Design & Operations`), the exact meta descriptions you provided, `og:title/description/image/url`, `twitter:card=summary_large_image`, canonical
- One `<h1>` per page; clean H2/H3 hierarchy
- All nav/footer links render `<a>` via TanStack `<Link>`
- All images: descriptive `alt`, `loading="lazy"` (hero = `eager`)
- `public/robots.txt` + `src/routes/sitemap[.]xml.ts` listing all static routes + published blog slugs
- JSON-LD: `Organization` at root (sameAs LinkedIn/TikTok/Instagram, contactPoint with WhatsApp + email), `Article` per blog post, `JobPosting` per open careers listing

### Build order
1. Enable Lovable Cloud + add `RESEND_API_KEY` secret
2. DB migration: tables, RLS, `has_role()`, seed careers + admin roles
3. Design tokens + neumorphic primitives + fonts
4. Shared Navbar / Footer / SpotterModal context / TikTok icon
5. Public layout + all 11 public pages with full copy + SEO heads
6. Admin login + 6 manager screens (blog, portfolio, templates with canva_link, careers, submissions, settings)
7. Server functions wired to Resend (incl. `sendTemplateOrder` with licence block)
8. robots.txt + dynamic sitemap.xml + JSON-LD
9. Build verification

### Post-build (you'll need to do)
- Verify `capacitiq.co.za` in your Resend dashboard so `noreply@capacitiq.co.za` can send
- Drop `pricing-guide.pdf` into `/public/`

Approve and I'll execute end-to-end.
