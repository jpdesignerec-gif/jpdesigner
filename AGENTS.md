# JEP Designer — guía rápida para agentes

## Objetivo del producto

JEP Designer es un portfolio comercial de Jonathan Peña: muestra trabajos, explica servicios, compara planes y convierte visitantes en solicitudes de cotización organizadas para WhatsApp y correo.

## Cómo trabajar aquí

1. Leer este archivo y `docs/PROJECT_STATUS.md` antes de editar.
2. Para cambios de contenido, respetar IDs estables y editar `src/data/seed.js` solo cuando el dato de ejemplo deba cambiar.
3. Para cambios visuales reutilizar componentes existentes antes de crear otros.
4. No guardar credenciales reales en Markdown, código, `localStorage` ni commits. Usar `.env.local` y consultar `docs/SETUP_AND_CREDENTIALS.md`.
5. Ejecutar `npm run audit` antes de entregar cambios.

## Comandos

```text
npm run dev       # vista local
npm test          # pruebas unitarias
npm run test:e2e  # pruebas públicas/admin en Chrome y móvil emulado
npm run build     # genera sitemap y producción
npm run audit     # unitarias + build
```

Las pruebas E2E usan el puerto aislado `4174` para no interferir con otra aplicación que pueda estar abierta en `5173`. La vista manual habitual continúa en `http://127.0.0.1:5173`.

## Rutas principales

- Público: `/`, `/portfolio`, `/portfolio/:slug`, `/servicios`, `/servicios/:slug`, `/planes`, `/contacto`, `/privacidad`, `/terminos`, `/cookies`.
- Admin: `/admin/acceso`, `/admin`, `/admin/paginas`, `/admin/contenido`, `/admin/portfolio`, `/admin/categorias`, `/admin/servicios`, `/admin/planes`, `/admin/consultas`, `/admin/medios`, `/admin/papelera`, `/admin/ajustes`.

## Archivos de referencia

- Estado y persistencia: `src/store/SiteStore.jsx`.
- Datos demo: `src/data/seed.js`.
- Vistas públicas: `src/pages/PublicPages.jsx`.
- Admin: `src/admin/Admin.jsx` y `src/admin/EditorialAdmin.jsx`.
- Constructor: `src/components/BlockBuilder.jsx` y `src/components/BlockRenderer.jsx`.
- Supabase/RLS: `supabase/schema.sql`.
- Arquitectura del editor: `EDITOR_ARQUITECTURA.md`.
- Estado completo: `docs/PROJECT_STATUS.md`.
