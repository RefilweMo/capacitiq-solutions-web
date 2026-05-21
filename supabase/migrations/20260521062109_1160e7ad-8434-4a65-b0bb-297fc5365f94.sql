-- 1. legal_pages table
create table if not exists public.legal_pages (
  slug text primary key,
  title text not null,
  effective_date date not null default current_date,
  content text not null,
  updated_at timestamptz not null default now()
);

alter table public.legal_pages enable row level security;

create policy "Public reads legal pages"
  on public.legal_pages for select
  using (true);

create policy "Admins write legal pages"
  on public.legal_pages for all
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create trigger legal_pages_updated_at
  before update on public.legal_pages
  for each row execute function public.set_updated_at();

-- 2. submissions INSERT for public
create policy "Anyone can submit"
  on public.submissions for insert
  to anon, authenticated
  with check (true);

-- 3. lock down templates: remove public select, add safe view
drop policy if exists "Public reads active templates safe rows" on public.templates;

create policy "Admins read templates direct"
  on public.templates for select
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));

create or replace view public.public_templates
with (security_invoker = true) as
select id, name, description, price_cents, cover_image, category, active, display_order, created_at, updated_at
from public.templates
where active = true;

grant select on public.public_templates to anon, authenticated;
revoke select (canva_link) on public.templates from anon, authenticated;

-- 4. Seed legal pages
insert into public.legal_pages (slug, title, effective_date, content) values
('privacy-policy', 'Privacy Policy', '2026-05-19', $$## 1. Who We Are
Capacitiq Solutions (Pty) Ltd, trading as Capacitiq, is a registered private company in South Africa (Registration No. 2026/344156/07). We are a B-BBEE Level 1 Contributor operating remotely across South Africa. Registered in Johannesburg, Gauteng, South Africa. For privacy enquiries: legal@capacitiq.co.za

## 2. Scope
This Privacy Policy explains how Capacitiq collects, uses, stores, and protects your personal information when you visit our website, engage our services, submit any form, or communicate with us. It is governed by the Protection of Personal Information Act 4 of 2013 (POPIA).

## 3. Information We Collect
We collect: full name and contact details / business name and operational information / budget and service preferences / payment information processed by Paystack and Yoco / correspondence and communications / referral information from Spotter submissions / job application information / IP address and browser data via Google Analytics / cookies as described in our Cookie Policy.

## 4. How We Use Your Information
To respond to enquiries and provide quotations / to deliver contracted services / to process payments via Paystack and Yoco / to send service updates and delivery confirmations / to deliver purchased template files via email / to administer the Spotter Programme / to evaluate career applications / to comply with South African law / to improve our website using anonymised analytics.

## 5. Legal Basis for Processing
Performance of a contract / legitimate interests / consent / legal obligation under South African law.

## 6. How We Share Your Information
We do not sell your information. We share only with: Paystack and Yoco for payment processing / Resend for transactional email delivery / Google for anonymised analytics / service contractors under confidentiality obligations / legal authorities where required by law.

## 7. Data Retention
Client records: minimum five years / contact and enquiry records: two years / payment records: minimum five years / template purchase records: two years / job application records: one year.

## 8. Your Rights Under POPIA
Request access to your information / request correction / request deletion subject to legal obligations / object to processing / lodge a complaint with the Information Regulator at inforeg@justice.gov.za. Contact us at legal@capacitiq.co.za. We respond within 30 days.

## 9. Security
We implement reasonable technical and organisational measures to protect your personal information. No internet transmission is completely secure.

## 10. Changes
We may update this policy. Continued use constitutes acceptance. Contact: legal@capacitiq.co.za$$),

('terms-of-service', 'Terms of Service', '2026-05-19', $$## 1. About These Terms
These Terms govern the relationship between Capacitiq Solutions (Pty) Ltd (Registration No. 2026/344156/07), trading as Capacitiq, and any person or entity that engages our services or visits www.capacitiq.co.za. By engaging our services or making payment you accept these Terms.

## 2. Our Services
Capacitiq offers five service pillars: Business Strategy and Operations, Marketing and Growth, Public Relations, Virtual Assistance, and Graphic Design, plus a Canva template shop. All services are delivered remotely across South Africa. All prices are in ZAR.

## 3. Engagement
An engagement begins when you accept a quotation and make the required payment. We reserve the right to decline any engagement at our discretion.

## 4. Payment Terms
Under R3,000: 100% upfront. R3,000 and above: 50% deposit before commencement, 50% on delivery. Retainers: billed monthly in advance on the 1st. Active retainer clients receive 15% discount on once-off services. Accounts more than 5 business days in arrears may have service delivery paused. Payments processed via Paystack and Yoco.

## 5. Delivery
Timelines are indicative and depend on client responsiveness. Delays caused by the client extend delivery timelines accordingly.

## 6. Revisions
Each package includes one revision round. Requests must be submitted within 5 business days of delivery. Additional revisions are charged separately.

## 7. Client Responsibilities
Provide accurate and timely information / designate a single point of contact / respond within 5 business days / ensure provided content does not infringe third party rights.

## 8. Intellectual Property
All deliverables vest in you upon full payment. You own the output, the thinking, and the systems. Capacitiq retains pre-existing tools and frameworks. You grant Capacitiq a non-exclusive licence to reference your engagement in our portfolio unless you opt out in writing.

## 9. Confidentiality
Both parties treat non-public information as confidential. This obligation survives termination for two years.

## 10. Limitation of Liability
Maximum liability is the total fees paid for the specific service. We do not guarantee business outcomes, revenue results, or media pickups. Nothing excludes liability for fraud or gross negligence.

## 11. Termination
Once-off projects: cancellable before commencement with written notice — deposit non-refundable once work starts. Retainers: 30 days written notice required — notice period fee remains due.

## 12. Governing Law
Governed by the laws of the Republic of South Africa. Jurisdiction: courts of Gauteng. Contact: legal@capacitiq.co.za$$),

