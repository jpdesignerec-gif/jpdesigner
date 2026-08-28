import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Clock3,
  Mail,
  MessageCircle,
  Palette,
  PenTool,
  Quote,
  Target,
  Zap,
} from "lucide-react";
import { useSite } from "../store/SiteStore";
import { assetUrl } from "../utils/assets";
import {
  Gallery,
  PriceCalculator,
  ProjectCard,
  QuoteWizard,
  SectionHeading,
  ServiceCard,
} from "../components/UI";
import {
  Breadcrumbs,
  FAQAccordion,
  PlanComparison,
} from "../components/Advanced";
import { BlockRenderer } from "../components/BlockRenderer";
import { SelectMenu } from "../components/FormControls";
import { isContentVisible, isPreviewMode, visibleContent } from "../utils/editorial";

export function HomePage() {
  const { data } = useSite();
  const [quote, setQuote] = useState(false);
  const page = data.pages.find((p) => p.id === "home") || {
    headline: "Diseño estratégico para marcas que quieren destacar.",
    intro:
      "Branding, comunicación visual y experiencias digitales con intención.",
    blocks: [],
  };
  const featured = visibleContent(data.projects || [])
    .filter((p) => p.featured)
    .slice(0, 3);
  const publicServices = visibleContent(data.services || []);
  const [headlineLead, headlineAccent] = page.headline.includes(" que ")
    ? page.headline.split(" que ")
    : [page.headline, ""];
  const statement = (page.blocks || []).find(
    (block) => block.anchor === "enfoque" && block.visible !== false,
  );
  const testimonial = visibleContent(data.testimonials || []).find(
    (item) => item.published && item.contentVerified,
  );
  const steps = [
    [Target, "01", "Descubrimos", "Objetivos, público y contexto."],
    [PenTool, "02", "Diseñamos", "Concepto, sistema y ajustes."],
    [Check, "03", "Entregamos", "Archivos claros y listos para usar."],
  ];
  return (
    <>
      <main className="home-main">
        <section className="hero section">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> Disponible para nuevos proyectos
            </span>
            <h1>
              {headlineLead} {headlineAccent && <em>que {headlineAccent}</em>}
            </h1>
            <p>{page.intro}</p>
            <div className="button-row">
              <button className="button primary" onClick={() => setQuote(true)}>
                Cotizar mi proyecto <MessageCircle size={18} />
              </button>
              <Link className="button ghost" to="/portfolio">
                Ver trabajos <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="hero-person">
              <img src={assetUrl("/assets/personaje-04.jpg")} alt="Jonathan Peña" />
              <span>
                <b>Jonathan Peña</b>
                <small>Diseñador gráfico & publicista</small>
              </span>
            </div>
            <div className="hero-stats">
              <div>
                <b>{publicServices.length}</b>
                <span>servicios configurables</span>
              </div>
              <div>
                <b>{featured.length}</b>
                <span>casos destacados</span>
              </div>
              <div>
                <b>3</b>
                <span>pasos para cotizar</span>
              </div>
            </div>
          </div>
          <div className="hero-art poster">
            <div className="orange-orbit" />
            <img
              fetchPriority="high"
              decoding="async"
              src={assetUrl("/assets/portada.jpg")}
              alt="Universo visual de JEP Designer"
            />
            <div className="floating-card top">
              <Palette />
              <span>
                Branding
                <br />
                <b>con intención</b>
              </span>
            </div>
            <div className="floating-card bottom">
              <Zap />
              <span>
                Diseño
                <br />
                <b>que funciona</b>
              </span>
            </div>
          </div>
          <a
            className="scroll-cue"
            href="#servicios"
            aria-label="Ver servicios"
          >
            <ArrowDown />
          </a>
        </section>
        <div className="marquee">
          <div>
            BRANDING <b>✦</b> IDENTIDAD VISUAL <b>✦</b> DISEÑO DIGITAL <b>✦</b>{" "}
            PUBLICIDAD <b>✦</b> ILUSTRACIÓN <b>✦</b> BRANDING <b>✦</b>
          </div>
        </div>
        {statement && (
          <div className="home-statement">
            <BlockRenderer blocks={[statement]} />
          </div>
        )}
        <section id="servicios" className="section home-services">
          <SectionHeading
            eyebrow="Cómo puedo ayudarte"
            title={
              "Soluciones para que tu marca <em>se vea y venda mejor.</em>"
            }
            copy="Elige un punto de partida. La cotización se adapta después a tu alcance real."
          />
          <div className="services-grid compact">
            {publicServices.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
          <div className="center-action">
            <Link className="button ghost" to="/servicios">
              Explorar los 14 servicios <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <section className="section home-work">
          <SectionHeading
            eyebrow="Trabajo seleccionado"
            title={"Una muestra breve. <em>El impacto habla primero.</em>"}
            copy="Tres proyectos para entender el nivel visual, la versatilidad y el cuidado de cada entrega."
            action={
              <Link className="text-link" to="/portfolio">
                Ver portfolio completo <ArrowUpRight size={16} />
              </Link>
            }
          />
          <div className="project-grid">
            {featured.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                category={data.categories.find(
                  (category) => category.id === project.categoryId,
                )}
              />
            ))}
          </div>
        </section>
        <section className="section home-proof">
          <div className="home-process">
            <span className="eyebrow">Un proceso sencillo</span>
            <h2>Tú cuentas la idea. Yo la convierto en un sistema visual.</h2>
            <div>
              {steps.map(([Icon, number, title, copy]) => (
                <article key={number}>
                  <span>{number}</span>
                  <Icon />
                  <div>
                    <b>{title}</b>
                    <small>{copy}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {testimonial && (
            <aside className="home-testimonial">
              <Quote />
              <span className="eyebrow">Experiencia del cliente</span>
              <blockquote>“{testimonial.quote}”</blockquote>
              <b>{testimonial.name}</b>
              <small>
                {testimonial.role} · {testimonial.company}
              </small>
            </aside>
          )}
        </section>
        <CtaBlock onQuote={() => setQuote(true)} />
      </main>
      {quote && <QuoteWizard onClose={() => setQuote(false)} />}
    </>
  );
}

export function PortfolioPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { data } = useSite();
  const routeCategory = data.categories.find((c) => c.slug === categorySlug);
  const category = routeCategory?.id || "all";
  const [tag, setTag] = useState("");
  const publicProjects = visibleContent(data.projects);
  const tags = [...new Set(publicProjects.flatMap((p) => p.tags))];
  const projects = publicProjects.filter(
    (p) =>
      (category === "all" || p.categoryId === category) &&
      (!tag || p.tags.includes(tag)),
  );
  return (
    <main>
      <PageHero
        eyebrow="Archivo creativo / 2022—2026"
        title={routeCategory?.name || "Portfolio"}
        copy={
          routeCategory?.description ||
          "Una selección de identidades, campañas, ilustraciones e interfaces construidas para dejar una impresión clara."
        }
      />
      <section className="section portfolio-browser">
        <div className="filter-bar">
          <div>
            {[{ id: "all", name: "Todos" }, ...data.categories].map((c) => (
              <button
                className={category === c.id ? "active" : ""}
                onClick={() =>
                  navigate(
                    c.id === "all"
                      ? "/portfolio"
                      : `/portfolio/categoria/${c.slug}`,
                  )
                }
                key={c.id}
              >
                {c.name}
              </button>
            ))}
          </div>
          <SelectMenu
            value={tag}
            onChange={setTag}
            options={[
              { value: "", label: "Todos los tags" },
              ...tags.map((item) => ({ value: item, label: item })),
            ]}
            placeholder="Todos los tags"
            searchable
            ariaLabel="Filtrar portfolio por tag"
          />
        </div>
        <div className="result-count" aria-live="polite">
          {projects.length} proyectos encontrados
        </div>
        {projects.length ? (
          <div className="project-grid">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                category={data.categories.find((c) => c.id === p.categoryId)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state public-empty">
            <span className="eyebrow">Sin resultados</span>
            <h2>Prueba otra combinación.</h2>
            <p>Quita el tag o vuelve a ver todos los proyectos disponibles.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data } = useSite();
  const [quote, setQuote] = useState(false);
  const project = data.projects.find((p) => p.slug === slug);
  if (!project || !isContentVisible(project)) return <NotFound />;
  const category = data.categories.find((c) => c.id === project.categoryId);
  const relatedService = data.services.find((service) =>
    project.services?.some((item) =>
      service.name.toLowerCase().includes(String(item).toLowerCase()),
    ),
  );
  const related = visibleContent(data.projects, isPreviewMode())
    .filter((p) => p.id !== project.id && p.categoryId === project.categoryId)
    .slice(0, 2);
  return (
    <>
    <main>
      <div className="section breadcrumb-wrap">
        <Breadcrumbs
          items={[
            { label: "Portfolio", to: "/portfolio" },
            { label: project.title },
          ]}
        />
      </div>
      <section className="project-hero section">
        <span className="eyebrow">
          {category?.name} · {project.year}
        </span>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className="button-row project-hero-actions">
          <button className="button primary" onClick={() => setQuote(true)}>
            Quiero un proyecto así <ArrowUpRight size={17} />
          </button>
          <Link className="button ghost" to="/servicios">
            Ver servicios <ArrowRight size={17} />
          </Link>
        </div>
        <div className="project-cover">
          <img src={assetUrl(project.cover)} alt={project.title} />
        </div>
      </section>
      <section className="section case-intro">
        <div className="case-facts">
          <div>
            <span>Cliente</span>
            <b>{project.client}</b>
          </div>
          <div>
            <span>Año</span>
            <b>{project.year}</b>
          </div>
          <div>
            <span>Servicios</span>
            <b>{project.services.join(", ")}</b>
          </div>
        </div>
        <div>
          <span className="eyebrow">Sobre el proyecto</span>
          <h2>Una solución visual con intención.</h2>
          <p>{project.body}</p>
          <div className="tag-list">
            {project.tags.map((t) => (
              <small key={t}>#{t}</small>
            ))}
          </div>
        </div>
      </section>
      {project.blocks?.length ? (
        <BlockRenderer blocks={project.blocks} />
      ) : (
        <section className="section">
          <Gallery images={project.gallery} title={project.title} />
        </section>
      )}
      {related.length > 0 && (
        <section className="section">
          <SectionHeading
            eyebrow="Siguiente proyecto"
            title="Más dentro de esta categoría."
          />
          <div className="project-grid two">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} category={category} />
            ))}
          </div>
        </section>
      )}
      <CtaBlock />
    </main>
    {quote && (
      <QuoteWizard service={relatedService} onClose={() => setQuote(false)} />
    )}
    </>
  );
}

