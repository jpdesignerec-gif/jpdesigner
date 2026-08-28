# Arquitectura del editor modular — JEP Designer

## Objetivo

El editor permite construir páginas y casos de estudio sin modificar código. Cada documento conserva sus campos básicos y una lista ordenada de bloques. Los mismos datos alimentan el panel y el render público, por lo que no se duplican contenidos.

## Modelo de bloque

```json
{
  "id": "uuid-estable",
  "type": "mediaText",
  "visible": true,
  "anchor": "proceso",
  "className": "",
  "data": {}
}
```

- `id`: permite editar, mover y sincronizar un bloque sin confundirlo con otro.
- `type`: identifica el componente público y su formulario administrativo.
- `visible`: permite ocultar contenido sin eliminarlo.
- `anchor`: crea enlaces directos hacia una sección.
- `className`: extensión visual avanzada opcional.
- `data`: propiedades específicas del tipo de bloque.

En Supabase, la lista se almacena temporalmente como `jsonb`. Si más adelante se necesita colaboración, historial independiente o reutilización entre páginas, puede normalizarse en una tabla `content_blocks` sin cambiar el formato de cada bloque.

## Catálogo implementado

1. Texto enriquecido.
2. Dos o tres columnas.
3. Imagen a la izquierda y texto a la derecha.
4. Imagen a la derecha y texto a la izquierda.
5. Imagen pequeña, mediana, grande o de ancho completo.
6. Banner de ancho completo.
7. Imagen de pantalla completa.
8. Galería en mosaico, cuadrícula o carrusel.
9. Vídeo de YouTube, Vimeo o archivo directo.
10. Divisor lineal, punteado, degradado o con símbolo.
11. Botones y enlaces.
12. Redes sociales.
13. Mapa incrustado.
14. HTML o iframe incrustado.
15. Selector de iconos.
16. Biblioteca de formas SVG.
17. Logos individuales o en tira.
18. Selector de emojis.
19. Fecha o evento.
20. Paleta con HEX, RGB, CMYK y HSB.

## Operaciones editoriales

- Añadir bloques desde una biblioteca con búsqueda y categorías.
- Abrir y cerrar la configuración de cada bloque.
- Arrastrar para reordenar.
- Subir y bajar mediante controles visibles y accesibles por teclado.
- Duplicar.
- Eliminar con confirmación.
- Ocultar sin eliminar.
- Añadir anclas y clases opcionales.
- Subir imágenes optimizadas a WebP en la maqueta local.
- Elegir imágenes de la biblioteca de medios.

## Editor de texto

Incluye negrita, cursiva, subrayado, tachado, listas, lista numerada, cita, alineación, enlaces, títulos, código, deshacer y rehacer. El contenido se guarda como HTML dentro del bloque.

Para una futura edición colaborativa o documentos extremadamente complejos, se recomienda sustituir únicamente este control por Lexical. Su estado serializable y arquitectura por nodos encajan con el modelo actual; el resto del builder no necesita cambiar.

## Decisiones de accesibilidad y rendimiento

- Los diálogos usan `<dialog>` nativo para foco, cierre con Escape y fondo inerte.
- El orden siempre puede cambiarse sin arrastrar, mediante botones subir/bajar.
- El cursor personalizado es CSS y no ejecuta animaciones JavaScript en cada movimiento.
- La barra de desplazamiento usa propiedades CSS nativas.
- Las imágenes conservan texto alternativo, ajuste, proporción y tamaño explícitos.
- Las imágenes usan optimización local; en producción se moverán a Supabase Storage.

## Pendientes para producción

1. Sanitizar HTML e iframes mediante una lista de etiquetas y dominios permitidos.
2. Sustituir imágenes base64 por Supabase Storage y URLs versionadas.
3. Añadir historial de revisiones, borradores y recuperación automática.
4. Incorporar vista previa en una segunda ventana o panel lateral.
5. Validar enlaces rotos y campos obligatorios antes de publicar.
6. Añadir permisos por rol y registro de quién realizó cada cambio.
7. Considerar Lexical si se requiere edición colaborativa o comentarios dentro del texto.
8. Generar el sitemap dinámicamente desde proyectos y servicios publicados.
