# Estado del proyecto

Última actualización: 28 de agosto de 2026.

## Implementado

- Inicio corto y comercial, portfolio con categorías, tags y páginas de proyecto.
- Servicios con 14 servicios, preguntas configurables por servicio, requisitos, entregables, precios y tiempos.
- Cotizador de tres pasos con respuestas etiquetadas, plan seleccionado, validación, WhatsApp y registro seguro de consultas y adjuntos en Supabase, con respaldo local cuando no hay conexión.
- Planes con comparación de características.
- Contacto, términos, cookies, privacidad, 404 comercial y navegación móvil.
- Tema oscuro/claro, buscador `Ctrl/Cmd + K`, menú contextual, notificaciones, diálogos, galerías, calendario, selector de color, carga de archivos y animaciones con reducción de movimiento.
- Constructor de bloques con texto, columnas, imágenes, banners, pantalla completa, galerías, vídeo, HTML, mapa, media-text, divisor, botones, redes, iconos, SVG, logos, emojis y fecha. Los bloques se pueden añadir, editar, duplicar, ocultar, arrastrar, subir, bajar y eliminar con confirmación.
- Admin con borradores, publicados, programados, vista previa privada, autoguardado, aviso de cambios, historial, restauración, duplicación, papelera, búsqueda, filtros, paginación, notas internas y CSV/PDF.
- SEO editable por contenido, canonical configurable, Open Graph, robots, sitemap generado en build, favicon y rutas de categorías.
- Medios con optimización WebP local, almacenamiento público administrado en Supabase, texto alternativo y verificación de derechos.
- Supabase Auth en producción, perfiles administrativos, persistencia editorial, RLS, Storage, consultas por RPC, versiones, papelera y ajustes compartidos.
- GitHub Pages preparado para publicar la web pública y el panel admin bajo el subdirectorio del repositorio; usa navegación hash en Pages para evitar errores 404 en rutas directas del hosting estático.
- Pruebas: 8 unitarias y 11 E2E aprobadas en Chrome escritorio y emulación móvil; una prueba de overflow se omite intencionalmente en el proyecto de escritorio.

## Estado de persistencia y despliegue

La aplicación usa Supabase cuando las variables públicas están configuradas. `localStorage` bajo `jep-site-data-v2` se mantiene como respaldo de experiencia y para desarrollo sin credenciales.

Las migraciones `0001`–`0006` están aplicadas en el proyecto Supabase `obqwguhxchtpyqmnxiaz`: esquema, políticas RLS, Storage público/privado, contenido inicial, alta administrativa y corrección del correo público. La validación remota confirma el usuario Auth `jpdesignerec@gmail.com`, 1 administrador activo y los buckets `jep-media` y `jep-inquiry-files` configurados con la visibilidad esperada.

La rama `main` está publicada mediante GitHub Actions en `https://jpdesignerec-gif.github.io/jpdesigner/`. El panel de producción está disponible en `https://jpdesignerec-gif.github.io/jpdesigner/#/admin/acceso` y usa Supabase Auth; las variables publicables están configuradas en GitHub sin incluir credenciales privilegiadas en el repositorio.

## Pendiente antes de producción

1. Confirmar el correo del primer usuario Auth si Supabase envió el mensaje y comprobar el inicio de sesión real del administrador.
2. Configurar correo transaccional y protección antispam/rate limiting antes de una campaña de alto tráfico.
3. Sustituir o verificar testimonios, proyectos, precios, derechos y contenido demo antes de presentarlos como reales.
4. Definir dominio final y actualizar `SITE_URL` cuando deje de usarse el dominio de GitHub Pages.
5. Ejecutar Lighthouse, WCAG 2.2, teclado/lector de pantalla y pruebas en dispositivos físicos.
6. Configurar backups periódicos de Supabase.

## Riesgos conocidos

- El login `demo2026` solo es para desarrollo y no debe habilitarse en producción.
- WhatsApp funciona como enlace `wa.me`; el aviso por correo de nuevas consultas requiere una función servidor.
- Los datos locales pueden contener consultas de prueba: exportar y limpiar antes de compartir.
- El contenido demo no debe presentarse como testimonio o proyecto auténtico sin verificación.
