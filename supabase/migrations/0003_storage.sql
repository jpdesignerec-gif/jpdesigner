-- JEP Designer: bucket privado de medios y adjuntos.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jep-media',
  'jep-media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins read jep media" on storage.objects
for select to authenticated
using (bucket_id = 'jep-media' and public.is_site_admin());

create policy "admins upload jep media" on storage.objects
for insert to authenticated
with check (bucket_id = 'jep-media' and public.is_site_admin());

create policy "admins update jep media" on storage.objects
for update to authenticated
using (bucket_id = 'jep-media' and public.is_site_admin())
with check (bucket_id = 'jep-media' and public.is_site_admin());

create policy "admins delete jep media" on storage.objects
for delete to authenticated
using (bucket_id = 'jep-media' and public.is_site_admin());
