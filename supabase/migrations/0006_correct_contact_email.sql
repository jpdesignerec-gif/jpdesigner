-- Corrige el correo público de contacto sin alterar el resto de la configuración.
update public.site_settings
set value = jsonb_set(value, '{email}', to_jsonb('jpdesignerec@gmail.com'::text)),
    updated_at = now()
where key = 'site';