const serviceGroups = [
  {
    id: "marca",
    label: "Construir una marca",
    copy: "Para empezar con una identidad clara, propia y lista para crecer.",
    match: ["branding", "logotipo", "vectorizacion"],
  },
  {
    id: "vender",
    label: "Vender y comunicar",
    copy: "Piezas y campañas para que tu oferta se entienda y se recuerde.",
    match: ["marketing", "flyers", "avisos", "redes-sociales", "empaques"],
  },
  {
    id: "digital",
    label: "Pasar a digital",
    copy: "Experiencias, páginas y materiales digitales orientados a la acción.",
    match: ["landing-page", "catalogos", "menu-digital"],
  },
  {
    id: "espacio",
    label: "Diseñar el espacio",
    copy: "Sistemas visuales para orientar, señalizar y hacer visible tu lugar.",
    match: ["senalizacion", "papeleria"],
  },
  {
    id: "ilustrar",
    label: "Ilustrar una idea",
    copy: "Recursos visuales originales para darle personalidad a tu proyecto.",
    match: ["ilustracion"],
  },
];

function groupedServices(services) {
  const assigned = new Set();
  return serviceGroups
    .map((group) => ({
      ...group,
      services: services.filter((service) => {
        const belongs = group.match.includes(service.slug);
        if (belongs) assigned.add(service.id);
        return belongs;
      }),
    }))
    .filter((group) => group.services.length)
    .concat([
      {
        id: "otros",
        label: "Otros formatos",
        copy: "Soluciones específicas para necesidades más particulares.",
        services: services.filter((service) => !assigned.has(service.id)),
      },
    ])
    .filter((group) => group.services.length);
}

