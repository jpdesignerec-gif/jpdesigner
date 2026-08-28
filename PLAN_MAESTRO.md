# Plan maestro — JEP Designer

## Objetivo

Construir una plataforma de portfolio, venta consultiva y gestión de contenido. La vista pública convierte visitas en solicitudes organizadas; el panel privado permite editar el sitio sin tocar código.

## Arquitectura

- Frontend: React + Vite, React Router y componentes reutilizables.
- Estado actual: datos versionados en `localStorage`, respaldo e importación JSON.
- Backend previsto: Supabase Postgres, Auth y Storage con políticas RLS.
- Formularios: metadatos configurables para preguntas distintas por servicio.
- Notificaciones previstas: función segura de correo y enlace organizado para WhatsApp.
- Publicación: Vercel con reescritura SPA y dominio después del despliegue.

## Mapa público

1. Jonathan / Inicio.
2. Portfolio, categorías, tags y detalle de proyecto.
3. Servicios, detalle y cotizador de tres pasos.
4. Planes.
5. Contacto.
6. Términos y condiciones.
7. Política de cookies.
8. Confirmación y página 404.

## Mapa administrativo

1. Acceso privado y dashboard.
2. Editor de páginas.
3. Portfolio y casos de estudio.
4. Categorías y subcategorías.
5. Servicios, requisitos y preguntas.
6. Planes y precios.
7. Bandeja de consultas.
8. Medios con optimización WebP.
9. Ajustes, exportación e importación.

## Componentes compartidos

- Encabezado, navegación móvil, pie de página y tema oscuro/claro.
- Tarjetas, galerías y carrusel.
- Editor de texto enriquecido.
- Formularios de texto, párrafo, número, lista, radio, fecha, archivos y múltiples colores.
- Calendario, calculadora, uploader, toggle y menú contextual.
- Buscador global `Ctrl/Cmd + K` y notificaciones.

## Fases restantes

1. Conectar Supabase y ejecutar `supabase/schema.sql`.
2. Sustituir el acceso de demostración por Supabase Auth.
3. Migrar contenido a tablas y medios a Storage.
4. Crear función de correo y registrar las consultas.
5. Añadir analítica con consentimiento de cookies.
6. Configurar GitHub, CI, Vercel y dominio.
7. Cargar proyectos, testimonios, textos legales y precios definitivos.
8. QA final de accesibilidad, SEO, rendimiento y formularios.

## Avance técnico — 21 de agosto de 2026

- Flujo editorial incorporado en páginas, proyectos, servicios, planes, FAQ y testimonios: borrador, publicación, programación, autoguardado, cambios pendientes, vista previa privada, versiones, restauración, duplicación y papelera.
- Administración con búsqueda global, filtros, paginación, notas privadas y exportación CSV/PDF de consultas.
- SEO editable por elemento, Open Graph, canonical configurable, categorías indexables, privacidad, 404 comercial y sitemap automático de 34 URLs de ejemplo.
- Medios preparados con variantes WebP, dimensiones, texto alternativo y verificación de derechos. Las URL y el `srcset` definitivos se producirán desde Supabase Storage.
- RLS preparado para que visitantes solo lean publicaciones vigentes y administradores activos gestionen contenido, consultas y archivos.
- Estados de carga, vacío y error; captura local de errores; foco seguro y avisos accesibles en editores, diálogos y cotizador.
- Pruebas automatizadas activas: 8 unitarias y 11 recorridos E2E aprobados en Chrome de escritorio y emulación móvil.

### Bloqueos externos para lanzamiento

- Credenciales de Supabase, GitHub, Vercel, proveedor de correo y dominio.
- Textos, precios, tiempos, proyectos, imágenes, autorizaciones y testimonios definitivos del propietario.
- Auditoría Lighthouse sobre la URL desplegada y validación física en Safari/iPhone, Firefox y Android real.
