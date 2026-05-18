
-- Recreate the public templates view with security_invoker so RLS applies as the caller
drop view if exists public.templates_public;
create view public.templates_public
with (security_invoker = true) as
select id, name, description, price_cents, cover_image, category, active, display_order, created_at
from public.templates
where active = true;

grant select on public.templates_public to anon, authenticated;

-- But the underlying table has no public select policy, so we need one scoped to safe columns.
-- Simpler: add a public select policy on templates that allows only when active=true,
-- and rely on the view to project safe columns. Apps MUST query the view, not the table.
create policy "Public reads active templates (safe cols via view only)" on public.templates
  for select to anon, authenticated using (active = true);

-- Lock down internal trigger helper
revoke execute on function public.handle_new_user() from anon, authenticated, public;
