-- Ayuda controlada para asignar el primer administrador desde SQL Editor.
-- Esta función no es accesible desde el navegador ni desde usuarios normales.

create or replace function public.promote_admin(
  p_email text,
  p_role text default 'administrator'
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user uuid;
begin
  if p_role not in ('editor', 'administrator') then
    raise exception 'Rol no válido';
  end if;

  select id into target_user
  from auth.users
  where lower(email) = lower(trim(p_email))
  limit 1;

  if target_user is null then
    raise exception 'No existe un usuario Auth con ese correo';
  end if;

  insert into public.admin_profiles (user_id, role, active)
  values (target_user, p_role, true)
  on conflict (user_id) do update set role = excluded.role, active = true;

  return target_user;
end;
$$;

revoke all on function public.promote_admin(text, text) from public, anon, authenticated;
grant execute on function public.promote_admin(text, text) to service_role;
