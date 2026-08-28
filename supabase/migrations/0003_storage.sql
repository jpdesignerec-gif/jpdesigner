-- JEP Designer: recursos públicos del sitio y adjuntos privados de clientes.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jep-media',
  'jep-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jep-inquiry-files',
  'jep-inquiry-files',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
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

create policy "admins read inquiry files" on storage.objects
for select to authenticated
using (bucket_id = 'jep-inquiry-files' and public.is_site_admin());

create policy "visitors upload inquiry files" on storage.objects
for insert to anon, authenticated
with check (
  bucket_id = 'jep-inquiry-files'
  and (storage.foldername(name))[1] = 'incoming'
);

create policy "admins delete inquiry files" on storage.objects
for delete to authenticated
using (bucket_id = 'jep-inquiry-files' and public.is_site_admin());
