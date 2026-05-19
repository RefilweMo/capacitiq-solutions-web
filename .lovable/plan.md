## Plan

### A. Fix admin login and password reset
- Add "Forgot password?" link on `/admin/login` that triggers password recovery email with redirect to `/reset-password`.
- Create new public route `/reset-password` to handle recovery deep links and let the admin set a new password (e.g. `Ciq@Admin2026!`).
- Improve sign-in errors and gate non-admin users with a clear "admin only" message.
- Verify admin trigger and add a server-side admin bootstrap repair so `admin@capacitiq.co.za` reliably gets the admin role.
- Configure auth: keep email confirmations on, enable leaked-password protection.

### B. Build full admin CRUD editors
Replace dashboard placeholders with real editors backed by the existing server functions:
- `/admin/blog` — list + create/edit/delete, publish toggle, slug/title/excerpt/content/cover/author/tags.
- `/admin/portfolio` — list + create/edit/delete, publish toggle, title/client/category/description/cover/url/tags/order.
- `/admin/templates` — list + create/edit/delete, active toggle, name/description/price/cover/category/private Canva link/order.
- `/admin/careers` — list + create/edit/delete, open/close toggle, title/location/type/summary/description/requirements/order.
- `/admin/submissions` — full submissions browser.
- Sidebar/admin nav linking all sections; signed-out auto-redirect to `/admin/login`.

### C. Apply all critical edits from the latest spec doc

Brand and chrome (every page):
- Background `#e8edf0`, primary `#0b4650`, accent `#e6ff2b`. No black, no white card backgrounds, muted text `#4a6670`.
- Fonts: Ubuntu (headings) + Inter (body) loaded from Google Fonts.
- Logo is the Cloudinary SVG `<img>` in navbar, footer, and admin — not text/icon alone, but "Capacitiq" wordmark stays beside it in Ubuntu Bold.
- Neumorphic shadows everywhere; no flat cards, borders, or outlines.

Navbar:
- Floating pill, raised neumorphic shadow.
- Desktop links: Home, Services, Templates, Portfolio, Blog, Careers, Company, Contact.
- Right side: "Spotter Program" text link + lime "Work With Us" pill CTA.
- Active page indicator: 6px lime dot centered under the active link (no underline).
- Mobile: logo + hamburger; full-drawer with stacked links and "Work With Us" CTA at bottom.

Footer:
- Large neumorphic rounded card with 4 columns: brand/tagline, Connect (email + WhatsApp pills with Lucide icons), Our Links (Home/About Us/Services/Templates Shop/Portfolio/Careers), Follow Us (LinkedIn, Instagram, custom TikTok SVG only).
- Bottom-center lime "Get a Free Consultation" CTA → `/contact`.
- Copyright: © 2026 Capacitiq Solutions (Pty) Ltd.

Home (/):
- Remove B-BBEE pill from hero.
- Hero copy + CTAs verbatim from spec; right column shows 3 neumorphic feature cards (Compass / PenTool / Megaphone).
- Spotter strip with deep teal `#0b4650` background and lime CTA opening the shared Spotter modal.
- Spotter modal fields + behavior per spec (success message replaces form, do not auto-close).
- "What We Do" with 5 service cards (Compass / TrendingUp / Megaphone / Briefcase / PenTool), each linking to `/services#<id>`. No Sales pillar anywhere.
- "Capacitiq Difference" comparison table card (full copy).
- "How Our Pricing Works" — 4 step cards with ChevronRight separators.
- Portfolio teaser (1 placeholder card + "View All Work").
- From The Blog (3 placeholder cards + "Read All Posts").
- Template Shop teaser (3 placeholder cards + "Browse All Templates").
- FAQ accordion with all Q/A copy verbatim.
- Ready to Start CTA section.

Services (/services):
- Hero label/H1/body verbatim.
- Pricing Guide section with gate modal (name/work email/optional company) → email lead via Resend + auto-download `/public/pricing-guide.pdf`.
- 5 service pillars (ids: `business-strategy`, `marketing-growth`, `public-relations`, `virtual-assistance`, `graphic-design`) with numbers, taglines, deliverable checklists, and "Apply This To Your Business" CTAs.
- Bottom CTA section.

Contact (/contact):
- Two-column layout. Left: full contact form with all sections (Your Details, Business Overview, Service Selection [now includes Web Presence], Budget & Timeline, additional notes, consent checkbox) wired to Resend → hello@capacitiq.co.za.
- Right: contact info pills (WhatsApp 064 062 0354, email, LinkedIn, TikTok SVG, Instagram) + hours card (Mon–Fri 9–5, Sat/Sun closed).

Careers (/careers):
- Hero copy + 4 culture cards (Accountability, Clarity, Consistent Execution, Remote and Flexible).
- Exactly two accordion role cards:
  - Sales Spotter (OPEN) — Apply opens the SAME Spotter modal.
  - Client Acquisition Specialist (CLOSED) — show muted "Applications Closed" pill, no Apply button.

Company (/company):
- Hero copy with registration details.
- "Why businesses choose…" 3 cards (Who We Work With / What We Combine / How We Operate).
- Philosophy, Vision, Mission blocks.
- "How We Work" 5-step horizontal flow with arrows.
- Company FAQ accordion (all Q/A verbatim).
- Compliance section + 2 badge cards (B-BBEE Level 1, Reg No.) + Work With Us CTA.

Templates / Portfolio / Blog: keep existing CMS-driven pages, restyled to match neumorphic spec; verify `canva_link` stays private.

SEO (every page):
- `<html lang="en-ZA">`, unique title `[Page Name] | Capacitiq — Business Strategy, Design & Operations`, unique description, og:title/description/image/url, twitter:card=summary_large_image, canonical.
- One H1 per page, descriptive alts, hero `loading="eager"` + others `loading="lazy"`.
- robots.txt + sitemap.xml + JSON-LD: Organization (home), Article (blog posts), JobPosting (each open career).

### D. Validation
- Confirm route tree generates; no duplicate `/` route.
- Smoke-test admin login + password reset + each CRUD page.
- Verify final checklist: no black, no white cards, logo is SVG image, no Sales pillar, shared Spotter modal, only 2 careers listings, only LinkedIn/TikTok/Instagram socials.