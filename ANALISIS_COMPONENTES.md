# Auditoría completa de componentes — JEP Designer

## Resumen ejecutivo

La aplicación ya resuelve la navegación pública, el portfolio, los servicios, el cotizador, los planes, contacto y un panel administrativo local. La arquitectura es válida para continuar hacia Supabase, pero todavía faltan componentes que aumentan conversión, confianza, accesibilidad, SEO y control editorial.

La prioridad no debe ser añadir elementos decorativos indiscriminadamente. Primero deben completarse los recorridos que afectan adquisición de clientes, claridad de la oferta y administración del contenido.

## Estado actual

| Área | Estado | Observación |
| --- | --- | --- |
| Navegación pública y móvil | Completa | Menú superior, menú móvil y rutas SPA. |
| Portfolio y proyectos | Avanzada | Categorías, tags, detalles y galería básica. |
| Servicios | Avanzada | 14 servicios con preguntas y entregables propios. |
| Cotizador | Funcional local | Guarda consultas y prepara WhatsApp; correo de servidor pendiente. |
| Planes | Completa en maqueta | Contenido detallado, comparación visual y CRUD. |
| Contacto | Funcional local | Correo transaccional pendiente. |
| Administración | Avanzada | CRUD para portfolio, categorías, servicios, planes, FAQ y testimonios. |
| Medios | Prototipo | Optimiza a WebP, pero `localStorage` no es almacenamiento definitivo. |
| Autenticación | Demostración | Debe sustituirse por Supabase Auth. |
| SEO | Parcial | Metadatos dinámicos, canonical, robots y sitemap listos; faltan Open Graph y datos estructurados. |
| Cookies y privacidad | Parcial | Banner y preferencias listos; falta definir analítica final y una política de privacidad específica. |
| Accesibilidad | Avanzada | Responsive, semántica y skip-link; falta auditoría WCAG completa y control de foco en todos los diálogos. |

## Implementado en esta iteración

- Botón flotante de WhatsApp y retorno al inicio.
- Consentimiento de cookies con preferencias necesarias, funcionales y analíticas.
- Metadatos por ruta, descripción y URL canonical.
- `robots.txt` y `sitemap.xml` iniciales.
- Migas de pan en proyectos y servicios.
- Preguntas frecuentes y testimonios editables.
- Comparador visual de paquetes.
- Galería con carrusel, mosaico y lightbox.
- Selector múltiple de color con HEX, RGB, CMYK y HSB.
- CRUD y reordenamiento para servicios y planes.
- Esquema Supabase ampliado para entregables, FAQ y testimonios.
- Constructor modular con 19 familias visuales y 20 variaciones de bloque.
- Edición, duplicado, eliminación, visibilidad y reordenamiento por arrastre o botones.
- Render público compartido para páginas y casos de estudio.
- Biblioteca de imágenes, iconos, SVG, logos y emojis.
- Diálogos nativos, notificaciones apiladas, cursor CSS y scrollbar de marca.

## Componentes críticos faltantes

### Conversión y confianza

1. Botón flotante de WhatsApp accesible desde cualquier página.
2. Preguntas frecuentes editables para reducir dudas antes de cotizar.
3. Carrusel de testimonios administrable.
4. Comparador de paquetes para entender diferencias sin leer tres tarjetas completas.
5. Breadcrumbs en proyectos y servicios para orientar al visitante.
6. Estados de envío, error y confirmación conectados a un servicio real.

### Privacidad, SEO y calidad

1. Banner y centro de preferencias de cookies.
2. Metadatos únicos por página, proyecto y servicio.
3. Open Graph, Twitter Cards, canonical, `robots.txt` y `sitemap.xml`.
4. Datos estructurados para negocio, servicios y portfolio.
5. Página de privacidad independiente si se activa analítica o almacenamiento de contactos.
6. Gestión del consentimiento antes de cargar herramientas analíticas.

### Componentes de contenido

1. Galería con carrusel, mosaico y lightbox.
2. Editor de galerías en el admin con orden y eliminación.
3. Editor enriquecido con títulos, enlaces, listas y deshacer/rehacer.
4. Selector profesional de color con HEX, RGB, CMYK y HSB.
5. Bloques reutilizables: FAQ, testimonios, proceso, CTA, métricas y comparador.
6. Vista previa de borradores.

### Administración

1. CRUD completo para servicios y planes.
2. Reordenamiento de servicios, planes, preguntas, páginas y categorías.
3. Editor de testimonios y preguntas frecuentes.
4. Búsqueda administrativa funcional.
5. Notas internas y seguimiento de consultas.
6. Roles de administrador cuando se conecte Supabase Auth.
7. Historial de cambios o borradores para evitar pérdidas accidentales.

### Infraestructura pendiente de credenciales

1. Supabase Postgres y Storage.
2. Autenticación real y políticas RLS.
3. Función de correo para `jepdesigner.ec@gmail.com`.
4. URLs públicas de archivos y límites de carga.
5. GitHub, Vercel, dominio y variables de entorno.
6. Analítica y monitoreo de errores.

## Prioridades de desarrollo

### P0 — Antes de publicar

- Supabase Auth y persistencia real.
- Envío seguro del formulario y almacenamiento de consultas.
- Cookies, privacidad, SEO básico y pruebas de accesibilidad.
- Sustituir contenidos de demostración por información definitiva.

### P1 — Implementación actual