('template-policy', 'Template Licence and Sales Policy', '2026-05-19', $$## 1. About This Policy
Governs all digital template purchases from the Capacitiq Template Shop at www.capacitiq.co.za. By purchasing you accept these terms.

## 2. What You Are Purchasing
A non-exclusive, non-transferable licence to use the template as described. Not ownership of the design. A Canva account is required.

## 3. Delivery
After successful payment you will receive an email from noreply@capacitiq.co.za with your Canva link. Check spam if not received within 15 minutes. Technical delivery issues must be reported to hello@capacitiq.co.za within 7 days.

## 4. What You May Do
Edit and customise the template in Canva / use final output commercially / share final output with your clients / use across multiple projects for your own business.

## 5. What You May Not Do
Resell, redistribute, or share the original template file or Canva link / transfer the licence / create a competing product / claim authorship of the original design.

## 6. All Sales Are Final
No refunds, exchanges, or returns once a template link has been delivered. Review all previews carefully before purchasing.

## 7. Technical Issues
Genuine technical issues reported within 7 days will be resolved with a replacement link or equivalent template. Does not cover dissatisfaction with design or Canva account issues.

## 8. Intellectual Property
All templates remain the intellectual property of Capacitiq Solutions (Pty) Ltd. Contact: hello@capacitiq.co.za$$),

('refund-policy', 'Refund, Cancellation and Dispute Policy', '2026-05-19', $$Note: This policy is publicly available at www.capacitiq.co.za/refund-policy

## 1. Overview
Capacitiq Solutions (Pty) Ltd (Registration No. 2026/344156/07) provides business support services and digital templates. This policy is transparent so clients can make informed decisions.

## 2. Services — Refund Policy
Before work commences: full refund less 10% administrative fee if requested in writing to legal@capacitiq.co.za within 48 hours of payment. After work commences: no refund. Work commences when a discovery session occurs, any drafting or research begins, or an onboarding form is processed. Dissatisfied clients will be offered one additional revision round at no charge. Delivered work: no refund where work has been delivered and signed off or where feedback was not provided within 5 business days.

## 3. Retainer Cancellation
30 calendar days written notice to legal@capacitiq.co.za. Notice period fee remains due. Where Capacitiq initiates cancellation, 30 days notice is provided and a pro-rata refund issued for prepaid days beyond the notice period.

## 4. Templates — No Refund
All template sales are final once a link is delivered. Technical issues reported within 7 days receive a replacement link.

## 5. Dispute Resolution
Step 1: Contact legal@capacitiq.co.za or WhatsApp 064 062 0354. Acknowledged within 2 business days, resolution proposed within 5. Step 2: Formal written complaint to legal@capacitiq.co.za including name, invoice number, issue description, and desired outcome. Response within 10 business days. Step 3: Mediation with shared costs. Step 4: Legal proceedings in the courts of Gauteng.

## 6. Chargebacks
Contact us before initiating any chargeback. Capacitiq will provide full documentation to Paystack, Yoco, and your bank to contest chargebacks initiated without prior engagement.

## 7. Contact
Email: legal@capacitiq.co.za / WhatsApp: 064 062 0354 / Johannesburg, Gauteng, South Africa

## 8. Consumer Protection
Nothing limits your rights under the Consumer Protection Act 68 of 2008.$$),

('cookie-policy', 'Cookie Policy', '2026-05-19', $$## 1. What This Covers
How Capacitiq Solutions (Pty) Ltd uses cookies on www.capacitiq.co.za.

## 2. What Are Cookies
Small text files placed on your device to recognise it, remember preferences, and collect usage information.

## 3. Cookies We Use
Essential: required for the site to function. Cannot be disabled. Analytics — Google Analytics: collects anonymised data including pages visited, time on site, city-level location, and device type. Opt out at tools.google.com/dlpage/gaoptout. Functional: remember preferences to improve your experience.

## 4. Third-Party Cookies
Paystack and Yoco may set cookies during checkout for payment processing and fraud prevention, governed by their own policies.

## 5. Managing Cookies
Manage through your browser settings. Disabling certain cookies may affect site functionality.

## 6. Contact
legal@capacitiq.co.za$$)
on conflict (slug) do nothing;