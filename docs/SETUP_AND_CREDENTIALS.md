# Configuración y credenciales

Este documento es una guía de configuración. No contiene secretos y no se deben pegar aquí tokens, contraseñas, claves privadas ni service-role keys.

## Variables locales

Copiar `.env.example` como `.env.local` y completar únicamente en la máquina o plataforma correspondiente:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ENABLE_ADMIN_DEMO=false
VITE_DEV_ADMIN_CODE=
SITE_URL=https://dominio-final.example
```

La `anon key` de Supabase puede ser pública si RLS está correctamente configurado. La `service_role key` nunca debe comenzar por `VITE_`, nunca debe entrar al navegador y nunca debe guardarse en este proyecto.

## Datos que debe configurar el propietario

- URL del proyecto Supabase.
- Anon key pública de Supabase.
- Correo del usuario administrador creado en Supabase Auth.
- Proveedor de correo transaccional y sus variables server-side.
- Proyecto/repositorio GitHub y rama de producción.
- Proyecto Vercel y dominio definitivo.
- Credenciales del proveedor DNS únicamente por el canal seguro del proveedor; no en el repositorio.

## Publicación en Supabase

Las migraciones de `supabase/migrations` son la fuente oficial. Incluyen tablas, RLS, consultas públicas seguras, Storage, contenido inicial y la ayuda para asignar administradores.

```text
npx supabase login
npx supabase link --project-ref obqwguhxchtpyqmnxiaz
npx supabase db push
```

Después:

1. Crear el usuario en Supabase → Authentication → Users.
2. En SQL Editor ejecutar `select public.promote_admin('correo-del-admin');`.
3. Probar `/admin/acceso` con ese correo y contraseña.
4. Confirmar que un visitante solo ve contenido publicado y no puede leer consultas ni adjuntos.

Si cambia `src/data/seed.js`, regenerar la migración inicial con `npm run db:seed-migration`. No se debe ejecutar una migración de seed nueva sobre contenido editorial ya administrado sin revisar primero los cambios.

## Publicación en GitHub Pages

En Settings → Secrets and variables → Actions configurar:

- Variable `VITE_SUPABASE_URL`.
- Secret `VITE_SUPABASE_ANON_KEY`.

En Settings → Pages seleccionar **GitHub Actions** como origen. Cada push a `main` compilará la web, conservará las rutas internas —incluido `/admin`— y publicará el resultado.

## Acceso de desarrollo

En `import.meta.env.DEV`, el panel usa temporalmente `VITE_DEV_ADMIN_CODE` o `demo2026`. En producción siempre usa Supabase Auth y el perfil de `admin_profiles`; el flujo demo queda deshabilitado.

## Regla de seguridad

Si una credencial se comparte accidentalmente en chat, archivo o commit, revocarla y regenerarla inmediatamente. Los agentes deben documentar el nombre de la variable necesaria, nunca su valor.