- WhatsApp flotante, cookies, SEO por ruta y skip-link.
- FAQ y testimonios desde el modelo de contenido.
- Comparador de planes.
- Color profesional y galería avanzada.
- CRUD de servicios, planes, FAQ y testimonios.

### P2 — Mejora posterior

- Agenda de disponibilidad real.
- Plantillas de páginas mediante bloques reordenables.
- Historial de versiones y colaboración.
- Analítica del embudo: visita → servicio → cotización → contacto.
- Automatización de correos y seguimiento.

## Criterios de finalización

Un componente se considera terminado cuando funciona en escritorio y móvil, se puede usar con teclado, lee y escribe desde el modelo central, tiene estado vacío y de error, no rompe la compilación y está preparado para reemplazar `localStorage` por Supabase sin cambiar su interfaz pública.

## Auditoría de experiencia y movimiento — 21 de agosto de 2026

### Incorporado

- Sistema global de apariciones al entrar en pantalla para títulos, servicios, proyectos, planes, preguntas, procesos y bloques editoriales.
- Entrada comercial escalonada del hero, profundidad de puntero limitada a la imagen y movimiento ambiental de elementos flotantes.
- Cinta de especialidades realmente infinita, sin huecos en monitores ultrawide, con pausa al pasar el cursor.
- Microinteracciones coherentes en botones, tarjetas de servicios, proyectos, enlaces de contacto e indicadores.
- Menú contextual público con clic derecho y pulsación prolongada: abrir/copiar enlaces, abrir/copiar imágenes, copiar texto seleccionado, búsqueda, cotización, tema y compartir página.
- Variante táctil del menú como hoja inferior, límites de pantalla, cierre con Escape, foco inicial y etiquetas semánticas.
- Respeto integral por `prefers-reduced-motion`; todas las animaciones decorativas se eliminan si el visitante solicita menos movimiento.
- Animaciones limitadas principalmente a `transform` y `opacity` para evitar recalcular el diseño durante cada fotograma.

### Faltantes confirmados antes de producción

1. **Persistencia real:** conectar páginas, portfolio, servicios, planes, consultas y medios a Supabase; hoy siguen dependiendo del almacenamiento local.
2. **Seguridad del administrador:** activar Supabase Auth, sesión segura, recuperación de acceso, roles y RLS. La protección local actual no es suficiente para publicar.
3. **Flujo editorial:** borrador, vista previa privada, publicación programada, historial de versiones, restauración y aviso de cambios sin guardar.
4. **Formularios de producción:** endpoint de correo, almacenamiento real de adjuntos, validación en servidor, límite de frecuencia, protección antispam y consentimiento de contacto.
5. **Gestión profesional de medios:** texto alternativo obligatorio, punto focal, recorte por formato, reemplazo sin romper URLs, variantes responsive y limpieza de archivos sin uso.
6. **Calidad operativa:** página de error de servidor, estados skeleton, reintento de carga, monitoreo de errores y copia de seguridad/exportación del contenido.
7. **Medición:** eventos del embudo portfolio → servicio → cotización → WhatsApp/correo, siempre condicionados al consentimiento.
8. **SEO final:** imagen Open Graph administrable por página/proyecto, URL del dominio definitivo y sitemap generado desde el contenido publicado.
9. **Accesibilidad final:** prueba WCAG 2.2 manual, trampa y restauración de foco en todos los diálogos, contraste en ambos temas y pruebas con lector de pantalla.
10. **Rendimiento final:** imágenes `srcset`, precarga selectiva de portada/fuentes, presupuesto de JavaScript y auditoría Lighthouse sobre Vercel.

### Próximo orden recomendado

- **P0:** Supabase Auth + RLS, persistencia y envío seguro de cotizaciones.
- **P1:** borradores/versionado, medios y estados de carga/error.
- **P2:** analítica consentida, SEO final, auditoría WCAG/Lighthouse y pruebas de aceptación móvil.

> Actualización: los puntos de flujo editorial, medios, estados, SEO editable, sitemap, foco de diálogos y pruebas automatizadas ya están implementados en local. Permanecen pendientes únicamente las integraciones que requieren credenciales, el contenido auténtico y la auditoría sobre el despliegue final.

## Sistema de animación premium — ampliación

El movimiento ya funciona como una capa transversal del producto y no únicamente en el inicio:

- Transiciones cinematográficas entre rutas públicas y secciones administrativas.
- Revelados alternados y escalonados para contenido, tablas, galerías, formularios y bloques del editor.
- Botones magnéticos, ondas de pulsación y navegación con respuesta elástica.
- Profundidad 3D moderada en tarjetas mediante puntero, desactivada en pantallas táctiles.
- Contadores progresivos en estadísticas públicas y métricas del administrador.
- Dibujado animado de iconos SVG, revelado por máscara de imágenes y brillo cromático de titulares.
- Estados animados para FAQ, galerías, comparadores, selectores, calendarios, cargas de archivos y opciones del cotizador.
- Entradas específicas para diálogos, buscador, lightbox, cookies, notificaciones, WhatsApp y retorno al inicio.
- Movimiento coherente para sidebar, métricas, tablas, tarjetas, filas, constructor de bloques y editor a pantalla completa.
- Punto de luz ambiental controlado por el cursor sin alterar el diseño ni capturar eventos.
- Adaptación móvil sin inclinaciones 3D ni magnetismo y anulación global mediante `prefers-reduced-motion`.
