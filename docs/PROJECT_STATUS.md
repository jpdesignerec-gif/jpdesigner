# Estado del proyecto

Última actualización: 21 de agosto de 2026.

## Implementado

- Inicio corto y comercial, portfolio con categorías, tags y páginas de proyecto.
- Servicios con 14 servicios, preguntas configurables por servicio, requisitos, entregables, precios y tiempos.
- Cotizador de tres pasos con respuestas etiquetadas, plan seleccionado, validación, WhatsApp y registro local de consultas.
- Planes con comparación de características.
- Contacto, términos, cookies, privacidad, 404 comercial y navegación móvil.
- Tema oscuro/claro, buscador `Ctrl/Cmd + K`, menú contextual, notificaciones, diálogos, galerías, calendario, selector de color, carga de archivos y animaciones con reducción de movimiento.
- Constructor de bloques con texto, columnas, imágenes, banners, pantalla completa, galerías, vídeo, HTML, mapa, media-text, divisor, botones, redes, iconos, SVG, logos, emojis y fecha. Los bloques se pueden añadir, editar, duplicar, ocultar, arrastrar, subir, bajar y eliminar con confirmación.
- Admin con borradores, publicados, programados, vista previa privada, autoguardado, aviso de cambios, historial, restauración, duplicación, papelera, búsqueda, filtros, paginación, notas internas y CSV/PDF.
- SEO editable por contenido, canonical configurable, Open Graph, robots, sitemap generado en build, favicon y rutas de categorías.
- Medios con optimización WebP local, dimensiones, texto alternativo y verificación de derechos.
- Pruebas: 8 unitarias y 11 E2E aprobadas en Chrome escritorio y emulación móvil; una prueba de overflow se omite intencionalmente en el proyecto de escritorio.

## Estado de persistencia

La aplicación actual usa `localStorage` bajo `jep-site-data-v2` para que pueda probarse sin credenciales. `SiteStore` mantiene una interfaz estable para migrar a Supabase.

El archivo `supabase/schema.sql` ya contiene tablas, estados editoriales, versiones, papelera, medios, perfiles admin y políticas RLS. Aún no se ha ejecutado contra un proyecto real.

## Pendiente antes de producción

1. Crear proyecto Supabase y ejecutar el esquema.
2. Crear usuario Auth y registrarlo en `admin_profiles` con su UUID.
3. Sustituir login demo por Supabase Auth y mover escritura de consultas/archivos a funciones seguras.
4. Configurar Storage privado, transformación de imágenes, límites de tamaño y limpieza de archivos no usados.
5. Configurar correo transaccional para `jepdesigner.ec@gmail.com` y antispam/rate limiting.
6. Cargar textos, precios, tiempos, revisiones, inclusiones, exclusiones, proyectos, testimonios y derechos reales.
7. Definir dominio final y `SITE_URL`; regenerar sitemap en CI/Vercel.
8. Ejecutar Lighthouse, WCAG 2.2, teclado/lector de pantalla y pruebas en Safari/iPhone, Firefox y Android físico.
9. Configurar GitHub, Vercel, variables de entorno y backups.

## Riesgos conocidos

- El login `demo2026` solo es para desarrollo y no debe habilitarse en producción.
- WhatsApp funciona como enlace `wa.me`; el correo real requiere una función servidor.
- Los datos locales pueden contener consultas de prueba: exportar y limpiar antes de compartir.
- El contenido demo no debe presentarse como testimonio o proyecto auténtico sin verificación.

