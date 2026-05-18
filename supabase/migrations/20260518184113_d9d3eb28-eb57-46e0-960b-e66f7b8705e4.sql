
-- Remove broad public select; replace with column-level grants on safe columns only
drop policy if exists "Public reads active templates (safe cols via view only)" on public.templates;

-- Re-add a public select policy (RLS row filter), then restrict columns via GRANT
create policy "Public reads active templates safe rows" on public.templates
  for select to anon, authenticated using (active = true);

-- Revoke all column privileges, then grant only safe columns
revoke select on public.templates from anon, authenticated;
grant select (id, name, description, price_cents, cover_image, category, active, display_order, created_at)
  on public.templates to anon, authenticated;

-- Admins need full select; their policy uses authenticated role + has_role check.
-- Grant full select to authenticated specifically for admin queries:
-- Column grants apply per role; admins are still 'authenticated', so full row read needs ALL cols granted.
-- Grant full select privilege back to authenticated, RLS will still restrict rows for non-admins to active=true,
-- but a non-admin could still read canva_link. So we keep authenticated restricted to safe cols
-- and admins access canva_link via service role in server functions only.
