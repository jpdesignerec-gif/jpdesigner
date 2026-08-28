# Investigación competitiva y plan de implementación — JEP Designer

Fecha de revisión: 24 de agosto de 2026

## Resumen ejecutivo

JEP Designer tiene una ventaja poco común frente a muchos portfolios: no es solo una galería, sino una experiencia de venta consultiva con servicios parametrizados, paquetes, preguntas por servicio y un área editorial preparada para crecer. El mayor riesgo no es la falta de funciones; es que el contenido demo, la falta de casos demostrables y la persistencia local pueden hacer que una experiencia visual muy buena no se convierta todavía en confianza comercial real.

La prioridad recomendada es convertir el sitio en un sistema de evidencia: cada caso debe explicar problema, decisión, entregables y resultado; cada servicio debe indicar para quién es, qué incluye, qué no incluye y cómo comienza; y cada CTA debe llevar a una acción medible. Después de eso conviene cerrar la migración a Supabase, seguridad, correo, analítica con consentimiento y QA de producción.

## Investigación de competencia

### Competidores y referencias observadas

| Referencia | Qué hace bien | Riesgo o limitación | Aprendizaje aplicable |
| --- | --- | --- | --- |
| Behance Hire | Agrupa especialidades, muestra servicios comprables, facilita descubrimiento y añade una ruta de contratación y pago. | Compite por volumen; el diseñador puede parecer intercambiable. | Mantener una propuesta propia y mostrar alcance/entregables desde el primer contacto. |
| Dribbble | Tiene una fuerte cultura visual, descubrimiento por piezas y una ruta de contratación para empresas. | La pieza aislada prioriza estética sobre contexto y resultados. | Usar imágenes atractivas para captar atención, pero casos de estudio para cerrar confianza. |
| Firmas y freelancers listados en Clutch Colombia | Presentan especialidades, ubicación, reputación y servicios comparables para compradores que ya están evaluando proveedores. | La comparación puede reducirse a precio, rating y número de proyectos. | Reforzar nicho, proceso, prueba verificable y expectativa de respuesta. |
| Portfolios editoriales destacados | Comunican una perspectiva reconocible y ordenan servicios sin abrumar; los mejores combinan narrativa, selección y claridad comercial. | Una dirección visual muy experimental puede ocultar qué se compra. | Conservar la personalidad naranja/ink, pero hacer más explícita la oferta y el siguiente paso. |

Fuentes consultadas:

