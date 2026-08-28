import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Command,
  Expand,
  FileUp,
  Grid3X3,
  Home,
  Images,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useSite } from "../store/SiteStore";
import { ColorStudio } from "./ColorStudio";
import { ModernCalendar, SelectMenu } from "./FormControls";
import { buildInquirySummary, validateContact } from "../utils/quote";
import { visibleContent } from "../utils/editorial";
import { assetUrl } from "../utils/assets";

export function Logo({ compact = false }) {
  return (
    <Link className="logo" to="/">
      <span className="logo-mark">JP</span>
      {!compact && (
        <span>
          JEP <b>DESIGNER</b>
        </span>
      )}
    </Link>
  );
}

const nav = [
  ["/", "Jonathan"],
  ["/portfolio", "Portfolio"],
  ["/servicios", "Servicios"],
  ["/planes", "Planes"],
  ["/sobre-mi", "Sobre mí"],
  ["/contacto", "Contacto"],
];
export function Header({ onSearch }) {
  const { theme, setTheme } = useSite();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav">
          {nav.map(([to, label]) => (
            <NavLink key={to} end={to === "/"} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Buscar"
            onClick={onSearch}
          >
            <Search size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Cambiar tema"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="button small primary desktop-cta" to="/servicios">
            Cotizar <ArrowUpRight size={16} />
          </Link>
          <button
            className="icon-button mobile-menu-button"
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu">
          <button className="menu-close" onClick={() => setOpen(false)}>
            <X />
          </button>
          {nav.map(([to, label]) => (
            <NavLink onClick={() => setOpen(false)} key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export function MobileNav() {
  return (
    <nav className="mobile-bottom">
      {[
        [Home, "/", "Inicio"],
        [BriefcaseBusiness, "/portfolio", "Portfolio"],
        [CircleDollarSign, "/servicios", "Cotizar"],
        [MessageCircle, "/contacto", "Contacto"],
      ].map(([Icon, to, label]) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function Footer() {
  const { data } = useSite();
  return (
    <footer className="site-footer">
      <div>
        <Logo />
        <p>
          {data.settings.tagline}.<br />
          Diseño gráfico, branding y publicidad.
        </p>
      </div>
      <div className="footer-column">
        <b>Explorar</b>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/servicios">Servicios</Link>
        <Link to="/planes">Planes</Link>
        <Link to="/sobre-mi">Sobre mí</Link>
      </div>
      <div className="footer-column">
        <b>Legal</b>
        <Link to="/terminos">Términos</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/cookies">Cookies</Link>
      </div>
      <div className="footer-column">
        <b>Contacto</b>
        <a href={`mailto:${data.settings.email}`}>{data.settings.email}</a>
        <a href={data.settings.instagram} target="_blank" rel="noreferrer">
          Instagram <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="footer-bottom">
        © 2026 JEP Designer. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {copy && <p>{copy}</p>}
      {action}
    </div>
  );
}

export function ProjectCard({ project, category }) {
  const path = `/portfolio/${project.slug}`;
  return (
    <Link className="project-card" to={path}>
      <div className="project-image">
        <img
          src={assetUrl(project.cover)}
          alt={project.title}
          loading="lazy"
          decoding="async"
        />
        <span className="project-index">{project.year}</span>
        <span className="card-arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="project-meta">
        <span>{category?.name}</span>
        <h3>{project.title}</h3>
        <div className="tag-list">
          {project.tags.slice(0, 3).map((tag) => (
            <small key={tag}>#{tag}</small>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ServiceCard({ service, index }) {
  return (
    <Link className="service-card" to={`/servicios/${service.slug}`}>
      <span className="service-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3>{service.name}</h3>
        <p>{service.summary}</p>
        <small>
          {service.priceLabel} · {service.delivery}
        </small>
      </div>
      <ArrowUpRight className="service-arrow" />
    </Link>
  );
}

export function Gallery({ images, title = "Galería" }) {
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState("carousel");
  const [lightbox, setLightbox] = useState(false);
  if (!images?.length) return null;
  const open = (index) => {
    setCurrent(index);
    setLightbox(true);
  };
  return (
    <div className="gallery">
      <div className="gallery-toolbar">
        <div>
          <b>Galería del proyecto</b>
          <span>{images.length} imágenes</span>
        </div>
        <div>
          <button
            className={mode === "carousel" ? "active" : ""}
            onClick={() => setMode("carousel")}
          >
            <Images />
            Carrusel
          </button>
          <button
            className={mode === "mosaic" ? "active" : ""}
            onClick={() => setMode("mosaic")}
          >
            <Grid3X3 />
            Mosaico
          </button>
        </div>
      </div>
      {mode === "carousel" ? (
        <>
          <div className="gallery-main">
            <img
              src={assetUrl(images[current])}
              alt={`${title} ${current + 1}`}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
              onClick={() => open(current)}
            />
            <button
              aria-label="Imagen anterior"
              onClick={() =>
                setCurrent((current - 1 + images.length) % images.length)
              }
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Imagen siguiente"
              onClick={() => setCurrent((current + 1) % images.length)}
            >
              <ChevronRight />
            </button>
            <button
              className="gallery-expand"
              aria-label="Ampliar imagen"
              onClick={() => open(current)}
            >
              <Expand />
            </button>
          </div>
          <div className="gallery-thumbs">
            {images.map((src, i) => (
              <button
                className={i === current ? "active" : ""}
                key={`${src}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <img src={assetUrl(src)} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="gallery-mosaic">
          {images.map((src, i) => (
            <button key={`${src}-${i}`} onClick={() => open(i)}>
              <img
                src={assetUrl(src)}
                alt={`${title} ${i + 1}`}
                loading="lazy"
                decoding="async"
              />
              <Expand />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div
          className="lightbox"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setLightbox(false)
          }
        >
          <button className="lightbox-close" onClick={() => setLightbox(false)}>
            <X />
          </button>
          <button
            onClick={() =>
              setCurrent((current - 1 + images.length) % images.length)
            }
          >
            <ChevronLeft />
          </button>
          <img
            src={assetUrl(images[current])}
            alt={`${title} ampliada ${current + 1}`}
            decoding="async"
          />
          <button onClick={() => setCurrent((current + 1) % images.length)}>
            <ChevronRight />
          </button>
          <span>
            {current + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}

export function ColorMultiField(props) {
  return <ColorStudio {...props} />;
}

export function FileUploader({ onFiles }) {
  const [files, setFiles] = useState([]);
  const input = useRef();
  const pick = (list) => {
    const next = [...list];
    setFiles(next);
    onFiles?.(next);
  };
  return (
    <div
      className="file-uploader"
      onClick={() => input.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files);
      }}
    >
      <input
        ref={input}
        hidden
        multiple
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        onChange={(e) => pick(e.target.files)}
      />
      <FileUp />
      <b>Arrastra archivos o haz clic</b>
      <span>Imágenes, PDF o documentos · hasta 10 MB</span>
      {files.length > 0 && (
        <div className="file-list">
          {files.map((f) => (
            <small key={f.name}>
              <Check size={12} />
              {f.name}
            </small>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionField({ question, value, onChange }) {
  const common = {
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    required: question.required,
    placeholder: question.placeholder,
  };
  if (question.type === "textarea") return <textarea rows="5" {...common} />;
  if (question.type === "select")
    return (
      <SelectMenu
        value={value || ""}
        onChange={onChange}
        options={question.options || []}
        placeholder="Selecciona una opción"
        searchable={(question.options || []).length > 7}
      />
    );
  if (question.type === "radio")
    return (
      <div className="choice-grid">
        {question.options.map((o) => (
          <button
            type="button"
            className={value === o ? "selected" : ""}
            onClick={() => onChange(o)}
            key={o}
          >
            {value === o && <Check size={14} />} {o}
          </button>
        ))}
      </div>
    );
  if (question.type === "checkbox")
    return (
      <div className="choice-grid checkboxes">
        {question.options.map((o) => {
          const selected = (value || []).includes(o);
          return (
            <button
              type="button"
              className={selected ? "selected" : ""}
              onClick={() =>
                onChange(
                  selected
                    ? (value || []).filter((x) => x !== o)
                    : [...(value || []), o],
                )
              }
              key={o}
            >
              {selected && <Check size={14} />} {o}
            </button>
          );
        })}
      </div>
    );
  if (question.type === "color-multi")
    return <ColorMultiField value={value || []} onChange={onChange} />;
  if (question.type === "file") return <FileUploader onFiles={onChange} />;
  if (question.type === "date")
    return <CalendarPicker value={value} onChange={onChange} />;
  return <input type={question.type || "text"} {...common} />;
}

export function QuoteWizard({ service, plan, onClose }) {
  const { data, submitInquiry, notify } = useSite();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState({
    service: service?.id || "",
    name: "",
    email: "",
    phone: "",
    colors: [],
  });
  const chosen = service || data.services.find((s) => s.id === answers.service);
  const questions = chosen?.questions || [];
  const set = (key, value) => setAnswers((v) => ({ ...v, [key]: value }));
  const questionsComplete = questions
    .filter((q) => q.required)
    .every((q) => {
      const value = answers[q.id];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });
  useEffect(() => {
    previousFocus.current = document.activeElement;
    const dialog = dialogRef.current;
    requestAnimationFrame(() =>
      dialog
        ?.querySelector("button:not(:disabled), input, [tabindex='0']")
        ?.focus(),
    );
    const handleKey = (event) => {
      if (event.key === "Escape") return onClose?.();
      if (event.key !== "Tab") return;
      const nodes = [
        ...dialog.querySelectorAll(
          "button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex='0']",
        ),
      ];
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus.current?.focus?.();
    };
  }, [onClose]);
  const submit = async () => {
    const validation = validateContact(answers);
    setErrors(validation);
    if (Object.keys(validation).length) {
      notify({ message: Object.values(validation)[0], type: "error" });
      return;
    }
    const inquiry = {
      id: crypto.randomUUID(),
      serviceId: chosen.id,
      serviceName: chosen.name,
      planId: plan?.id || null,
      contact: {
        name: answers.name,
        email: answers.email,
        phone: answers.phone,
      },
      answers: Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [
          key,
          Array.isArray(value) && value.some((entry) => typeof File !== "undefined" && entry instanceof File)
            ? value.map((file) => file.name)
            : value,
        ]),
      ),
      files: questions
        .filter((question) => question.type === "file")
        .flatMap((question) => answers[question.id] || []),
      status: "new",
      internalNotes: "",
      createdAt: new Date().toISOString(),
    };
    await submitInquiry(inquiry);
    const summary = buildInquirySummary({
      service: chosen,
      plan,
      answers,
      questions,
    });
    window.open(
      `https://wa.me/${data.settings.whatsappRaw}?text=${encodeURIComponent(summary)}`,
      "_blank",
      "noopener,noreferrer",
    );
    notify("Solicitud guardada y preparada para WhatsApp");
    onClose?.();
    navigate("/gracias");
  };
  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        className="quote-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
      >
        <button
          className="dialog-close"
          aria-label="Cerrar cotizador"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="quote-progress">
          <span style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        {step === 0 && (
          <div>
            <span className="eyebrow">Paso 1 de 3</span>
            <h2 id="quote-title">¿Qué necesitas?</h2>
            {!service && (
              <div className="field">
                <label>Selecciona un servicio</label>
                <SelectMenu
                  value={answers.service}
                  onChange={(value) => set("service", value)}
                  options={visibleContent(data.services).map((s) => ({
                    value: s.id,
                    label: s.name,
                  }))}
                  placeholder="Elige una opción"
                  searchable
                />
              </div>
            )}
            {chosen && (
              <div className="selected-service">
                <Check />
                <div>
                  <b>{chosen.name}</b>
                  <span>
                    {chosen.priceLabel} · {chosen.delivery}
                  </span>
                </div>
              </div>
            )}
            <button
              disabled={!chosen}
              className="button primary wide"
              onClick={() => setStep(1)}
            >
              Continuar <ArrowUpRight size={17} />
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <span className="eyebrow">Paso 2 de 3</span>
            <h2 id="quote-title">Cuéntame el contexto.</h2>
            <div className="wizard-fields">
              {questions.map((q) => (
                <div className="field" key={q.id}>
                  <label>
                    {q.label}
                    {q.required ? " *" : ""}
                  </label>
                  <QuestionField
                    question={q}
                    value={answers[q.id]}
                    onChange={(value) => set(q.id, value)}
                  />
                  {q.help && <small>{q.help}</small>}
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="button ghost" onClick={() => setStep(0)}>
                Atrás
              </button>
              <button
                disabled={!questionsComplete}
                className="button primary"
                onClick={() => setStep(2)}
              >
                Continuar
              </button>
            </div>
            {!questionsComplete && (
              <p className="required-note">
                Completa las preguntas marcadas con * para continuar.
              </p>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <span className="eyebrow">Paso 3 de 3</span>
            <h2 id="quote-title">¿Dónde te respondo?</h2>
            <div className="field-grid">
              <div className="field">
                <label>Nombre *</label>
                <input
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "quote-name-error" : undefined
                  }
                  value={answers.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                />
                {errors.name && (
                  <small
                    id="quote-name-error"
                    className="form-error"
                    role="alert"
                  >
                    {errors.name}
                  </small>
                )}
              </div>
              <div className="field">
                <label>Correo *</label>
                <input
                  type="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "quote-email-error" : undefined
                  }
                  value={answers.email}
                  onChange={(e) => {
                    set("email", e.target.value);
                    setErrors((current) => ({ ...current, email: undefined }));
                  }}
                />
                {errors.email && (
                  <small
                    id="quote-email-error"
                    className="form-error"
                    role="alert"
                  >
                    {errors.email}
                  </small>
                )}
              </div>
              <div className="field full">
                <label>WhatsApp</label>
                <input
                  value={answers.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+593…"
                />
              </div>
            </div>
            <div className="quote-summary">
              <span>Servicio</span>
              <b>{chosen?.name}</b>
              <span>Inversión estimada</span>
              <b>{chosen?.priceLabel}</b>
            </div>
            <div className="wizard-actions">
              <button className="button ghost" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button
                disabled={!answers.name || !answers.email}
                className="button primary"
                onClick={submit}
              >
                Enviar solicitud <MessageCircle size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommandSearch({ open, onClose }) {
  const { data } = useSite();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return [
      ...visibleContent(data.projects).map((x) => ({
        label: x.title,
        path: `/portfolio/${x.slug}`,
        type: "Proyecto",
      })),
      ...visibleContent(data.services).map((x) => ({
        label: x.name,
        path: `/servicios/${x.slug}`,
        type: "Servicio",
      })),
      ...visibleContent(data.pages).map((x) => ({
        label: x.title,
        path: x.slug,
        type: "Página",
      })),
    ]
      .filter((x) => x.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, data]);
  if (!open) return null;
  return (
    <div
      className="command-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="command-box">
        <div className="command-input">
          <Search />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca proyectos, servicios o páginas…"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results">
          {query && !results.length && <p>Sin resultados para “{query}”.</p>}
          {results.map((r) => (
            <button
              key={r.path}
              onClick={() => {
                navigate(r.path);
                onClose();
              }}
            >
              <span>
                <small>{r.type}</small>
                {r.label}
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
          {!query && (
            <p>
              <Command size={16} /> Escribe para buscar en todo el sitio.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { notifications = [], dismissNotification } = useSite();
  return notifications.length ? (
    <div className="notification-stack" aria-live="polite">
      {notifications.map((item) => (
        <article
          className={`notification ${item.type || "success"}`}
          key={item.id}
        >
          <span>
            <Check size={17} />
          </span>
          <div>
            <b>{item.title}</b>
            <p>{item.message}</p>
          </div>
          <button
            onClick={() => dismissNotification(item.id)}
            aria-label="Cerrar notificación"
          >
            <X />
          </button>
          <i />
        </article>
      ))}
    </div>
  ) : null;
}

export function ContextMenu({ position, items, onClose }) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("click", close);
    window.addEventListener("scroll", close);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close);
    };
  }, [onClose]);
  return (
    <div className="context-menu" style={{ left: position.x, top: position.y }}>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            item.action();
            onClose();
          }}
        >
          {item.label}
          <ArrowUpRight size={14} />
        </button>
      ))}
    </div>
  );
}

export function CalendarPicker({ value, onChange }) {
  return <ModernCalendar value={value} onChange={onChange} />;
}

export function PriceCalculator({ base = 0 }) {
  const [qty, setQty] = useState(1);
  const [rush, setRush] = useState(false);
  const total = Math.round(base * qty * (rush ? 1.3 : 1));
  return (
    <div className="calculator">
      <span className="eyebrow">Calculadora orientativa</span>
      <h3>Estima tu inversión</h3>
      <label>
        Cantidad de piezas{" "}
        <input
          type="number"
          min="1"
          max="20"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </label>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={rush}
          onChange={(e) => setRush(e.target.checked)}
        />
        <span>Entrega prioritaria (+30%)</span>
      </label>
      <div>
        <span>Total aproximado</span>
        <b>${total}</b>
      </div>
      <small>
        Referencia inicial. El precio final depende del alcance y complejidad.
      </small>
    </div>
  );
}