export function ServicesPage() {
  const { data } = useSite();
  const [quote, setQuote] = useState(false);
  const services = visibleContent(data.services);
  const faqs = visibleContent(data.faqs).sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );
  const groups = groupedServices(services);
  return (
    <>
      <main>
        <PageHero
          eyebrow="Servicios / Cotización personalizada"
          title="Diseño a tu medida."
          copy="Elige el servicio que más se acerca a tu necesidad. Cada cotización se adapta al alcance, tiempos y objetivos de tu proyecto."
          action={
            <button className="button primary" onClick={() => setQuote(true)}>
              Empezar cotización <ArrowUpRight size={17} />
            </button>
          }
        />
        <section className="section service-groups">
          {groups.map((group) => (
            <div className="service-group" key={group.id}>
              <div className="service-group-heading">
                <span className="eyebrow">{String(groups.indexOf(group) + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{group.label}</h2>
                  <p>{group.copy}</p>
                </div>
              </div>
              <div className="services-grid">
                {group.services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className="section">
          <div className="how-quote">
            <span className="eyebrow">Cómo funciona</span>
            <h2>Una cotización clara en tres pasos.</h2>
            <div>
              {[
                ["01", "Elige", "Selecciona el servicio que necesitas."],
                [
                  "02",
                  "Responde",
                  "Completa las preguntas específicas del proyecto.",
                ],
                [
                  "03",
                  "Recibe",
                  "La solicitud llega organizada a correo y WhatsApp.",
                ],
              ].map(([n, t, p]) => (
                <article key={n}>
                  <b>{n}</b>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section services-faq">
          <div className="faq-intro">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2>Lo esencial antes de comenzar.</h2>
            <p>
              Información clara sobre cotización, revisiones, archivos, pagos y
              trabajo a distancia.
            </p>
            <button className="button primary" onClick={() => setQuote(true)}>
              Solicitar una cotización <ArrowUpRight />
            </button>
          </div>
          <FAQAccordion items={faqs} />
        </section>
      </main>
      {quote && <QuoteWizard onClose={() => setQuote(false)} />}
    </>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const { data } = useSite();
  const [quote, setQuote] = useState(false);
  const service = data.services.find((s) => s.slug === slug);
  if (!service || !isContentVisible(service)) return <NotFound />;
  return (
    <>
      <main>
        <div className="section breadcrumb-wrap">
          <Breadcrumbs
            items={[
              { label: "Servicios", to: "/servicios" },
              { label: service.name },
            ]}
          />
        </div>
        <section className="service-detail-hero section">
          <div>
            <span className="eyebrow">Servicio / {service.delivery}</span>
            <h1>{service.name}</h1>
            <p>{service.summary}</p>
            {service.idealFor && (
              <p className="ideal-for">
                <b>Ideal para:</b> {service.idealFor}
              </p>
            )}
            <div className="button-row">
              <button className="button primary" onClick={() => setQuote(true)}>
                Cotizar este servicio <MessageCircle size={18} />
              </button>
              <span className="price-label">{service.priceLabel}</span>
            </div>
          </div>
          <div className="service-symbol">
            <Palette />
          </div>
        </section>
        <section className="section service-detail-grid">
          <div>
            <span className="eyebrow">Qué necesito de ti</span>
            <h2>Un buen resultado empieza con buena información.</h2>
            <ul className="check-list">
              {service.requirements.map((x) => (
                <li key={x}>
                  <Check />
                  {x}
                </li>
              ))}
            </ul>
            <div className="deliverable-box">
              <Clock3 />
              <div>
                <b>Tiempo estimado</b>
                <span>{service.delivery}</span>
              </div>
            </div>
          </div>
          <PriceCalculator base={service.basePrice} />
        </section>
        {service.deliverables?.length > 0 && (
          <section className="section deliverables-section">
            <SectionHeading
              eyebrow="Qué recibirás"
              title={"Entregables <em>claros y organizados.</em>"}
            />
            <div className="deliverables-grid">
              {service.deliverables.map((item, index) => (
                <article key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Check />
                  <b>{item}</b>
                </article>
              ))}
            </div>
          </section>
        )}
        <section className="section">
          <SectionHeading
            eyebrow="Formulario inteligente"
            title={"Preguntas específicas para <em>este servicio.</em>"}
            copy="El formulario cambia según el servicio para pedir solo la información necesaria."
          />
          <div className="question-preview">
            {service.questions.map((q, i) => (
              <div key={q.id}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{q.label}</b>
                <small>
                  {q.type} · {q.required ? "obligatoria" : "opcional"}
                </small>
              </div>
            ))}
          </div>
          <button className="button primary" onClick={() => setQuote(true)}>
            Responder y solicitar cotización
          </button>
        </section>
      </main>
      {quote && (
        <QuoteWizard service={service} onClose={() => setQuote(false)} />
      )}
    </>
  );
}

export function PlansPage() {
  const { data } = useSite();
  const [selected, setSelected] = useState(null);
  const ordered = visibleContent(data.plans).sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );
  return (
    <>
      <main>
        <PageHero
          eyebrow="Paquetes de identidad"
          title="Un punto de partida para cada marca."
          copy="Tres niveles claros para comenzar. Si tu proyecto necesita algo distinto, construimos una propuesta personalizada."
        />
        <section className="section plan-grid">
          {ordered.map((plan, index) => (
            <article
              className={`plan-card ${plan.featured ? "featured" : ""}`}
              key={plan.id}
            >
              {plan.featured && (
                <span className="recommended">Más elegido</span>
              )}
              <span className="eyebrow">{plan.eyebrow}</span>
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <div className="plan-price">
                <small>Desde</small>
                <b>${plan.price}</b>
                <span>USD</span>
              </div>
              <div className="plan-facts">
                <span>
                  <Clock3 /> {plan.delivery}
                </span>
                <span>
                  <PenTool /> {plan.revisions}
                </span>
              </div>
              <div className="plan-ideal">
                <b>Ideal para</b>
                <p>{plan.idealFor}</p>
              </div>
              {index > 0 && (
                <div className="plan-inherits">
                  <Check />
                  <span>
                    <b>Todo lo incluido en {ordered[index - 1].name}</b>
                    <small>Más las mejoras exclusivas de este nivel</small>
                  </span>
                </div>
              )}
              <ul>
                {plan.features
                  .filter((f) => !/^todo el (paquete|plan)/i.test(f))
                  .map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
              </ul>
              <div className="plan-formats">
                <b>Formatos de entrega</b>
                <span>{plan.formats?.join(" · ")}</span>
              </div>
              <button
                className={`button wide ${plan.featured ? "dark" : "ghost"}`}
                onClick={() => setSelected(plan)}
              >
                Elegir {plan.name} <ArrowUpRight size={17} />
              </button>
            </article>
          ))}
        </section>
        <section className="section">
          <SectionHeading
            eyebrow="Comparación"
            title={"Elige según el <em>momento de tu marca.</em>"}
            copy="Cada nivel suma capacidades sin perder nada de los planes anteriores."
          />
          <PlanComparison plans={ordered} />
        </section>
        <section className="section comparison">
          <span className="eyebrow">¿No sabes cuál elegir?</span>
          <h2>Te ayudo a encontrar el alcance correcto.</h2>
          <p>
            La mejor inversión no siempre es el paquete más grande, sino el que
            resuelve el momento actual de tu marca.
          </p>
          <Link className="button primary" to="/contacto">
            Conversemos
          </Link>
        </section>
      </main>
      {selected && (
        <QuoteWizard plan={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

export function AboutPage() {
  const { data } = useSite();
  const featured = visibleContent(data.projects).slice(0, 3);
  const principles = [
    [Target, "Primero entendemos", "Antes de diseñar, ordenamos el problema, el público y la decisión que debe provocar la marca."],
    [PenTool, "Diseñamos sistemas", "No entrego una pieza aislada: construyo reglas, recursos y formatos que puedas seguir usando."],
    [Check, "Entregamos claridad", "Cada proyecto termina con archivos organizados, próximos pasos claros y una conversación honesta."],
  ];
  return (
    <main>
      <PageHero
        eyebrow="Sobre Jonathan / Dirección creativa"
        title="Diseño con intención y personalidad."
        copy="Soy Jonathan Peña, diseñador gráfico y publicista. Ayudo a marcas y proyectos a convertir ideas dispersas en identidades visuales claras, memorables y útiles."
        action={<Link className="button primary" to="/contacto">Conversemos <ArrowUpRight size={17} /></Link>}
      />
      <section className="section about-intro">
        <div className="about-portrait">
          <img src={assetUrl("/assets/personaje-04.jpg")} alt="Jonathan Peña, diseñador gráfico y publicista" />
          <span>JEP / 2026</span>
        </div>
        <div className="about-copy">
          <span className="eyebrow">Una forma de trabajar</span>
          <h2>La creatividad debe verse bien, pero también <em>hacer su trabajo.</em></h2>
          <p>Trabajo de forma directa, con un proceso sencillo y preguntas concretas. Mi objetivo es que entiendas por qué una solución funciona y puedas usarla con seguridad después de la entrega.</p>
          <div className="about-facts">
            <div><b>{data.services.length}</b><span>servicios disponibles</span></div>
            <div><b>{data.projects.length}</b><span>casos en el archivo</span></div>
            <div><b>1:1</b><span>acompañamiento directo</span></div>
          </div>
        </div>
      </section>
      <section className="section about-principles">
        <SectionHeading eyebrow="Principios de trabajo" title="Una buena relación también forma parte del <em>resultado.</em>" copy="Tres ideas que guían cada encargo, desde la primera pregunta hasta los archivos finales." />
        <div className="principles-grid">
          {principles.map(([Icon, title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section about-work">
        <SectionHeading eyebrow="Una muestra del trabajo" title="Conoce algunos proyectos <em>desde dentro.</em>" action={<Link className="text-link" to="/portfolio">Ver archivo completo <ArrowUpRight size={16} /></Link>} />
        <div className="project-grid">
          {featured.map((project) => <ProjectCard key={project.id} project={project} category={data.categories.find((category) => category.id === project.categoryId)} />)}
        </div>
      </section>
      <CtaBlock />
    </main>
  );
}

export function ContactPage() {
  const { data, submitInquiry, notify } = useSite();
  const page = data.pages.find((p) => p.id === "contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = async (e) => {
    e.preventDefault();
    await submitInquiry({
      id: crypto.randomUUID(),
      serviceId: null,
      serviceName: "Contacto general",
      contact: { name: form.name, email: form.email },
      answers: { message: form.message },
      files: [],
      status: "new",
      createdAt: new Date().toISOString(),
    });
    notify("Mensaje guardado. Te responderé pronto.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <main>
      <PageHero
        eyebrow="Contacto directo"
        title="Hablemos sin vueltas."
        copy="Cuéntame qué quieres construir y te responderé con próximos pasos claros."
      />
      <section className="section contact-layout">
        <div className="contact-options">
          <a
            href={`https://wa.me/${data.settings.whatsappRaw}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle />
            <div>
              <span>WhatsApp</span>
              <b>{data.settings.whatsapp}</b>
            </div>
            <ArrowUpRight />
          </a>
          <a href={`mailto:${data.settings.email}`}>
            <Mail />
            <div>
              <span>Correo</span>
              <b>{data.settings.email}</b>
            </div>
            <ArrowUpRight />
          </a>
          <a href={data.settings.instagram} target="_blank" rel="noreferrer">
            <Camera />
            <div>
              <span>Instagram</span>
              <b>@jepdesigner.ec</b>
            </div>
            <ArrowUpRight />
          </a>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <h2>Escríbeme aquí.</h2>
          <div className="field-grid">
            <label className="field">
              <span>Nombre</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Correo</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="field full">
              <span>¿En qué puedo ayudarte?</span>
              <textarea
                required
                rows="6"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
          </div>
          <button className="button primary">
            Enviar mensaje <ArrowUpRight size={17} />
          </button>
        </form>
      </section>
      <BlockRenderer blocks={page?.blocks || []} />
    </main>
  );
}

export function LegalPage({ type }) {
  const { data } = useSite();
  const page = data.pages.find((p) => p.id === type) || {
    title: "Información legal",
    intro: "Información sobre el uso de este sitio.",
    blocks: [],
  };
  let content;
  if (type === "terms")
    content = (
      <>
        <h2>1. Cotizaciones y alcance</h2>
        <p>
          Las cotizaciones describen entregables, tiempos y número de
          revisiones. Cambios de alcance pueden requerir una actualización de
          precio y calendario.
        </p>
        <h2>2. Pagos</h2>
        <p>
          El inicio del proyecto se confirma con el anticipo indicado en la
          propuesta. El saldo debe completarse antes de la entrega de archivos
          finales editables.
        </p>
        <h2>3. Revisiones y tiempos</h2>
        <p>
          Los tiempos dependen de la entrega de información y aprobación del
          cliente. Las rondas adicionales se cotizan por separado.
        </p>
        <h2>4. Propiedad intelectual</h2>
        <p>
          Los derechos de uso de la propuesta aprobada se transfieren según lo
          acordado. Las propuestas no seleccionadas siguen siendo propiedad de
          JEP Designer.
        </p>
        <h2>5. Portafolio</h2>
        <p>
          El trabajo podrá mostrarse como caso de estudio salvo que exista un
          acuerdo de confidencialidad.
        </p>
      </>
    );
  else if (type === "privacy")
    content = (
      <>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          JEP Designer, administrado por Jonathan Peña, es responsable de la
          información que envías mediante contacto, cotizaciones y archivos
          adjuntos.
        </p>
        <h2>2. Datos que recopilamos</h2>
        <p>
          Podemos solicitar nombre, correo, teléfono, información del proyecto,
          respuestas del formulario y archivos necesarios para preparar una
          propuesta.
        </p>
        <h2>3. Finalidad y conservación</h2>
        <p>
          Los datos se utilizan exclusivamente para responder, cotizar, ejecutar
          y dar seguimiento al servicio. Se conservarán mientras exista una
          relación comercial o una obligación legítima, y después podrán
          eliminarse de forma segura.
        </p>
        <h2>4. Archivos y confidencialidad</h2>
        <p>
          Los documentos del cliente se tratarán como información de proyecto.
          No se publicarán ni compartirán con terceros salvo proveedores
          necesarios para prestar el servicio o autorización expresa.
        </p>
        <h2>5. Derechos</h2>
        <p>
          Puedes solicitar acceso, corrección o eliminación escribiendo a{" "}
          {data.settings.email}. También puedes retirar tu consentimiento antes
          de contratar.
        </p>
        <h2>6. Seguridad</h2>
        <p>
          El sitio aplicará controles de acceso, almacenamiento privado y
          políticas de base de datos antes de recibir información en producción.
        </p>
      </>
    );
  else
    content = (
      <>
        <h2>Qué son las cookies</h2>
        <p>
          Son pequeños archivos que permiten recordar preferencias y comprender
          cómo se utiliza un sitio.
        </p>
        <h2>Cookies necesarias</h2>
        <p>
          Se utilizan para recordar el tema visual, datos temporales del
          cotizador y preferencias esenciales.
        </p>
        <h2>Analítica</h2>
        <p>
          La analítica se activará únicamente cuando exista una herramienta
          configurada y el consentimiento correspondiente.
        </p>
        <h2>Control</h2>
        <p>
          Puedes eliminar o bloquear cookies desde la configuración de tu
          navegador.
        </p>
      </>
    );
  return (
    <main>
      <PageHero
        eyebrow="Información legal"
        title={page.title}
        copy={page.intro}
      />
      <section className="section legal-copy">{content}</section>
      <BlockRenderer blocks={page.blocks || []} />
    </main>
  );
}

export function ThankYouPage() {
  return (
    <main className="thank-you">
      <div>
        <span className="success-ring">
          <Check />
        </span>
        <span className="eyebrow">Solicitud recibida</span>
        <h1>Gracias por contarme tu idea.</h1>
        <p>
          La información quedó organizada. Puedes continuar la conversación en
          WhatsApp y recibirás respuesta lo antes posible.
        </p>
        <Link className="button primary" to="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
export function NotFound() {
  return (
    <main className="thank-you not-found">
      <div>
        <span className="eyebrow">Error 404 / Ruta creativa</span>
        <h1>
          Aquí no está lo que buscas, pero tu próxima marca puede empezar ahora.
        </h1>
        <p>
          Explora proyectos reales, revisa los servicios o cuéntame directamente
          qué necesitas.
        </p>
        <div className="button-row">
          <Link className="button primary" to="/portfolio">
            Ver portfolio
          </Link>
          <Link className="button ghost" to="/servicios">
            Cotizar proyecto
          </Link>
          <Link className="text-link" to="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function PageHero({ eyebrow, title, copy, action }) {
  return (
    <section className="page-hero section">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      {action && <div className="button-row">{action}</div>}
    </section>
  );
}
function CtaBlock({ onQuote }) {
  return (
    <section className="section cta-block">
      <div>
        <span className="eyebrow">¿Tienes un proyecto?</span>
        <h2>
          Hagámoslo <em>real.</em>
        </h2>
        <p>Una buena marca empieza con una conversación honesta.</p>
      </div>
      {onQuote ? (
        <button className="button dark" onClick={onQuote}>
          Cuéntame tu idea <ArrowUpRight />
        </button>
      ) : (
        <Link className="button dark" to="/servicios">
          Cotizar proyecto <ArrowUpRight />
        </Link>
      )}
    </section>
  );
}