- [Behance — contratar freelancers y servicios creativos](https://www.behance.net/hire?locale=en_US)
- [Behance — servicios de freelance](https://www.behance.net/hire/services?locale=en_US)
- [Dribbble — búsqueda de portfolios](https://dribbble.com/search/portfolio-style)
- [Clutch — firmas de diseño gráfico en Colombia](https://clutch.co/co/agencies/graphic-designers)
- [Creative Bloq — ejemplos de portfolios de diseño](https://www.creativebloq.com/portfolios/examples-712368)
- [Creative Bloq — web propia frente a redes sociales en 2026](https://www.creativebloq.com/professional-development/creative-careers/in-the-age-of-social-media-do-designers-still-need-a-website-in-2026)

### Posicionamiento recomendado

No conviene competir con Behance o Dribbble por cantidad de piezas. La posición más defendible es: **diseñador independiente que convierte ideas poco claras en sistemas visuales utilizables, con alcance transparente y un proceso fácil de iniciar**.

Ese posicionamiento exige tres pruebas en la interfaz:

1. Un caso de estudio que explique decisiones, no solo imágenes.
2. Un menú de servicios agrupado por necesidad del cliente, no únicamente por disciplina.
3. Una cotización breve que reduzca incertidumbre sobre precio base, tiempos, revisiones y entregables.

## Auditoría del estado actual

### Corregido en esta revisión

- Error de ejecución en `/portfolio/:slug`: `ProjectDetailPage` referenciaba `preview` sin declararlo. Ahora utiliza el modo de preview editorial existente.
- Portfolio sin resultados: antes podía quedar visualmente vacío; ahora muestra un estado claro y accionable.
- Prueba social del hero: se retiraron cifras demo (`+120`, `+200`, `4.9/5`) que podían interpretarse como métricas reales. Se muestran señales derivadas del contenido publicado/configurado.

### Riesgos pendientes de mayor impacto

- El contenido de proyectos, testimonios, precios y métricas todavía debe sustituirse por información verificable del propietario.
- El login administrativo continúa siendo de demostración y no debe exponerse en producción.
- Las consultas se guardan en `localStorage`; se perderán si el navegador se limpia y no existe recepción server-side.
- WhatsApp es un enlace; correo, adjuntos, anti-spam y rate limiting necesitan una función segura.
- El sitio no tiene todavía una medición de conversión activa con consentimiento.
- No se ha ejecutado Lighthouse/WCAG sobre un despliegue real ni se ha validado Safari/iPhone físico.
- Las 14 opciones de servicio pueden producir carga cognitiva; deben agruparse por objetivo o tipo de cliente.

## Plan completo de implementación

### Fase 0 — Contenido y decisiones de negocio

Objetivo: evitar construir automatizaciones alrededor de datos de ejemplo.

- Confirmar mercado prioritario: Ecuador, Colombia, remoto internacional o combinación.
- Definir tres perfiles principales: emprendimiento inicial, negocio en crecimiento y empresa con sistema existente.
- Revisar nombre, moneda, impuestos, precios base, plazos, rondas, anticipos y política de urgencias.
- Validar cada proyecto: cliente, autorización de publicación, año, servicios, imágenes, resultado y testimonial.
- Reescribir la home en una sola promesa comercial y preparar una versión corta para SEO.
- Crear un inventario de imágenes con fuente, derechos, texto alternativo, relación de aspecto y tamaño.

Entregable: `docs/CONTENT_HANDOFF.md` completado con información real y aprobación del propietario.

### Fase 1 — Conversión y arquitectura de información

Objetivo: que un visitante entienda rápidamente si JEP Designer es adecuado y cómo empezar.

- Agrupar servicios en 4–5 familias: marca, piezas para vender, digital, ilustración y espacios/eventos.
- Añadir filtro por necesidad además de categoría técnica.
- Convertir cada caso en plantilla: contexto, reto, enfoque, sistema, entregables, resultado, créditos y CTA.
- Incorporar una etiqueta de disponibilidad real y tiempo estimado de respuesta.
- En cada detalle de servicio, hacer visibles “ideal para”, inversión desde, tiempo, revisiones, entregables y exclusiones.
- Añadir CTA contextual desde cada proyecto: “Necesito algo parecido”.
- Mantener un CTA primario consistente: cotizar; los enlaces sociales deben quedar secundarios.

Indicadores: clics a cotizador por sesión, inicio/completitud del cotizador, contacto por proyecto y porcentaje de rebote de home.

### Fase 2 — Sistema visual y accesibilidad

Objetivo: mantener la personalidad de la marca sin sacrificar legibilidad o velocidad.

- Mantener el canvas ink, naranja y crema, pero limitar efectos decorativos en móvil.
- Revisar contraste de texto secundario y estados hover/focus con WCAG 2.2 AA.
- Garantizar foco visible, orden de tabulación, cierre de diálogos con Escape y retorno de foco.
- Revisar todos los textos alternativos; las imágenes decorativas deben llevar `alt=""`.
- Añadir estados de carga, error y vacío a portfolio, servicios, cotizador y contacto.
- Optimizar imágenes a WebP/AVIF cuando exista Storage; definir tamaños responsivos y `width`/`height` para evitar saltos.
- Medir LCP, CLS, INP y peso JavaScript en móvil de gama media.

Objetivo técnico recomendado: Lighthouse móvil ≥90 en rendimiento, accesibilidad, buenas prácticas y SEO, sin convertir el número en sustituto de pruebas manuales.

### Fase 3 — Backend y seguridad de producción

Objetivo: reemplazar la demo local por una operación confiable.

- Crear proyecto Supabase y ejecutar `supabase/schema.sql` en un entorno de staging.
- Configurar Auth; eliminar `demo2026` y bloquear rutas administrativas sin sesión válida.
- Confirmar RLS con una cuenta de visitante, una cuenta admin y una cuenta sin permisos.
- Migrar páginas, categorías, proyectos, servicios, preguntas, planes, FAQs y testimonios.
- Crear Storage privado para adjuntos y medios; servir URLs transformadas y con expiración cuando aplique.
- Crear Edge Function para recibir consultas, validar payload, aplicar rate limiting y enviar correo.
- Guardar la consulta antes de intentar notificar; registrar estado de entrega y reintento.
- Añadir protección anti-spam: honeypot, límite por IP/ventana, longitud máxima y validación MIME/tamaño.
- Mantener exportación y backup antes de cualquier migración destructiva.

### Fase 4 — Analítica y crecimiento

Objetivo: conocer qué oferta atrae y cuál convierte.

- Implementar eventos sin datos personales: `view_project`, `select_service`, `start_quote`, `complete_quote`, `contact_click` y `plan_select`.
- Activarlos únicamente después del consentimiento de analítica.
- Crear UTMs para Instagram, Behance, referencias y campañas.
- Medir por servicio: vistas, inicios, abandonos por pregunta y contactos terminados.
- Publicar casos de estudio indexables y páginas de servicio orientadas a intención local.
- Mantener perfiles de Behance/Instagram como canales de descubrimiento y usar el sitio como espacio de decisión y conversión.

### Fase 5 — QA, despliegue y operación

- Ejecutar unitarias, E2E, build y auditoría en CI.
- Probar Chrome, Firefox, Safari, Android real y iPhone real; revisar teclado y lector de pantalla.
- Verificar rutas directas, refresh SPA, sitemap, robots, canonical, Open Graph, favicon y 404.
- Configurar variables en Vercel: URL pública, Supabase público, proveedor de correo y secretos solo server-side.
- Activar dominio y HTTPS; confirmar que el sitemap no conserva URLs demo.
- Definir backup semanal, revisión mensual de contenido y responsable de consultas.
- Revisar legalmente privacidad, cookies, derechos de imagen, propiedad intelectual y conservación de adjuntos.

## Backlog priorizado

### P0 — Antes de mostrar el sitio públicamente

- Sustituir contenido demo y métricas no verificadas.
- Migrar autenticación y consultas fuera de `localStorage`.
- Probar el detalle de proyecto, cotizador y contacto en navegadores reales.
- Confirmar derechos de imágenes y testimonios.

### P1 — Próxima iteración de conversión

- Agrupar los 14 servicios.
- Plantilla completa de caso de estudio.
- CTA contextual desde proyecto y servicio.
- Eventos de analítica con consentimiento.
- Corrección de contraste, foco y navegación de diálogos.

### P2 — Escala y mantenimiento

- Automatización de publicación y backups.
- Optimización AVIF/WebP desde Storage.
- Landing pages de intención local y campañas.
- Biblioteca de testimonios verificables y resultados medibles.

## Criterios de aceptación

La implementación se considera lista cuando un visitante puede identificar la especialidad en cinco segundos, revisar al menos tres casos con contexto, encontrar un servicio apropiado sin ayuda, iniciar y completar una cotización desde móvil, y el propietario puede recibir/gestionar esa consulta de forma segura. Además, no debe haber credenciales en el cliente, los contenidos demo deben estar marcados o eliminados, y la auditoría automatizada más las comprobaciones manuales de accesibilidad deben pasar.
