-- JEP Designer: políticas públicas/administrativas, índices y RPC segura.

create policy "public pages" on public.pages
for select to anon, authenticated
using (public.is_published(status, published, publish_at));

create policy "public categories" on public.portfolio_categories
for select to anon, authenticated
using (status = 'published');

create policy "public projects" on public.projects
for select to anon, authenticated
using (public.is_published(status, published, publish_at));

create policy "public services" on public.services
for select to anon, authenticated
using (public.is_published(status, published, publish_at));

create policy "public plans" on public.plans
for select to anon, authenticated
using (public.is_published(status, published, publish_at));

create policy "public testimonials" on public.testimonials
for select to anon, authenticated
using (
  public.is_published(status, published, publish_at)
  and content_verified = true
  and rights_verified = true
);

create policy "public faqs" on public.faqs
for select to anon, authenticated
using (public.is_published(status, published, publish_at));

create policy "public media" on public.media
for select to anon, authenticated
using (rights_verified = true);

create policy "public project tags" on public.project_tags
for select to anon, authenticated
using (exists (
  select 1 from public.projects p
  where p.id = project_tags.project_id
    and public.is_published(p.status, p.published, p.publish_at)
));

create policy "public service questions" on public.service_questions
for select to anon, authenticated
using (exists (
  select 1 from public.services s
  where s.id = service_questions.service_id
    and public.is_published(s.status, s.published, s.publish_at)
));

create policy "public site settings" on public.site_settings
for select to anon, authenticated
using (key = 'site');

create policy "admins manage pages" on public.pages for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage categories" on public.portfolio_categories for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage projects" on public.projects for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage services" on public.services for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage plans" on public.plans for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage testimonials" on public.testimonials for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage faqs" on public.faqs for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage inquiries" on public.inquiries for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage versions" on public.content_versions for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage trash" on public.content_trash for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage media" on public.media for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage tags" on public.project_tags for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage questions" on public.service_questions for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins read own profile" on public.admin_profiles for select to authenticated using (user_id = auth.uid());

create index if not exists pages_public_idx on public.pages (status, published, publish_at, sort_order);
create index if not exists categories_public_idx on public.portfolio_categories (status, sort_order);
create index if not exists projects_public_idx on public.projects (status, published, publish_at, featured, sort_order);
create index if not exists projects_category_idx on public.projects (category_id, sort_order);
create index if not exists services_public_idx on public.services (status, published, publish_at, sort_order);
create index if not exists plans_public_idx on public.plans (status, published, publish_at, featured, sort_order);
create index if not exists testimonials_public_idx on public.testimonials (status, published, publish_at, sort_order);
create index if not exists faqs_public_idx on public.faqs (status, published, publish_at, category, sort_order);
create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index if not exists versions_item_idx on public.content_versions (collection_name, item_id, created_at desc);
create index if not exists trash_collection_idx on public.content_trash (collection_name, deleted_at desc);
create index if not exists project_tags_tag_idx on public.project_tags (tag);
create index if not exists questions_order_idx on public.service_questions (service_id, sort_order);

create or replace function public.create_inquiry(
  p_service_id text,
  p_service_name text,
  p_plan_id text,
  p_contact jsonb,
  p_answers jsonb,
  p_files jsonb default '[]'::jsonb
)
returns public.inquiries
language plpgsql
security definer
set search_path = public
as $$
declare
  created public.inquiries;
begin
  if p_contact is null
    or length(trim(coalesce(p_contact->>'name', ''))) not between 2 and 120
    or length(trim(coalesce(p_contact->>'email', ''))) not between 5 and 254 then
    raise exception 'Los datos de contacto no son válidos';
  end if;

  if p_service_id is not null and not exists (select 1 from public.services where id = p_service_id) then
    raise exception 'El servicio no existe';
  end if;

  if p_plan_id is not null and not exists (select 1 from public.plans where id = p_plan_id) then
    raise exception 'El plan no existe';
  end if;

  insert into public.inquiries(service_id, service_name, plan_id, contact, answers, files, status)
  values (p_service_id, left(trim(p_service_name), 160), p_plan_id, p_contact, coalesce(p_answers, '{}'::jsonb), coalesce(p_files, '[]'::jsonb), 'new')
  returning * into created;

  return created;
end;
$$;

revoke all on function public.create_inquiry(text, text, text, jsonb, jsonb, jsonb) from public;
grant execute on function public.create_inquiry(text, text, text, jsonb, jsonb, jsonb) to anon, authenticated;
