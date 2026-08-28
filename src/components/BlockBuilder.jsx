import { useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo2,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";
import { useSite } from "../store/SiteStore";
import { ColorStudio } from "./ColorStudio";
import { blockCatalog, createBlock } from "./BlockRenderer";
import { ConfirmDialog, StudioDialog } from "./Feedback";

export function BlockBuilder({
  value = [],
  onChange,
  label = "Constructor de bloques",
}) {
  const [palette, setPalette] = useState(false),
    [expanded, setExpanded] = useState(null),
    [deleting, setDeleting] = useState(null),
    [dragging, setDragging] = useState(null);
  const add = (type) => {
    const block = createBlock(type);
    onChange([...value, block]);
    setExpanded(block.id);
    setPalette(false);
  };
  const update = (id, patch) =>
    onChange(
      value.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    );
  const updateData = (id, patch) =>
    onChange(
      value.map((block) =>
        block.id === id
          ? { ...block, data: { ...block.data, ...patch } }
          : block,
      ),
    );
  const move = (id, direction) => {
    const next = [...value],
      index = next.findIndex((x) => x.id === id),
      target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const moveTo = (id, targetId) => {
    if (id === targetId) return;
    const next = [...value],
      from = next.findIndex((x) => x.id === id),
      to = next.findIndex((x) => x.id === targetId),
      [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  const duplicate = (id) => {
    const source = value.find((x) => x.id === id);
    const copy = { ...structuredClone(source), id: crypto.randomUUID() };
    const index = value.findIndex((x) => x.id === id);
    onChange([...value.slice(0, index + 1), copy, ...value.slice(index + 1)]);
    setExpanded(copy.id);
  };
  return (
    <div className="block-builder">
      <div className="builder-head">
        <div>
          <span className="eyebrow">Editor modular</span>
          <h3>{label}</h3>
          <p>
            {value.length} bloques · arrastra o usa las flechas para ordenar
          </p>
        </div>
        <button
          type="button"
          className="button primary small"
          onClick={() => setPalette(true)}
        >
          <Plus />
          Añadir bloque
        </button>
      </div>
      {!value.length ? (
        <button
          type="button"
          className="builder-empty"
          onClick={() => setPalette(true)}
        >
          <Plus />
          <b>Construye esta página por bloques</b>
          <span>Texto, imágenes, galerías, vídeo, columnas y más.</span>
        </button>
      ) : (
        <div className="builder-list">
          {value.map((block, index) => {
            const meta = blockCatalog.find((x) => x.type === block.type);
            const open = expanded === block.id;
            return (
              <article
                className={`builder-block ${open ? "open" : ""} ${block.visible === false ? "is-hidden" : ""}`}
                key={block.id}
                draggable
                onDragStart={() => setDragging(block.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  moveTo(dragging, block.id);
                  setDragging(null);
                }}
              >
                <header>
                  <button
                    type="button"
                    className="drag-handle"
                    aria-label="Arrastrar bloque"
                  >
                    <GripVertical />
                  </button>
                  <span className="block-glyph">{meta?.icon}</span>
                  <button
                    type="button"
                    className="block-title"
                    onClick={() => setExpanded(open ? null : block.id)}
                  >
                    <b>{meta?.label || block.type}</b>
                    <small>
                      Bloque {String(index + 1).padStart(2, "0")}{" "}
                      {block.visible === false ? "· oculto" : ""}
                    </small>
                  </button>
                  <div className="block-actions">
                    <button
                      type="button"
                      onClick={() => move(block.id, -1)}
                      disabled={index === 0}
                      aria-label="Subir bloque"
                    >
                      <ArrowUp />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(block.id, 1)}
                      disabled={index === value.length - 1}
                      aria-label="Bajar bloque"
                    >
                      <ArrowDown />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicate(block.id)}
                      aria-label="Duplicar bloque"
                    >
                      <Copy />
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => setDeleting(block.id)}
                      aria-label="Eliminar bloque"
                    >
                      <Trash2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : block.id)}
                      aria-label={open ? "Cerrar editor" : "Editar bloque"}
                    >
                      {open ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </header>
                {open && (
                  <div className="block-editor">
                    <BlockFields
                      block={block}
                      onChange={(patch) => updateData(block.id, patch)}
                    />
                    <details className="advanced-settings">
                      <summary>Ajustes avanzados</summary>
                      <div className="form-grid">
                        <Field
                          label="Ancla HTML"
                          value={block.anchor || ""}
                          onChange={(anchor) => update(block.id, { anchor })}
                          placeholder="mi-seccion"
                        />
                        <Field
                          label="Clase CSS adicional"
                          value={block.className || ""}
                          onChange={(className) =>
                            update(block.id, { className })
                          }
                        />
                        <ToggleField
                          label="Mostrar bloque"
                          checked={block.visible !== false}
                          onChange={(visible) => update(block.id, { visible })}
                        />
                      </div>
                    </details>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      <button
        type="button"
        className="builder-add-bottom"
        onClick={() => setPalette(true)}
      >
        <Plus />
        Añadir otro bloque
      </button>
      <BlockPalette
        open={palette}
        onClose={() => setPalette(false)}
        onSelect={add}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar bloque"
        message="El bloque y su contenido se eliminarán del borrador. Podrás cancelar el editor general si no quieres guardar el cambio."
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          onChange(value.filter((x) => x.id !== deleting));
          if (expanded === deleting) setExpanded(null);
        }}
      />
    </div>
  );
}

function BlockPalette({ open, onClose, onSelect }) {
  const groups = [...new Set(blockCatalog.map((x) => x.group))];
  const [query, setQuery] = useState("");
  const filtered = blockCatalog.filter((x) =>
    `${x.label} ${x.description} ${x.group}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <StudioDialog
      open={open}
      onClose={onClose}
      title="Añadir un bloque"
      eyebrow="Biblioteca de componentes"
      wide
    >
      <div className="block-palette-search">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar texto, galería, mapa, color…"
        />
      </div>
      {groups.map((group) => {
        const items = filtered.filter((x) => x.group === group);
        return items.length ? (
          <section className="palette-group" key={group}>
            <span>{group}</span>
            <div>
              {items.map((item) => (
                <button
                  type="button"
                  onClick={() => onSelect(item.type)}
                  key={item.type}
                >
                  <i>{item.icon}</i>
                  <b>{item.label}</b>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </section>
        ) : null;
      })}
    </StudioDialog>
  );
}

function BlockFields({ block, onChange }) {
  const d = block.data || {};
  if (block.type === "text")
    return (
      <>
        <RichEditor
          label="Contenido"
          value={d.html}
          onChange={(html) => onChange({ html })}
        />
        <div className="form-grid">
          <Select
            label="Ancho"
            value={d.width}
            options={["narrow", "normal", "wide"]}
            onChange={(width) => onChange({ width })}
          />
          <Select
            label="Alineación"
            value={d.align}
            options={["left", "center", "right"]}
            onChange={(align) => onChange({ align })}
          />
        </div>
      </>
    );
  if (block.type === "columns")
    return (
      <>
        <div className="form-grid">
          <Select
            label="Columnas"
            value={d.count}
            options={[2, 3]}
            onChange={(count) =>
              onChange({
                count: Number(count),
                columns: [
                  ...d.columns,
                  ...Array(Math.max(0, Number(count) - d.columns.length)).fill(
                    "<p>Nueva columna</p>",
                  ),
                ],
              })
            }
          />
          <Select
            label="Separación"
            value={d.gap}
            options={["small", "medium", "large"]}
            onChange={(gap) => onChange({ gap })}
          />
        </div>
        {d.columns.slice(0, d.count).map((html, i) => (
          <RichEditor
            key={i}
            label={`Columna ${i + 1}`}
            value={html}
            onChange={(value) =>
              onChange({
                columns: d.columns.map((x, index) => (index === i ? value : x)),
              })
            }
          />
        ))}
      </>
    );
  if (block.type === "mediaText")
    return (
      <>
        <AssetField
          label="Imagen"
          value={d.image}
          onChange={(image) => onChange({ image })}
        />
        <div className="form-grid">
          <Select
            label="Posición"
            value={d.imageSide}
            options={["left", "right"]}
            onChange={(imageSide) => onChange({ imageSide })}
          />
          <Select
            label="Proporción"
            value={d.ratio}
            options={["auto", "1/1", "4/3", "16/9", "3/4"]}
            onChange={(ratio) => onChange({ ratio })}
          />
          <Select
            label="Ajuste"
            value={d.fit}
            options={["cover", "contain", "fill"]}
            onChange={(fit) => onChange({ fit })}
          />
          <Field
            label="Texto alternativo"
            value={d.alt}
            onChange={(alt) => onChange({ alt })}
          />
        </div>
        <Field
          label="Etiqueta"
          value={d.eyebrow}
          onChange={(eyebrow) => onChange({ eyebrow })}
        />
        <Field
          label="Título"
          value={d.title}
          onChange={(title) => onChange({ title })}
        />
        <TextArea
          label="Texto"
          value={d.text}
          onChange={(text) => onChange({ text })}
        />
        <div className="form-grid">
          <Field
            label="Texto del botón"
            value={d.buttonLabel}
            onChange={(buttonLabel) => onChange({ buttonLabel })}
          />
          <Field
            label="Enlace"
            value={d.buttonUrl}
            onChange={(buttonUrl) => onChange({ buttonUrl })}
          />
        </div>
      </>
    );
  if (block.type === "image")
    return (
      <>
        <AssetField
          label="Imagen"
          value={d.src}
          onChange={(src) => onChange({ src })}
        />
        <div className="form-grid">
          <Field
            label="Texto alternativo"
            value={d.alt}
            onChange={(alt) => onChange({ alt })}
          />
          <Field
            label="Pie de foto"
            value={d.caption}
            onChange={(caption) => onChange({ caption })}
          />
          <Select
            label="Tamaño"
            value={d.size}
            options={["small", "medium", "large", "full"]}
            onChange={(size) => onChange({ size })}
          />
          <Select
            label="Proporción"
            value={d.ratio}
            options={["auto", "1/1", "4/3", "16/9", "3/4"]}
            onChange={(ratio) => onChange({ ratio })}
          />
          <Select
            label="Ajuste"
            value={d.fit}
            options={["cover", "contain", "fill"]}
            onChange={(fit) => onChange({ fit })}
          />
          <Select
            label="Esquinas"
            value={d.radius}
            options={["none", "small", "medium", "large"]}
            onChange={(radius) => onChange({ radius })}
          />
          <ToggleField
            label="Permitir expandir"
            checked={d.expandable}
            onChange={(expandable) => onChange({ expandable })}
          />
        </div>
      </>
    );
  if (block.type === "banner" || block.type === "fullscreen")
    return (
      <>
        <AssetField
          label="Imagen"
          value={d.src}
          onChange={(src) => onChange({ src })}
        />
        <Field
          label="Texto alternativo"
          value={d.alt}
          onChange={(alt) => onChange({ alt })}
        />
        <Field
          label="Título sobre la imagen"
          value={d.title}
          onChange={(title) => onChange({ title })}
        />
        <div className="form-grid">
          {block.type === "banner" ? (
            <Select
              label="Altura"
              value={d.height}
              options={["small", "medium", "large"]}
              onChange={(height) => onChange({ height })}
            />
          ) : (
            <Select
              label="Posición"
              value={d.position}
              options={["center", "top", "bottom", "left", "right"]}
              onChange={(position) => onChange({ position })}
            />
          )}
          <Select
            label="Alineación"
            value={d.align || "left"}
            options={["left", "center", "right"]}
            onChange={(align) => onChange({ align })}
          />
          <ToggleField
            label="Superposición oscura"
            checked={d.overlay}
            onChange={(overlay) => onChange({ overlay })}
          />
        </div>
      </>
    );
  if (block.type === "gallery")
    return (
      <>
        <AssetList
          label="Imágenes de la galería"
          value={d.images || []}
          onChange={(images) => onChange({ images })}
        />
        <div className="form-grid">
          <Select
            label="Diseño"
            value={d.layout}
            options={["mosaic", "grid", "carousel"]}
            onChange={(layout) => onChange({ layout })}
          />
          <Select
            label="Columnas"
            value={d.columns}
            options={[2, 3, 4]}
            onChange={(columns) => onChange({ columns: Number(columns) })}
          />
          <Select
            label="Proporción"
            value={d.ratio}
            options={["auto", "1/1", "4/3", "16/9", "3/4"]}
            onChange={(ratio) => onChange({ ratio })}
          />
          <Select
            label="Ajuste"
            value={d.fit}
            options={["cover", "contain", "fill"]}
            onChange={(fit) => onChange({ fit })}
          />
        </div>
      </>
    );
  if (block.type === "video")
    return (
      <>
        <Field
          label="URL de YouTube, Vimeo o vídeo"
          value={d.url}
          onChange={(url) => onChange({ url })}
        />
        <AssetField
          label="Portada opcional"
          value={d.poster}
          onChange={(poster) => onChange({ poster })}
        />
        <div className="form-grid">
          <Field
            label="Título accesible"
            value={d.title}
            onChange={(title) => onChange({ title })}
          />
          <Select
            label="Proporción"
            value={d.ratio}
            options={["16/9", "4/3", "1/1"]}
            onChange={(ratio) => onChange({ ratio })}
          />
          <ToggleField
            label="Reproducción automática"
            checked={d.autoplay}
            onChange={(autoplay) => onChange({ autoplay })}
          />
        </div>
      </>
    );
  if (block.type === "divider")
    return (
      <div className="form-grid">
        <Select
          label="Estilo"
          value={d.style}
          options={["line", "dotted", "gradient", "symbol"]}
          onChange={(style) => onChange({ style })}
        />
        <Select
          label="Espaciado"
          value={d.spacing}
          options={["small", "medium", "large"]}
          onChange={(spacing) => onChange({ spacing })}
        />
        <Field
          label="Texto opcional"
          value={d.label}
          onChange={(label) => onChange({ label })}
        />
      </div>
    );
  if (block.type === "button")
    return (
      <>
        <div className="form-grid">
          <Field
            label="Texto"
            value={d.label}
            onChange={(label) => onChange({ label })}
          />
          <Field
            label="URL"
            value={d.url}
            onChange={(url) => onChange({ url })}
          />
          <Select
            label="Estilo"
            value={d.style}
            options={["primary", "ghost", "dark"]}
            onChange={(style) => onChange({ style })}
          />
          <Select
            label="Alineación"
            value={d.align}
            options={["left", "center", "right"]}
            onChange={(align) => onChange({ align })}
          />
          <Select
            label="Icono"
            value={d.icon}
            options={["arrow", "none"]}
            onChange={(icon) => onChange({ icon })}
          />
          <ToggleField
            label="Abrir en pestaña nueva"
            checked={d.newTab}
            onChange={(newTab) => onChange({ newTab })}
          />
        </div>
      </>
    );
  if (block.type === "social")
    return (
      <>
        <Field
          label="Título"
          value={d.title}
          onChange={(title) => onChange({ title })}
        />
        <Select
          label="Alineación"
          value={d.align}
          options={["left", "center", "right"]}
          onChange={(align) => onChange({ align })}
        />
        <Repeater
          value={d.links || []}
          onChange={(links) => onChange({ links })}
          create={() => ({ network: "instagram", url: "" })}
          render={(item, set) => (
            <>
              <Select
                label="Red"
                value={item.network}
                options={[
                  "instagram",
                  "whatsapp",
                  "facebook",
                  "linkedin",
                  "youtube",
                  "email",
                ]}
                onChange={(network) => set({ ...item, network })}
              />
              <Field
                label="URL"
                value={item.url}
                onChange={(url) => set({ ...item, url })}
              />
            </>
          )}
        />
      </>
    );
  if (block.type === "map")
    return (
      <>
        <div className="form-grid">
          <Field
            label="Título"
            value={d.title}
            onChange={(title) => onChange({ title })}
          />
          <Field
            label="Dirección"
            value={d.address}
            onChange={(address) => onChange({ address })}
          />
        </div>
        <Field
          label="URL de Google Maps para insertar"
          value={d.embedUrl}
          onChange={(embedUrl) => onChange({ embedUrl })}
        />
        <Field
          label="Altura en píxeles"
          type="number"
          value={d.height}
          onChange={(height) => onChange({ height: Number(height) })}
        />
      </>
    );
  if (block.type === "embed")
    return (
      <>
        <Field
          label="Nombre accesible"
          value={d.label}
          onChange={(label) => onChange({ label })}
        />
        <TextArea
          label="HTML o iframe"
          value={d.html}
          onChange={(html) => onChange({ html })}
          rows={8}
        />
        <p className="field-help">
          Usa solamente código de proveedores de confianza. En producción se
          aplicará una lista segura.
        </p>
      </>
    );
  if (block.type === "icon")
    return (
      <>
        <IconPicker value={d.icon} onChange={(icon) => onChange({ icon })} />
        <div className="form-grid">
          <Field
            label="Etiqueta"
            value={d.eyebrow}
            onChange={(eyebrow) => onChange({ eyebrow })}
          />
          <Select
            label="Alineación"
            value={d.align}
            options={["left", "center", "right"]}
            onChange={(align) => onChange({ align })}
          />
        </div>
        <Field
          label="Título"
          value={d.title}
          onChange={(title) => onChange({ title })}
        />
        <TextArea
          label="Texto"
          value={d.text}
          onChange={(text) => onChange({ text })}
        />
      </>
    );
  if (block.type === "svg")
    return (
      <>
        <SvgPicker value={d.shape} onChange={(shape) => onChange({ shape })} />
        <div className="form-grid">
          <Field
            label="Etiqueta"
            value={d.label}
            onChange={(label) => onChange({ label })}
          />
          <Field
            label="Color"
            type="color"
            value={d.color}
            onChange={(color) => onChange({ color })}
          />
          <Select
            label="Tamaño"
            value={d.size}
            options={["small", "medium", "large"]}
            onChange={(size) => onChange({ size })}
          />
        </div>
      </>
    );
  if (block.type === "logo")
    return (
      <>
        <AssetList
          label="Logotipos"
          value={(d.logos || []).map((x) => x.src)}
          onChange={(items) =>
            onChange({
              logos: items.map((src, i) => ({
                src,
                alt: d.logos?.[i]?.alt || `Logo ${i + 1}`,
              })),
            })
          }
        />
        <div className="form-grid">
          <Select
            label="Diseño"
            value={d.layout}
            options={["row", "grid"]}
            onChange={(layout) => onChange({ layout })}
          />
          <ToggleField
            label="Monocromático"
            checked={d.monochrome}
            onChange={(monochrome) => onChange({ monochrome })}
          />
        </div>
      </>
    );
  if (block.type === "emoji")
    return (
      <>
        <EmojiPicker
          value={d.emoji}
          onChange={(emoji) => onChange({ emoji })}
        />
        <div className="form-grid">
          <Field
            label="Título"
            value={d.title}
            onChange={(title) => onChange({ title })}
          />
          <Select
            label="Tamaño"
            value={d.size}
            options={["small", "medium", "large"]}
            onChange={(size) => onChange({ size })}
          />
          <Select
            label="Alineación"
            value={d.align}
            options={["left", "center", "right"]}
            onChange={(align) => onChange({ align })}
          />
        </div>
        <TextArea
          label="Texto"
          value={d.text}
          onChange={(text) => onChange({ text })}
        />
      </>
    );
  if (block.type === "date")
    return (
      <>
        <div className="form-grid">
          <Field
            label="Fecha"
            type="date"
            value={d.date}
            onChange={(date) => onChange({ date })}
          />
          <Field
            label="Etiqueta"
            value={d.eyebrow}
            onChange={(eyebrow) => onChange({ eyebrow })}
          />
        </div>
        <Field
          label="Título"
          value={d.title}
          onChange={(title) => onChange({ title })}
        />
        <TextArea
          label="Texto"
          value={d.text}
          onChange={(text) => onChange({ text })}
        />
      </>
    );
  if (block.type === "palette")
    return (
      <>
        <Field
          label="Nombre de la paleta"
          value={d.name}
          onChange={(name) => onChange({ name })}
        />
        <ColorStudio
          value={d.colors || []}
          onChange={(colors) => onChange({ colors })}
        />
        <ToggleField
          label="Mostrar valores HEX, RGB, CMYK y HSB"
          checked={d.showValues}
          onChange={(showValues) => onChange({ showValues })}
        />
      </>
    );
  return null;
}

function RichEditor({ label, value = "", onChange }) {
  const ref = useRef();
  const command = (cmd, arg = null) => {
    ref.current.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current.innerHTML);
  };
  const askLink = () => {
    const url = window.prompt("URL del enlace");
    if (url) command("createLink", url);
  };
  return (
    <div className="field rich-field studio-rich">
      <span>{label}</span>
      <div className="rich-toolbar">
        {[
          [Bold, "bold", "Negrita"],
          [Italic, "italic", "Cursiva"],
          [Underline, "underline", "Subrayado"],
          [Strikethrough, "strikeThrough", "Tachado"],
          [List, "insertUnorderedList", "Lista"],
          [ListOrdered, "insertOrderedList", "Lista numerada"],
          [Quote, "formatBlock", "Cita", "blockquote"],
          [AlignLeft, "justifyLeft", "Alinear izquierda"],
          [AlignCenter, "justifyCenter", "Centrar"],
          [AlignRight, "justifyRight", "Alinear derecha"],
          [Undo2, "undo", "Deshacer"],
          [Redo2, "redo", "Rehacer"],
        ].map(([Icon, cmd, title, arg]) => (
          <button
            type="button"
            title={title}
            onMouseDown={(e) => {
              e.preventDefault();
              command(cmd, arg);
            }}
            key={title}
          >
            <Icon />
          </button>
        ))}
        <button
          type="button"
          title="Añadir enlace"
          onMouseDown={(e) => {
            e.preventDefault();
            askLink();
          }}
        >
          <Link2 />
        </button>
        <select
          title="Formato"
          onChange={(e) => command("formatBlock", e.target.value)}
          defaultValue="p"
        >
          <option value="p">Párrafo</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="h4">Título 4</option>
          <option value="pre">Código</option>
        </select>
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}

function AssetField({ label, value, onChange }) {
  const { data } = useSite();
  const input = useRef();
  const upload = async (file) => onChange(await optimizeImage(file));
  return (
    <div className="asset-field">
      <span>{label}</span>
      {value && <img src={value} alt="Vista previa" />}
      <div>
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/assets/imagen.jpg o https://…"
        />
        <input
          ref={input}
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && upload(e.target.files[0])}
        />
        <button type="button" onClick={() => input.current.click()}>
          <ImagePlus />
          Subir
        </button>
      </div>
      {data.media?.length > 0 && (
        <div className="asset-library">
          {data.media.slice(0, 8).map((media) => (
            <button
              type="button"
              className={value === media.url ? "active" : ""}
              onClick={() => onChange(media.url)}
              key={media.id}
            >
              <img src={media.url} alt={media.name} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function AssetList({ label, value = [], onChange }) {
  const input = useRef();
  const upload = async (files) => {
    const images = [];
    for (const file of files) images.push(await optimizeImage(file));
    onChange([...value, ...images]);
  };
  return (
    <div className="asset-list">
      <div>
        <span>{label}</span>
        <input
          ref={input}
          hidden
          multiple
          type="file"
          accept="image/*"
          onChange={(e) => upload(e.target.files)}
        />
        <button type="button" onClick={() => input.current.click()}>
          <ImagePlus />
          Subir varias
        </button>
      </div>
      {value.map((src, i) => (
        <article key={`${src}-${i}`}>
          <img src={src} />
          <input
            value={src}
            onChange={(e) =>
              onChange(
                value.map((x, index) => (index === i ? e.target.value : x)),
              )
            }
          />
          <button
            type="button"
            onClick={() =>
              i > 0 &&
              onChange(
                value.map((x, index) =>
                  index === i - 1 ? value[i] : index === i ? value[i - 1] : x,
                ),
              )
            }
          >
            <ArrowUp />
          </button>
          <button
            type="button"
            onClick={() =>
              i < value.length - 1 &&
              onChange(
                value.map((x, index) =>
                  index === i + 1 ? value[i] : index === i ? value[i + 1] : x,
                ),
              )
            }
          >
            <ArrowDown />
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => onChange(value.filter((_, index) => index !== i))}
          >
            <Trash2 />
          </button>
        </article>
      ))}
    </div>
  );
}
function Repeater({ value, onChange, create, render }) {
  return (
    <div className="repeater">
      <div>
        {value.map((item, i) => (
          <article key={i}>
            <div>
              {render(item, (next) =>
                onChange(value.map((x, index) => (index === i ? next : x))),
              )}
            </div>
            <button
              type="button"
              className="danger"
              onClick={() => onChange(value.filter((_, index) => index !== i))}
            >
              <Trash2 />
            </button>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="button ghost small"
        onClick={() => onChange([...value, create()])}
      >
        <Plus />
        Añadir elemento
      </button>
    </div>
  );
}
function IconPicker({ value, onChange }) {
  const icons = [
    "sparkles",
    "palette",
    "map",
    "calendar",
    "mail",
    "whatsapp",
    "instagram",
    "youtube",
    "linkedin",
    "facebook",
  ];
  return (
    <div className="picker-field">
      <span>Icono</span>
      <div>
        {icons.map((icon) => (
          <button
            type="button"
            className={value === icon ? "active" : ""}
            onClick={() => onChange(icon)}
            key={icon}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
function SvgPicker({ value, onChange }) {
  return (
    <div className="picker-field">
      <span>Forma SVG</span>
      <div>
        {["orbit", "wave", "spark", "grid"].map((shape) => (
          <button
            type="button"
            className={value === shape ? "active" : ""}
            onClick={() => onChange(shape)}
            key={shape}
          >
            {shape}
          </button>
        ))}
      </div>
    </div>
  );
}
function EmojiPicker({ value, onChange }) {
  const emojis = [
    "✨",
    "🔥",
    "🎨",
    "🚀",
    "💡",
    "🧡",
    "✦",
    "⚡",
    "🌈",
    "🪄",
    "📌",
    "🏆",
    "🤝",
    "📣",
    "🎯",
  ];
  return (
    <div className="picker-field emoji-picker">
      <span>Emoji</span>
      <div>
        {emojis.map((emoji) => (
          <button
            type="button"
            className={value === emoji ? "active" : ""}
            onClick={() => onChange(emoji)}
            key={emoji}
          >
            {emoji}
          </button>
        ))}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Emoji personalizado"
        />
      </div>
    </div>
  );
}
function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option value={option} key={option}>
            {String(option).replaceAll("-", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
function ToggleField({ label, checked, onChange }) {
  return (
    <label className="toggle compact">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i />
    </label>
  );
}
async function optimizeImage(file) {
  const bitmap = await createImageBitmap(file),
    scale = Math.min(1, 1920 / bitmap.width),
    canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.82);
}
