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

## Datos que debe entregar el propietario

- URL del proyecto Supabase.
- Anon key pública de Supabase.
- UUID del usuario administrador creado en Supabase Auth.
- Proveedor de correo transaccional y sus variables server-side.
- Proyecto/repositorio GitHub y rama de producción.
- Proyecto Vercel y dominio definitivo.
- Credenciales del proveedor DNS únicamente por el canal seguro del proveedor; no en el repositorio.

## Orden de conexión

1. Ejecutar `supabase/schema.sql` en el SQL Editor.
2. Crear el usuario en Authentication → Users.
3. Insertar su UUID en `admin_profiles` con rol `administrator`.
4. Configurar Auth y RLS; comprobar que un visitante no puede leer borradores.
5. Migrar el contenido de `seedData` y revisar slugs.
6. Configurar Storage y reemplazar URLs base64 por URLs versionadas.
7. Configurar la función segura de consultas y correo.
8. Añadir las variables en Vercel y desplegar.

## Acceso de desarrollo

En `import.meta.env.DEV`, el panel usa temporalmente `VITE_DEV_ADMIN_CODE` o `demo2026`. Este mecanismo existe solo para pruebas locales. Antes del lanzamiento debe quedar deshabilitado y reemplazarse por Supabase Auth.

## Regla de seguridad

Si una credencial se comparte accidentalmente en chat, archivo o commit, revocarla y regenerarla inmediatamente. Los agentes deben documentar el nombre de la variable necesaria, nunca su valor.

