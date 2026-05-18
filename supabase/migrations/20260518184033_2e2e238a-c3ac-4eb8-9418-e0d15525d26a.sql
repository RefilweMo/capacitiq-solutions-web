
-- =========================================================
-- Roles & profiles
-- =========================================================
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto-create profile and assign admin role for whitelisted emails
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (user_id) do nothing;

  if new.email in ('admin@capacitiq.co.za', 'rmolapisi@capacitiq.co.za') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user')
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Profiles policies
create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Admins view all profiles" on public.profiles
  for select using (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
create policy "Users view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles
  for select using (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Shared updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- =========================================================
-- Blog posts
-- =========================================================
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  author text default 'Capacitiq',
  tags text[] default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.blog_posts enable row level security;
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

create policy "Public reads published blog" on public.blog_posts
  for select using (published = true);
create policy "Admins read all blog" on public.blog_posts
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins write blog" on public.blog_posts
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Portfolio items
-- =========================================================
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  category text,
  description text,
  cover_image text,
  url text,
  tags text[] default '{}',
  display_order int default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_items enable row level security;
create trigger portfolio_updated_at before update on public.portfolio_items
  for each row execute function public.set_updated_at();

create policy "Public reads portfolio" on public.portfolio_items
  for select using (published = true);
create policy "Admins read all portfolio" on public.portfolio_items
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins write portfolio" on public.portfolio_items
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Templates (canva_link is PRIVATE — server-only access)
-- =========================================================
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents int not null default 0,
  cover_image text,
  category text,
  canva_link text not null,
  active boolean not null default true,
  display_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.templates enable row level security;
create trigger templates_updated_at before update on public.templates
  for each row execute function public.set_updated_at();

-- Public view that EXCLUDES canva_link
create or replace view public.templates_public as
select id, name, description, price_cents, cover_image, category, active, display_order, created_at
from public.templates
where active = true;

grant select on public.templates_public to anon, authenticated;

-- No public select policy on templates table — only admins can read full row
create policy "Admins read all templates" on public.templates
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins write templates" on public.templates
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Careers
-- =========================================================
create table public.careers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text default 'Remote, South Africa',
  employment_type text default 'Contractor',
  summary text,
  description text,
  requirements text,
  open boolean not null default true,
  display_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.careers enable row level security;
create trigger careers_updated_at before update on public.careers
  for each row execute function public.set_updated_at();

create policy "Public reads open careers" on public.careers
  for select using (open = true);
create policy "Admins read all careers" on public.careers
  for select using (public.has_role(auth.uid(), 'admin'));
create policy "Admins write careers" on public.careers
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Submissions (form intakes)
-- =========================================================
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- contact | spotter | pricing_guide | career | template_order
  name text,
  email text,
  phone text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;

-- No public select; inserts handled server-side via service role
create policy "Admins read submissions" on public.submissions
  for select using (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Seed careers
-- =========================================================
insert into public.careers (title, location, employment_type, summary, description, requirements, display_order) values
('Sales Spotter', 'Remote, South Africa', 'Performance-based contractor',
 'Refer South African startups and SMEs to Capacitiq and earn commission on every closed deal.',
 'Capacitiq Spotters are independent referrers who introduce qualified leads to our team. You set your own pace, work from anywhere, and get paid when your referrals convert. Ideal for consultants, freelancers, and well-connected operators.',
 'Strong network of South African SMEs, founders, or operators. Comfortable making warm introductions. No prior sales experience required — we close the deal, you earn the commission.',
 1),
('Designer (Contract)', 'Remote, South Africa', 'Performance-based contractor',
 'Pitch in on brand, web, and template design projects as work comes in.',
 'Join our roster of contract designers who pick up briefs across brand identity, web design, and Canva template production. You choose which projects to take on, work to clear scope and deadlines, and bill per project.',
 'Strong portfolio in brand or web design. Comfortable working in Figma and Canva. Self-managed and reliable on delivery.',
 2);
