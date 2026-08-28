-- JEP Designer: esquema inicial compatible con los IDs estables del frontend.
-- Ejecutar en un proyecto Supabase vacío mediante `supabase db push`.

create extension if not exists "pgcrypto";

create table if not exists public.pages (
  id text primary key,
  slug text unique not null,
  title text not null,
  eyebrow text,
  headline text,
  intro text,
  body jsonb not null default '[]'::jsonb,
  blocks jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  content_verified boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_categories (
  id text primary key,
  parent_id text references public.portfolio_categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0
);

create table if not exists public.projects (
  id text primary key,
  category_id text references public.portfolio_categories(id) on delete set null,
  title text not null,
  slug text unique not null,
  summary text,
  body text,
  blocks jsonb not null default '[]'::jsonb,
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  video_url text,
  tags text[] not null default '{}',
  services text[] not null default '{}',
  client text,
  project_year text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  content_verified boolean not null default false,
  rights_verified boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  slug text unique not null,
  summary text,
  ideal_for text,
  base_price numeric(10, 2),
  price_label text,
  delivery_time text,
  requirements text[] not null default '{}',
  deliverables text[] not null default '{}',
  questions jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  content_verified boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  eyebrow text,
  price numeric(10, 2),
  description text,
  ideal_for text,
  delivery_time text,
  revisions text,
  features text[] not null default '{}',
  formats text[] not null default '{}',
  not_included text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  seo jsonb not null default '{}'::jsonb,
  content_verified boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  role text,
  company text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  content_verified boolean not null default false,
  rights_verified boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  category text not null default 'general',
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  published boolean not null default false,
  publish_at timestamptz,
  content_verified boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  service_id text references public.services(id) on delete set null,
  service_name text,
  plan_id text references public.plans(id) on delete set null,
  contact jsonb not null,
  answers jsonb not null default '{}'::jsonb,
  files jsonb not null default '[]'::jsonb,
  internal_notes text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  collection_name text not null,
  item_id text not null,
  label text,
  snapshot jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.content_trash (
  id uuid primary key default gen_random_uuid(),
  collection_name text not null,
  item_id text not null,
  snapshot jsonb not null,
  deleted_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz not null default now()
);

create table if not exists public.media (
  id text primary key,
  name text not null,
  storage_path text unique not null,
  public_url text,
  mime_type text,
  alt_text text not null default '',
  rights_owner text,
  rights_verified boolean not null default false,
  focal_point jsonb not null default '{"x": 50, "y": 50}'::jsonb,
  variants jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('editor', 'administrator')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.project_tags (
  project_id text not null references public.projects(id) on delete cascade,
  tag text not null check (length(trim(tag)) between 1 and 80),
  created_at timestamptz not null default now(),
  primary key (project_id, tag)
);

create table if not exists public.service_questions (
  id text primary key,
  service_id text not null references public.services(id) on delete cascade,
  question_key text not null,
  label text not null,
  question_type text not null check (question_type in ('text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'color', 'date', 'file', 'color-multi')),
  options jsonb not null default '[]'::jsonb,
  help text,
  required boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (service_id, question_key)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  target_table text;
begin
  foreach target_table in array array['pages', 'projects', 'services', 'plans', 'testimonials', 'faqs', 'inquiries', 'service_questions', 'site_settings'] loop
    execute format('drop trigger if exists %I on public.%I', target_table || '_set_updated_at', target_table);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', target_table || '_set_updated_at', target_table);
  end loop;
end;
$$;

create or replace function public.is_published(p_status text, p_published boolean, p_publish_at timestamptz)
returns boolean
language sql
stable
as $$
  select p_status = 'published'
    and p_published = true
    and (p_publish_at is null or p_publish_at <= now());
$$;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and active = true
  );
$$;

alter table public.pages enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.plans enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.inquiries enable row level security;
alter table public.content_versions enable row level security;
alter table public.content_trash enable row level security;
alter table public.media enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.project_tags enable row level security;
alter table public.service_questions enable row level security;
alter table public.site_settings enable row level security;
