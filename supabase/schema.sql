create extension if not exists "pgcrypto";

create table if not exists pages (id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, eyebrow text, headline text, intro text, body jsonb default '[]', blocks jsonb default '[]', status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, sort_order int default 0, updated_at timestamptz default now());
create table if not exists portfolio_categories (id uuid primary key default gen_random_uuid(), parent_id uuid references portfolio_categories(id) on delete set null, name text not null, slug text unique not null, description text, sort_order int default 0);
create table if not exists projects (id uuid primary key default gen_random_uuid(), category_id uuid references portfolio_categories(id) on delete set null, title text not null, slug text unique not null, summary text, body text, blocks jsonb default '[]', cover_url text, gallery jsonb default '[]', video_url text, tags text[] default '{}', services text[] default '{}', client text, project_year text, featured boolean default false, status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, rights_verified boolean default false, sort_order int default 0, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists services (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, summary text, ideal_for text, base_price numeric(10,2), price_label text, delivery_time text, requirements text[] default '{}', deliverables text[] default '{}', questions jsonb default '[]', status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, sort_order int default 0, updated_at timestamptz default now());
create table if not exists plans (id uuid primary key default gen_random_uuid(), name text not null, eyebrow text, price numeric(10,2), description text, ideal_for text, delivery_time text, revisions text, features text[] default '{}', formats text[] default '{}', not_included text[] default '{}', featured boolean default false, status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, sort_order int default 0, updated_at timestamptz default now());
create table if not exists testimonials (id uuid primary key default gen_random_uuid(), name text not null, role text, company text, quote text not null, rating int default 5 check (rating between 1 and 5), status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, rights_verified boolean default false, sort_order int default 0, updated_at timestamptz default now());
create table if not exists faqs (id uuid primary key default gen_random_uuid(), question text not null, answer text not null, category text default 'general', status text default 'draft' check(status in ('draft','published','scheduled')), published boolean default false, publish_at timestamptz, seo jsonb default '{}', content_verified boolean default false, sort_order int default 0, updated_at timestamptz default now());
create table if not exists inquiries (id uuid primary key default gen_random_uuid(), service_id uuid references services(id) on delete set null, service_name text, plan_id uuid references plans(id) on delete set null, contact jsonb not null, answers jsonb default '{}', files jsonb default '[]', internal_notes text default '', status text default 'new' check (status in ('new','contacted','closed')), created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists content_versions (id uuid primary key default gen_random_uuid(), collection_name text not null, item_id text not null, label text, snapshot jsonb not null, created_by uuid references auth.users(id) on delete set null, created_at timestamptz default now());
create table if not exists content_trash (id uuid primary key default gen_random_uuid(), collection_name text not null, item_id text not null, snapshot jsonb not null, deleted_by uuid references auth.users(id) on delete set null, deleted_at timestamptz default now());
create table if not exists media (id uuid primary key default gen_random_uuid(), name text not null, storage_path text not null, public_url text, mime_type text, alt_text text not null default '', rights_owner text, rights_verified boolean default false, focal_point jsonb default '{"x":50,"y":50}', variants jsonb default '{}', created_at timestamptz default now());
create table if not exists admin_profiles (user_id uuid primary key references auth.users(id) on delete cascade, role text not null default 'editor' check(role in ('editor','administrator')), active boolean default true, created_at timestamptz default now());

create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from admin_profiles where user_id = auth.uid() and active = true) $$;

alter table pages enable row level security;
alter table portfolio_categories enable row level security;
alter table projects enable row level security;
alter table services enable row level security;
alter table plans enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table inquiries enable row level security;
alter table content_versions enable row level security;
alter table content_trash enable row level security;
alter table media enable row level security;
alter table admin_profiles enable row level security;

create policy "public pages" on pages for select using (published = true and (publish_at is null or publish_at <= now()));
create policy "public categories" on portfolio_categories for select using (true);
create policy "public projects" on projects for select using (published = true and (publish_at is null or publish_at <= now()));
create policy "public services" on services for select using (published = true and (publish_at is null or publish_at <= now()));
create policy "public plans" on plans for select using (published = true and (publish_at is null or publish_at <= now()));
create policy "public testimonials" on testimonials for select using (published = true and content_verified = true and (publish_at is null or publish_at <= now()));
create policy "public faqs" on faqs for select using (published = true and (publish_at is null or publish_at <= now()));
create policy "public media" on media for select using (rights_verified = true);
-- En producción, las consultas deben entrar por una Edge Function con rate limiting y validación.

create policy "admins manage pages" on pages for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage categories" on portfolio_categories for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage projects" on projects for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage services" on services for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage plans" on plans for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage testimonials" on testimonials for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage faqs" on faqs for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage inquiries" on inquiries for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage versions" on content_versions for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage trash" on content_trash for all using (is_site_admin()) with check (is_site_admin());
create policy "admins manage media" on media for all using (is_site_admin()) with check (is_site_admin());
create policy "admins read own profile" on admin_profiles for select using (user_id = auth.uid());

-- Tras crear el usuario en Supabase Auth, añade su UUID una sola vez desde SQL Editor:
-- insert into admin_profiles(user_id, role) values ('UUID-DEL-USUARIO', 'administrator');
