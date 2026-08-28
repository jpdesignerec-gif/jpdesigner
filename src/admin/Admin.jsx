import { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Download,
  Eye,
  FileText,
  FolderTree,
  History,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Logo } from "../components/UI";
import { BlockBuilder } from "../components/BlockBuilder";
import { useSite } from "../store/SiteStore";
import { ConfirmDialog } from "../components/Feedback";
import {
  AdminListToolbar,
  AdminSearch,
  EditorialFields,
  ExportActions,
  Pagination,
  useAdminList,
  useEditorialDraft,
  VersionHistory,
} from "./EditorialAdmin";

const adminNav = [
  ["/admin", LayoutDashboard, "Resumen", true],
  ["/admin/paginas", FileText, "Páginas"],
  ["/admin/contenido", Users, "FAQ y testimonios"],
  ["/admin/portfolio", BriefcaseBusiness, "Portfolio"],
  ["/admin/categorias", FolderTree, "Categorías"],
  ["/admin/servicios", CircleDollarSign, "Servicios"],
  ["/admin/planes", BarChart3, "Planes"],
  ["/admin/consultas", Inbox, "Consultas"],
  ["/admin/medios", Image, "Medios"],
  ["/admin/papelera", Trash2, "Papelera"],
  ["/admin/ajustes", Settings, "Ajustes"],
];
const ADMIN_SESSION_KEY = "jep-admin-session-v1";
const adminPreviewEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN_DEMO === "true";
const adminPreviewCode = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_ADMIN_CODE || "demo2026"
  : "";
const validAdminSession = () => {
  try {
    const session = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
    return adminPreviewEnabled && session?.expiresAt > Date.now();
  } catch {
    return false;
  }
};

export function AdminGuard() {
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
    return () => {
      robots.content = "index, follow";
    };
  }, []);
  return validAdminSession() ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/acceso" replace />
  );
}

export function AdminLogin() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (code === adminPreviewCode && adminPreviewEnabled) {
      sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ expiresAt: Date.now() + 8 * 60 * 60 * 1000 }),
      );
      nav("/admin");
    } else
      setError(
        "No fue posible iniciar sesión. Verifica el acceso configurado.",
      );
  };
  return (
    <main className="admin-login">
      <div className="login-card">
        <Logo />
        <span className="eyebrow">Área privada</span>
        <h1>Gestiona tu sitio.</h1>
        <p>
          {adminPreviewEnabled
            ? "Acceso temporal de desarrollo. La sesión se cierra automáticamente después de 8 horas."
            : "El panel permanecerá cerrado hasta conectar Supabase Auth."}
        </p>
        {adminPreviewEnabled ? (
          <form onSubmit={submit}>
            <label className="field">
              <span>Código de acceso</span>
              <input
                autoFocus
                type="password"
                autoComplete="current-password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="button primary wide">
              Entrar al panel <ChevronRight />
            </button>
          </form>
        ) : (
          <div className="admin-locked">
            <Settings />
            <span>
              <b>Administración protegida</b>
              <small>
                Configura Supabase para habilitar usuarios y permisos reales.
              </small>
            </span>
          </div>
        )}
        <LinkBack />
      </div>
    </main>
  );
}

function LinkBack() {
  return (
    <a className="login-back" href="/">
      <ArrowLeft size={15} /> Volver al sitio
    </a>
  );
}

export function AdminLayout() {
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  return (
    <div className="admin-shell">
      <aside className={mobile ? "admin-sidebar open" : "admin-sidebar"}>
        <div className="admin-brand">
          <Logo />
          <button onClick={() => setMobile(false)}>
            <X />
          </button>
        </div>
        <span className="sidebar-label">Contenido</span>
        <nav>
          {adminNav.map(([to, Icon, label, end]) => (
            <NavLink
              key={to}
              end={end}
              to={to}
              onClick={() => setMobile(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="/" target="_blank">
            <Eye size={18} /> Ver sitio
          </a>
          <button
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              nav("/admin/acceso");
            }}
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <AdminSearch />
          <span>JP</span>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data } = useSite();
  const latest = data.inquiries.slice(0, 5);
  const publishedCount = (collection) =>
    (data[collection] || []).filter(
      (item) =>
        item.status === "published" ||
        (item.status == null && item.published !== false),
    ).length;
  return (
    <AdminPage
      title="Resumen"
      subtitle="Vista general del contenido y las solicitudes recientes."
      action={
        <a className="button primary small" href="/" target="_blank">
          Ver sitio <Eye size={16} />
        </a>
      }
    >
      <div className="metric-grid">
        {[
          [BriefcaseBusiness, data.projects.length, "Proyectos"],
          [CircleDollarSign, data.services.length, "Servicios"],
          [Inbox, data.inquiries.length, "Consultas"],
          [Image, data.media.length, "Archivos"],
        ].map(([Icon, value, label]) => (
          <article key={label}>
            <Icon />
            <span>{label}</span>
            <b>{value}</b>
            <small>Contenido total</small>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="admin-card">
          <CardTitle title="Consultas recientes" link="/admin/consultas" />
          {latest.length ? (
            latest.map((q) => (
              <div className="inquiry-row" key={q.id}>
                <span className="avatar">{q.contact.name?.[0] || "?"}</span>
                <div>
                  <b>{q.contact.name}</b>
                  <small>
                    {q.serviceName} ·{" "}
                    {new Date(q.createdAt).toLocaleDateString("es-EC")}
                  </small>
                </div>
                <Status status={q.status} />
              </div>
            ))
          ) : (
            <EmptyState
              title="Aún no hay consultas"
              copy="Las solicitudes del formulario aparecerán aquí."
            />
          )}
        </section>
        <section className="admin-card">
          <CardTitle title="Estado del sitio" />
          <div className="health-list">
            <div>
              <Check />
              <span>
                <b>Contenido local activo</b>
                <small>
                  {publishedCount("pages")} páginas y{" "}
                  {publishedCount("projects")} proyectos visibles.
                </small>
              </span>
            </div>
            <div>
              <Check />
              <span>
                <b>{publishedCount("services")} servicios publicados</b>
                <small>
                  {
                    data.services.filter((item) => item.questions?.length)
                      .length
                  }{" "}
                  tienen formularios configurables.
                </small>
              </span>
            </div>
            <div className="pending">
              <MoreHorizontal />
              <span>
                <b>Supabase pendiente</b>
                <small>
                  La conexión real se activa al configurar las variables
                  documentadas.
                </small>
              </span>
            </div>
          </div>
        </section>
      </div>
      <section className="admin-card">
        <CardTitle title="Accesos rápidos" />
        <div className="quick-actions">
          <NavLink to="/admin/portfolio">
            <Plus />
            Nuevo proyecto
          </NavLink>
          <NavLink to="/admin/servicios">
            <Pencil />
            Editar preguntas
          </NavLink>
          <NavLink to="/admin/paginas">
            <FileText />
            Editar inicio
          </NavLink>
          <NavLink to="/admin/medios">
            <Upload />
            Subir imágenes
          </NavLink>
        </div>
      </section>
    </AdminPage>
  );
}

export function PagesAdmin() {
  const {
    data,
    saveEditorial,
    autosaveItem,
    duplicateItem,
    trashItem,
    notify,
  } = useSite();
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = useAdminList(data.pages, {
    pageSize: 7,
    searchFields: ["title", "slug", "headline"],
  });
  const save = (form) => {
    saveEditorial("pages", form.id, form, { label: "Página guardada" });
    notify("Página guardada y versionada");
    setEditing(null);
  };
  return (
    <AdminPage
      title="Páginas principales"
      subtitle="Borradores, programación, SEO, versiones y publicación segura."
    >
      {editing && (
        <PageEditor
          item={editing}
          onClose={() => setEditing(null)}
          onAutosave={(form) =>
            autosaveItem("pages", form.id, {
              ...form,
              status: "draft",
              published: false,
            })
          }
          onSave={save}
        />
      )}
      <AdminListToolbar list={list} placeholder="Buscar página…" />
      <div className="admin-card table-card">
        <div className="data-table">
          <div className="table-head">
            <span>Página</span>
            <span>Ruta</span>
            <span>Estado</span>
            <span></span>
          </div>
          {list.visible.map((p) => (
            <div className="table-row" key={p.id}>
              <div>
                <b>{p.title}</b>
                <small>
                  {p.autosavedAt
                    ? `Autoguardado ${new Date(p.autosavedAt).toLocaleTimeString("es-EC")}`
                    : p.eyebrow || "Página legal"}
                </small>
              </div>
              <code>{p.slug}</code>
              <Status
                status={p.status || (p.published ? "published" : "draft")}
              />
              <div className="row-actions">
                <button title="Editar" onClick={() => setEditing(p)}>
                  <Pencil />
                </button>
                <button
                  title="Duplicar"
                  onClick={() => {
                    duplicateItem("pages", p.id);
                    notify("Página duplicada como borrador");
                  }}
                >
                  <Copy />
                </button>
                <button title="Historial" onClick={() => setHistory(p)}>
                  <History />
                </button>
                <button
                  title="Papelera"
                  className="danger"
                  onClick={() => setDeleting(p)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination list={list} />
      <VersionHistory
        collection="pages"
        itemId={history?.id}
        open={Boolean(history)}
        onClose={() => setHistory(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover página a papelera"
        message={`La página “${deleting?.title || ""}” dejará de estar disponible públicamente, pero podrás restaurarla desde Papelera.`}
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem("pages", deleting.id);
          notify("Página movida a papelera");
        }}
      />
    </AdminPage>
  );
}

function PageEditor({ item, onClose, onSave, onAutosave }) {
  const draft = useEditorialDraft(item, onAutosave);
  const { form, setForm, dirty, savedAt, markSaved, canClose } = draft;
  const close = () => canClose() && onClose();
  return (
    <EditorDrawer
      title={`Editar ${item.title}`}
      onClose={close}
      onSave={() => {
        markSaved();
        onSave(form);
      }}
      dirty={dirty}
      savedAt={savedAt}
      wide
    >
      <nav className="editor-section-nav">
        <a href="#page-basics">Información principal</a>
        <a href="#page-blocks">Bloques visuales</a>
        <a href={`${form.slug}?preview=1`} target="_blank" rel="noreferrer">
          <Eye /> Vista previa privada
        </a>
      </nav>
      <div id="page-basics" className="editor-basics">
        <TextField
          label="Título"
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
        />
        <TextField
          label="Etiqueta superior"
          value={form.eyebrow || ""}
          onChange={(eyebrow) => setForm({ ...form, eyebrow })}
        />
        <TextField
          label="Titular"
          value={form.headline}
          onChange={(headline) => setForm({ ...form, headline })}
        />
        <RichTextEditor
          label="Introducción"
          value={form.intro}
          onChange={(intro) => setForm({ ...form, intro })}
        />
        <EditorialFields form={form} onChange={setForm} />
      </div>
      <div id="page-blocks">
        <BlockBuilder
          label="Contenido flexible de la página"
          value={form.blocks || []}
          onChange={(blocks) => setForm({ ...form, blocks })}
        />
      </div>
    </EditorDrawer>
  );
}

export function ProjectsAdmin() {
  const {
    data,
    addItem,
    saveEditorial,
    autosaveItem,
    duplicateItem,
    trashItem,
    reorderItem,
    notify,
  } = useSite();
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = useAdminList(data.projects, {
    pageSize: 8,
    searchFields: ["title", "summary", (p) => p.tags?.join(" ")],
  });
  const create = () =>
    setEditing({
      id: crypto.randomUUID(),
      slug: "nuevo-proyecto",
      title: "Nuevo proyecto",
      categoryId: data.categories[0]?.id,
      summary: "",
      body: "",
      blocks: [],
      cover: "/assets/portada.jpg",
      gallery: [],
      tags: [],
      featured: false,
      year: String(new Date().getFullYear()),
      client: "",
      services: [],
      status: "draft",
      published: false,
      isNew: true,
    });
  const save = (form) => {
    const { isNew, ...item } = form;
    if (isNew)
      addItem("projects", {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    else
      saveEditorial("projects", item.id, item, { label: "Proyecto guardado" });
    notify(
      isNew
        ? "Proyecto creado como borrador"
        : "Proyecto guardado y versionado",
    );
    setEditing(null);
  };
  return (
    <AdminPage
      title="Portfolio"
      subtitle="Casos de estudio con borradores, SEO, versiones, filtros y publicación."
      action={
        <button className="button primary small" onClick={create}>
          <Plus />
          Nuevo proyecto
        </button>
      }
    >
      {editing && (
        <ProjectEditor
          item={editing}
          categories={data.categories}
          onClose={() => setEditing(null)}
          onAutosave={
            editing.isNew
              ? null
              : (form) =>
                  autosaveItem("projects", form.id, {
                    ...form,
                    status: "draft",
                    published: false,
                  })
          }
          onSave={save}
        />
      )}
      <AdminListToolbar
        list={list}
        placeholder="Buscar por título, resumen o tag…"
      />
      <div className="admin-card table-card">
        <div className="data-table projects-table">
          <div className="table-head">
            <span>Proyecto</span>
            <span>Categoría</span>
            <span>Año</span>
            <span>Estado</span>
            <span></span>
          </div>
          {list.visible.map((p) => (
            <div className="table-row" key={p.id}>
              <div className="project-cell">
                <img src={p.cover} alt="" />
                <span>
                  <b>{p.title}</b>
                  <small>{p.tags.join(", ")}</small>
                </span>
              </div>
              <span>
                {data.categories.find((c) => c.id === p.categoryId)?.name}
              </span>
              <span>{p.year}</span>
              <Status
                status={
                  p.status || (p.published === false ? "draft" : "published")
                }
              />
              <div className="row-actions">
                <button
                  title="Subir"
                  onClick={() => reorderItem("projects", p.id, -1)}
                >
                  <ArrowUp />
                </button>
                <button
                  title="Bajar"
                  onClick={() => reorderItem("projects", p.id, 1)}
                >
                  <ArrowDown />
                </button>
                <button title="Editar" onClick={() => setEditing(p)}>
                  <Pencil />
                </button>
                <button
                  title="Duplicar"
                  onClick={() => {
                    duplicateItem("projects", p.id);
                    notify("Proyecto duplicado como borrador");
                  }}
                >
                  <Copy />
                </button>
                <button title="Historial" onClick={() => setHistory(p)}>
                  <History />
                </button>
                <button
                  title="Papelera"
                  className="danger"
                  onClick={() => setDeleting(p)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination list={list} />
      <VersionHistory
        collection="projects"
        itemId={history?.id}
        open={Boolean(history)}
        onClose={() => setHistory(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover proyecto a papelera"
        message={`El proyecto “${deleting?.title || ""}” se retirará del portfolio. Sus imágenes no se eliminarán y podrás restaurarlo.`}
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem("projects", deleting.id);
          notify("Proyecto movido a papelera");
        }}
      />
    </AdminPage>
  );
}

function ProjectEditor({ item, categories, onClose, onSave, onAutosave }) {
  const { form, setForm, dirty, savedAt, markSaved, canClose } =
    useEditorialDraft(item, onAutosave);
  const close = () => canClose() && onClose();
  return (
    <EditorDrawer
      title={item.isNew ? "Nuevo proyecto" : "Editar proyecto"}
      onClose={close}
      onSave={() => {
        markSaved();
        onSave(form);
      }}
      dirty={dirty}
      savedAt={savedAt}
      wide
    >
      <nav className="editor-section-nav">
        <a href="#project-basics">Ficha del proyecto</a>
        <a href="#project-blocks">Caso por bloques</a>
        <a
          href={`/portfolio/${form.slug}?preview=1`}
          target="_blank"
          rel="noreferrer"
        >
          <Eye /> Vista previa privada
        </a>
      </nav>
      <div id="project-basics" className="editor-columns">
        <div>
          <TextField
            label="Título"
            value={form.title}
            onChange={(title) =>
              setForm({ ...form, title, slug: slugify(title) })
            }
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(slug) => setForm({ ...form, slug })}
          />
          <label className="field">
            <span>Categoría</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <RichTextEditor
            label="Resumen"
            value={form.summary}
            onChange={(summary) => setForm({ ...form, summary })}
          />
          <RichTextEditor
            label="Descripción del caso"
            value={form.body}
            onChange={(body) => setForm({ ...form, body })}
          />
        </div>
        <div>
          <ImageField
            label="Portada"
            value={form.cover}
            onChange={(cover) => setForm({ ...form, cover })}
          />
          <TextField
            label="Cliente"
            value={form.client}
            onChange={(client) => setForm({ ...form, client })}
          />
          <TextField
            label="Año"
            value={form.year}
            onChange={(year) => setForm({ ...form, year })}
          />
          <TextField
            label="Tags separados por coma"
            value={form.tags.join(", ")}
            onChange={(v) =>
              setForm({
                ...form,
                tags: v
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextField
            label="Servicios separados por coma"
            value={form.services.join(", ")}
            onChange={(v) =>
              setForm({
                ...form,
                services: v
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
          <Toggle
            label="Proyecto destacado"
            checked={form.featured}
            onChange={(featured) => setForm({ ...form, featured })}
          />
        </div>
      </div>
      <EditorialFields form={form} onChange={setForm} kind="proyecto" />
      <div id="project-blocks">
        <BlockBuilder
          label="Caso de estudio por bloques"
          value={form.blocks || []}
          onChange={(blocks) => setForm({ ...form, blocks })}
        />
      </div>
    </EditorDrawer>
  );
}

export function CategoriesAdmin() {
  const { data, addItem, updateItem, removeItem, notify } = useSite();
  const [editing, setEditing] = useState(null);
  const save = (form) => {
    form.isNew
      ? addItem("categories", { ...form, isNew: undefined })
      : updateItem("categories", form.id, form);
    notify("Categoría guardada");
    setEditing(null);
  };
  return (
    <AdminPage
      title="Categorías"
      subtitle="Organiza el portfolio en categorías y subcategorías."
      action={
        <button
          className="button primary small"
          onClick={() =>
            setEditing({
              id: crypto.randomUUID(),
              name: "",
              slug: "",
              description: "",
              parentId: null,
              order: data.categories.length + 1,
              isNew: true,
            })
          }
        >
          <Plus />
          Nueva categoría
        </button>
      }
    >
      {editing && (
        <EditorDrawer
          title="Editar categoría"
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        >
          <TextField
            label="Nombre"
            value={editing.name}
            onChange={(name) =>
              setEditing({ ...editing, name, slug: slugify(name) })
            }
          />
          <TextField
            label="Slug"
            value={editing.slug}
            onChange={(slug) => setEditing({ ...editing, slug })}
          />
          <RichTextEditor
            label="Descripción"
            value={editing.description}
            onChange={(description) => setEditing({ ...editing, description })}
          />
          <label className="field">
            <span>Categoría superior</span>
            <select
              value={editing.parentId || ""}
              onChange={(e) =>
                setEditing({ ...editing, parentId: e.target.value || null })
              }
            >
              <option value="">Ninguna</option>
              {data.categories
                .filter((c) => c.id !== editing.id)
                .map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
        </EditorDrawer>
      )}
      <div className="category-admin-grid">
        {data.categories.map((c) => (
          <article className="admin-card" key={c.id}>
            <div>
              <FolderTree />
              <span>
                {data.projects.filter((p) => p.categoryId === c.id).length}{" "}
                proyectos
              </span>
            </div>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <div>
              <button onClick={() => setEditing(c)}>
                <Pencil />
                Editar
              </button>
              <button
                className="danger"
                onClick={() =>
                  confirm("¿Eliminar categoría?") &&
                  removeItem("categories", c.id)
                }
              >
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminPage>
  );
}

export function ContentAdmin() {
  const {
    data,
    addItem,
    saveEditorial,
    autosaveItem,
    duplicateItem,
    trashItem,
    notify,
  } = useSite();
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [kind, setKind] = useState("faq");
  const collection = kind === "faq" ? "faqs" : "testimonials";
  const items = data[collection] || [];
  const list = useAdminList(items, {
    pageSize: 8,
    searchFields:
      kind === "faq" ? ["question", "answer"] : ["name", "company", "quote"],
  });
  const create = () =>
    setEditing(
      kind === "faq"
        ? {
            id: crypto.randomUUID(),
            question: "Nueva pregunta",
            answer: "",
            published: false,
            status: "draft",
            isNew: true,
          }
        : {
            id: crypto.randomUUID(),
            name: "Nombre del cliente",
            role: "Cargo",
            company: "Empresa",
            quote: "",
            published: false,
            status: "draft",
            contentVerified: false,
            isNew: true,
          },
    );
  const save = (form) => {
    const { isNew, ...item } = form;
    isNew
      ? addItem(collection, item)
      : saveEditorial(collection, item.id, item, {
          label: kind === "faq" ? "Pregunta guardada" : "Testimonio guardado",
        });
    notify(kind === "faq" ? "Pregunta guardada" : "Testimonio guardado");
    setEditing(null);
  };
  return (
    <AdminPage
      title="FAQ y testimonios"
      subtitle="Gestiona contenido de confianza visible en el inicio y la página de servicios."
      action={
        <button className="button primary small" onClick={create}>
          <Plus />
          Nuevo contenido
        </button>
      }
    >
      <div className="content-tabs">
        <button
          className={kind === "faq" ? "active" : ""}
          onClick={() => {
            setKind("faq");
            setEditing(null);
          }}
        >
          Preguntas frecuentes
        </button>
        <button
          className={kind === "testimonial" ? "active" : ""}
          onClick={() => {
            setKind("testimonial");
            setEditing(null);
          }}
        >
          Testimonios
        </button>
      </div>
      {editing && (
        <ContentEditor
          kind={kind}
          item={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onAutosave={
            editing.isNew
              ? null
              : (form) =>
                  autosaveItem(collection, form.id, {
                    ...form,
                    status: "draft",
                    published: false,
                  })
          }
        />
      )}
      <AdminListToolbar
        list={list}
        placeholder={kind === "faq" ? "Buscar pregunta…" : "Buscar testimonio…"}
      />
      <div className="admin-card content-list">
        {list.visible.map((item) => (
          <article key={item.id}>
            <div>
              <Status
                status={item.status || (item.published ? "published" : "draft")}
              />
              <h3>{kind === "faq" ? item.question : item.name}</h3>
              <p>
                {kind === "faq"
                  ? item.answer
                  : `${item.quote} — ${item.role}, ${item.company}`}
              </p>
            </div>
            <div className="row-actions">
              <button
                aria-label="Editar contenido"
                onClick={() => setEditing(item)}
              >
                <Pencil />
              </button>
              <button
                aria-label="Duplicar contenido"
                onClick={() => duplicateItem(collection, item.id)}
              >
                <Copy />
              </button>
              <button
                aria-label="Historial de contenido"
                onClick={() => setHistory(item)}
              >
                <History />
              </button>
              <button
                aria-label="Mover contenido a papelera"
                className="danger"
                onClick={() => setDeleting(item)}
              >
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
      <Pagination list={list} />
      <VersionHistory
        collection={collection}
        itemId={history?.id}
        open={Boolean(history)}
        onClose={() => setHistory(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover contenido a papelera"
        message="Dejará de mostrarse públicamente y podrás restaurarlo desde Papelera."
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem(collection, deleting.id);
          notify("Contenido movido a papelera");
        }}
      />
    </AdminPage>
  );
}

function ContentEditor({ kind, item, onClose, onSave, onAutosave }) {
  const { form, setForm, dirty, savedAt, markSaved, canClose } =
    useEditorialDraft(item, onAutosave);
  const close = () => canClose() && onClose();
  return (
    <EditorDrawer
      title={kind === "faq" ? "Editar pregunta" : "Editar testimonio"}
      onClose={close}
      onSave={() => {
        markSaved();
        onSave(form);
      }}
      dirty={dirty}
      savedAt={savedAt}
    >
      {kind === "faq" ? (
        <>
          <TextField
            label="Pregunta"
            value={form.question}
            onChange={(question) => setForm({ ...form, question })}
          />
          <RichTextEditor
            label="Respuesta"
            value={form.answer}
            onChange={(answer) => setForm({ ...form, answer })}
          />
        </>
      ) : (
        <>
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(name) => setForm({ ...form, name })}
          />
          <TextField
            label="Cargo"
            value={form.role}
            onChange={(role) => setForm({ ...form, role })}
          />
          <TextField
            label="Empresa"
            value={form.company}
            onChange={(company) => setForm({ ...form, company })}
          />
          <RichTextEditor
            label="Testimonio"
            value={form.quote}
            onChange={(quote) => setForm({ ...form, quote })}
          />
        </>
      )}
      <EditorialFields
        form={form}
        onChange={setForm}
        kind={kind === "testimonial" ? "proyecto" : "contenido"}
      />
    </EditorDrawer>
  );
}

export function ServicesAdmin() {
  const {
    data,
    addItem,
    saveEditorial,
    autosaveItem,
    duplicateItem,
    trashItem,
    reorderItem,
    notify,
  } = useSite();
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = useAdminList(data.services, {
    pageSize: 8,
    searchFields: ["name", "summary", "slug"],
  });
  const create = () =>
    setEditing({
      id: crypto.randomUUID(),
      slug: "nuevo-servicio",
      name: "Nuevo servicio",
      summary: "Describe el resultado principal del servicio.",
      idealFor: "",
      basePrice: 100,
      priceLabel: "Desde $100",
      delivery: "5 a 7 días laborables",
      requirements: [],
      deliverables: [],
      questions: [],
      status: "draft",
      published: false,
      isNew: true,
    });
  const save = (form) => {
    const { isNew, ...item } = form;
    isNew
      ? addItem("services", item)
      : saveEditorial("services", item.id, item, {
          label: "Servicio guardado",
        });
    notify(
      isNew
        ? "Servicio creado como borrador"
        : "Servicio guardado y versionado",
    );
    setEditing(null);
  };
  return (
    <AdminPage
      title="Servicios"
      subtitle="Precios, requisitos, formularios, SEO y publicación segura por servicio."
      action={
        <button className="button primary small" onClick={create}>
          <Plus />
          Nuevo servicio
        </button>
      }
    >
      {editing && (
        <ServiceEditor
          item={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onAutosave={
            editing.isNew
              ? null
              : (form) =>
                  autosaveItem("services", form.id, {
                    ...form,
                    status: "draft",
                    published: false,
                  })
          }
        />
      )}
      <AdminListToolbar list={list} placeholder="Buscar servicio…" />
      <div className="service-admin-list">
        {list.visible.map((s, i) => (
          <article className="admin-card" key={s.id}>
            <span>{String((list.page - 1) * 8 + i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{s.name}</h3>
              <p>{s.summary}</p>
              <small>
                {s.priceLabel} · {s.questions.length} preguntas ·{" "}
                <Status status={s.status} />
              </small>
            </div>
            <div className="row-actions">
              <button
                aria-label="Subir servicio"
                onClick={() => reorderItem("services", s.id, -1)}
              >
                <ArrowUp />
              </button>
              <button
                aria-label="Bajar servicio"
                onClick={() => reorderItem("services", s.id, 1)}
              >
                <ArrowDown />
              </button>
              <button
                aria-label="Editar servicio"
                onClick={() => setEditing(s)}
              >
                <Pencil />
              </button>
              <button
                aria-label="Duplicar servicio"
                onClick={() => duplicateItem("services", s.id)}
              >
                <Copy />
              </button>
              <button
                aria-label="Historial del servicio"
                onClick={() => setHistory(s)}
              >
                <History />
              </button>
              <button
                aria-label="Mover servicio a papelera"
                className="danger"
                onClick={() => setDeleting(s)}
              >
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
      <Pagination list={list} />
      <VersionHistory
        collection="services"
        itemId={history?.id}
        open={Boolean(history)}
        onClose={() => setHistory(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover servicio a papelera"
        message={`“${deleting?.name || ""}” dejará de aparecer en el cotizador y podrá restaurarse.`}
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem("services", deleting.id);
          notify("Servicio movido a papelera");
        }}
      />
    </AdminPage>
  );
}

function ServiceEditor({ item, onClose, onSave, onAutosave }) {
  const { form, setForm, dirty, savedAt, markSaved, canClose } =
    useEditorialDraft(item, onAutosave);
  const addQuestion = () =>
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          id: crypto.randomUUID(),
          label: "Nueva pregunta",
          type: "text",
          required: false,
          options: [],
        },
      ],
    });
  const updateQ = (id, patch) =>
    setForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === id ? { ...q, ...patch } : q,
      ),
    });
  const close = () => canClose() && onClose();
  return (
    <EditorDrawer
      title={item.isNew ? "Nuevo servicio" : `Editar ${item.name}`}
      onClose={close}
      onSave={() => {
        markSaved();
        onSave(form);
      }}
      dirty={dirty}
      savedAt={savedAt}
      wide
    >
      <nav className="editor-section-nav">
        <a href="#service-basics">Ficha comercial</a>
        <a href="#service-form">Formulario</a>
        <a
          href={`/servicios/${form.slug}?preview=1`}
          target="_blank"
          rel="noreferrer"
        >
          <Eye /> Vista previa privada
        </a>
      </nav>
      <div className="editor-columns">
        <div id="service-basics">
          <TextField
            label="Nombre"
            value={form.name}
            onChange={(name) => setForm({ ...form, name, slug: slugify(name) })}
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(slug) => setForm({ ...form, slug })}
          />
          <RichTextEditor
            label="Descripción"
            value={form.summary}
            onChange={(summary) => setForm({ ...form, summary })}
          />
          <RichTextEditor
            label="Ideal para"
            value={form.idealFor || ""}
            onChange={(idealFor) => setForm({ ...form, idealFor })}
          />
          <TextField
            label="Precio base"
            type="number"
            value={form.basePrice}
            onChange={(basePrice) =>
              setForm({
                ...form,
                basePrice: Number(basePrice),
                priceLabel: `Desde $${basePrice}`,
              })
            }
          />
          <TextField
            label="Tiempo de entrega"
            value={form.delivery}
            onChange={(delivery) => setForm({ ...form, delivery })}
          />
          <TextField
            label="Requisitos separados por coma"
            value={form.requirements.join(", ")}
            onChange={(v) =>
              setForm({
                ...form,
                requirements: v
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextField
            label="Entregables separados por coma"
            value={(form.deliverables || []).join(", ")}
            onChange={(v) =>
              setForm({
                ...form,
                deliverables: v
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
        <div id="service-form">
          <div className="question-editor-head">
            <div>
              <span className="eyebrow">Formulario</span>
              <h3>Preguntas ({form.questions.length})</h3>
            </div>
            <button className="button ghost small" onClick={addQuestion}>
              <Plus />
              Añadir
            </button>
          </div>
          <div className="question-editor-list">
            {form.questions.map((question, index) => (
              <QuestionEditorRow
                key={question.id}
                question={question}
                index={index}
                onChange={(patch) => updateQ(question.id, patch)}
                onRemove={() =>
                  setForm({
                    ...form,
                    questions: form.questions.filter(
                      (x) => x.id !== question.id,
                    ),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>
      <EditorialFields form={form} onChange={setForm} />
    </EditorDrawer>
  );
}

function QuestionEditorRow({ question, index, onChange, onRemove }) {
  const hasOptions = ["select", "radio", "checkbox"].includes(question.type);
  return (
    <div className="question-editor-row">
      <span>{index + 1}</span>
      <input
        value={question.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />
      <select
        value={question.type}
        onChange={(e) => onChange({ type: e.target.value })}
      >
        {[
          "text",
          "textarea",
          "number",
          "select",
          "radio",
          "checkbox",
          "color-multi",
          "date",
          "file",
        ].map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      {hasOptions && (
        <input
          className="question-options"
          value={(question.options || []).join(", ")}
          onChange={(e) =>
            onChange({
              options: e.target.value
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
          placeholder="Opciones separadas por coma"
        />
      )}
      <label>
        <input
          type="checkbox"
          checked={question.required}
          onChange={(e) => onChange({ required: e.target.checked })}
        />
        Obligatoria
      </label>
      <button className="danger" onClick={onRemove}>
        <Trash2 />
      </button>
    </div>
  );
}

export function PlansAdmin() {
  const {
    data,
    addItem,
    saveEditorial,
    autosaveItem,
    duplicateItem,
    trashItem,
    reorderItem,
    notify,
  } = useSite();
  const [editing, setEditing] = useState(null);
  const [history, setHistory] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = useAdminList(data.plans, {
    pageSize: 6,
    searchFields: ["name", "description", "eyebrow"],
  });
  const create = () =>
    setEditing({
      id: crypto.randomUUID(),
      name: "Nuevo plan",
      eyebrow: "Paquete personalizado",
      price: 300,
      description: "Describe el alcance de este paquete.",
      idealFor: "",
      delivery: "10 días laborables",
      revisions: "2 rondas",
      features: [],
      formats: [],
      notIncluded: [],
      featured: false,
      status: "draft",
      published: false,
      isNew: true,
    });
  const save = (form) => {
    const { isNew, ...item } = form;
    isNew
      ? addItem("plans", item)
      : saveEditorial("plans", item.id, item, { label: "Plan guardado" });
    notify(isNew ? "Plan creado como borrador" : "Plan guardado y versionado");
    setEditing(null);
  };
  return (
    <AdminPage
      title="Planes"
      subtitle="Precios, alcance, exclusiones, SEO y publicación segura de cada paquete."
      action={
        <button className="button primary small" onClick={create}>
          <Plus />
          Nuevo plan
        </button>
      }
    >
      {editing && (
        <PlanEditor
          item={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onAutosave={
            editing.isNew
              ? null
              : (form) =>
                  autosaveItem("plans", form.id, {
                    ...form,
                    status: "draft",
                    published: false,
                  })
          }
        />
      )}
      <AdminListToolbar list={list} placeholder="Buscar plan…" />
      <div className="admin-plan-grid">
        {list.visible.map((p) => (
          <article
            className={`admin-card ${p.featured ? "accent" : ""}`}
            key={p.id}
          >
            <span className="eyebrow">{p.eyebrow}</span>
            <h2>{p.name}</h2>
            <b>${p.price}</b>
            <p>{p.description}</p>
            <Status status={p.status} />
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="row-actions">
              <button onClick={() => reorderItem("plans", p.id, -1)}>
                <ArrowUp />
              </button>
              <button onClick={() => reorderItem("plans", p.id, 1)}>
                <ArrowDown />
              </button>
              <button onClick={() => setEditing(p)}>
                <Pencil />
              </button>
              <button onClick={() => duplicateItem("plans", p.id)}>
                <Copy />
              </button>
              <button onClick={() => setHistory(p)}>
                <History />
              </button>
              <button className="danger" onClick={() => setDeleting(p)}>
                <Trash2 />
              </button>
            </div>
          </article>
        ))}
      </div>
      <Pagination list={list} />
      <VersionHistory
        collection="plans"
        itemId={history?.id}
        open={Boolean(history)}
        onClose={() => setHistory(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover plan a papelera"
        message={`“${deleting?.name || ""}” dejará de estar disponible, pero podrás restaurarlo.`}
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem("plans", deleting.id);
          notify("Plan movido a papelera");
        }}
      />
    </AdminPage>
  );
}
function PlanEditor({ item, onClose, onSave, onAutosave }) {
  const { form, setForm, dirty, savedAt, markSaved, canClose } =
    useEditorialDraft(item, onAutosave);
  const close = () => canClose() && onClose();
  return (
    <EditorDrawer
      title={item.isNew ? "Nuevo plan" : `Editar ${item.name}`}
      onClose={close}
      onSave={() => {
        markSaved();
        onSave(form);
      }}
      dirty={dirty}
      savedAt={savedAt}
    >
      <TextField
        label="Nombre"
        value={form.name}
        onChange={(name) => setForm({ ...form, name })}
      />
      <TextField
        label="Etiqueta"
        value={form.eyebrow}
        onChange={(eyebrow) => setForm({ ...form, eyebrow })}
      />
      <TextField
        label="Precio"
        type="number"
        value={form.price}
        onChange={(price) => setForm({ ...form, price: Number(price) })}
      />
      <RichTextEditor
        label="Descripción"
        value={form.description}
        onChange={(description) => setForm({ ...form, description })}
      />
      <RichTextEditor
        label="Ideal para"
        value={form.idealFor || ""}
        onChange={(idealFor) => setForm({ ...form, idealFor })}
      />
      <TextField
        label="Tiempo de entrega"
        value={form.delivery || ""}
        onChange={(delivery) => setForm({ ...form, delivery })}
      />
      <TextField
        label="Revisiones incluidas"
        value={form.revisions || ""}
        onChange={(revisions) => setForm({ ...form, revisions })}
      />
      <TextField
        label="Características separadas por coma"
        value={form.features.join(", ")}
        onChange={(v) =>
          setForm({
            ...form,
            features: v
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          })
        }
      />
      <TextField
        label="Formatos de entrega"
        value={(form.formats || []).join(", ")}
        onChange={(v) =>
          setForm({
            ...form,
            formats: v
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          })
        }
      />
      <TextField
        label="No incluido"
        value={(form.notIncluded || []).join(", ")}
        onChange={(v) =>
          setForm({
            ...form,
            notIncluded: v
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
          })
        }
      />
      <Toggle
        label="Plan recomendado"
        checked={form.featured}
        onChange={(featured) => setForm({ ...form, featured })}
      />
      <EditorialFields form={form} onChange={setForm} />
    </EditorDrawer>
  );
}

export function InquiriesAdmin() {
  const { data, updateItem, trashItem, notify } = useSite();
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = useAdminList(data.inquiries, {
    pageSize: 10,
    searchFields: [
      (q) => q.contact?.name,
      (q) => q.contact?.email,
      "serviceName",
    ],
    initialFilter: "all",
  });
  const saveNotes = () => {
    updateItem("inquiries", selected.id, {
      internalNotes: selected.internalNotes || "",
      updatedAt: new Date().toISOString(),
    });
    notify("Notas internas guardadas");
  };
  return (
    <AdminPage
      title="Consultas"
      subtitle="Seguimiento, notas privadas y exportación de solicitudes."
    >
      <AdminListToolbar
        list={list}
        placeholder="Buscar contacto o servicio…"
        showStatus
        actions={<ExportActions items={list.visible} />}
      />
      <div className="admin-card table-card">
        <div className="data-table inquiry-table">
          <div className="table-head">
            <span>Contacto</span>
            <span>Servicio</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span></span>
          </div>
          {list.visible.length ? (
            list.visible.map((q) => (
              <div className="table-row" key={q.id}>
                <div>
                  <b>{q.contact.name}</b>
                  <small>
                    {q.contact.email}
                    {q.internalNotes ? " · Con notas" : ""}
                  </small>
                </div>
                <span>{q.serviceName}</span>
                <span>{new Date(q.createdAt).toLocaleDateString("es-EC")}</span>
                <select
                  aria-label={`Estado de ${q.contact.name}`}
                  value={q.status}
                  onChange={(e) =>
                    updateItem("inquiries", q.id, { status: e.target.value })
                  }
                >
                  <option value="new">Nueva</option>
                  <option value="contacted">Contactada</option>
                  <option value="closed">Cerrada</option>
                </select>
                <div className="row-actions">
                  <button
                    aria-label={`Ver consulta de ${q.contact.name}`}
                    onClick={() => setSelected({ ...q })}
                  >
                    <Eye />
                  </button>
                  <button
                    aria-label={`Eliminar consulta de ${q.contact.name}`}
                    className="danger"
                    onClick={() => setDeleting(q)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No hay consultas con estos filtros"
              copy="Cambia la búsqueda o prueba el cotizador público."
            />
          )}
        </div>
      </div>
      <Pagination list={list} />
      {selected && (
        <EditorDrawer
          title="Detalle de la consulta"
          onClose={() => setSelected(null)}
          onSave={saveNotes}
        >
          <div className="inquiry-detail">
            <span>Contacto</span>
            <h3>{selected.contact.name}</h3>
            <p>
              {selected.contact.email}
              <br />
              {selected.contact.phone || "Sin teléfono"}
            </p>
            <span>Servicio</span>
            <h3>{selected.serviceName}</h3>
            <span>Respuestas</span>
            <pre>{JSON.stringify(selected.answers, null, 2)}</pre>
            <label className="field">
              <span>Notas internas — nunca visibles para el cliente</span>
              <textarea
                rows="6"
                value={selected.internalNotes || ""}
                onChange={(e) =>
                  setSelected({ ...selected, internalNotes: e.target.value })
                }
                placeholder="Seguimiento, acuerdos, fecha de contacto…"
              />
            </label>
          </div>
        </EditorDrawer>
      )}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mover consulta a papelera"
        message={`La consulta de “${deleting?.contact?.name || ""}” podrá restaurarse desde Papelera.`}
        confirmLabel="Mover a papelera"
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          trashItem("inquiries", deleting.id);
          notify("Consulta movida a papelera");
        }}
      />
    </AdminPage>
  );
}

export function MediaAdmin() {
  const { data, setData, updateItem, notify } = useSite();
  const input = useRef();
  const [deleting, setDeleting] = useState(null);
  const upload = async (files) => {
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const optimized = await optimizeImage(file);
      setData((prev) => ({
        ...prev,
        media: [
          {
            id: crypto.randomUUID(),
            name: file.name.replace(/\.[^.]+$/, ".webp"),
            url: optimized.url,
            variants: optimized.variants,
            width: optimized.width,
            height: optimized.height,
            alt: "",
            rightsVerified: false,
            type: "image",
          },
          ...prev.media,
        ],
      }));
    }
    notify("Imágenes optimizadas a WebP y añadidas a la biblioteca");
  };
  return (
    <AdminPage
      title="Biblioteca de medios"
      subtitle="Imágenes optimizadas automáticamente para reducir peso."
      action={
        <>
          <input
            ref={input}
            hidden
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => upload(e.target.files)}
          />
          <button
            className="button primary small"
            onClick={() => input.current.click()}
          >
            <Upload />
            Subir imágenes
          </button>
        </>
      }
    >
      <div className="media-drop" onClick={() => input.current.click()}>
        <Upload />
        <h3>Suelta imágenes aquí</h3>
        <p>
          Se convertirán a WebP y crearán variantes responsive de 480, 960 y
          1920 px.
        </p>
      </div>
      <div className="media-grid">
        {data.media.map((m) => (
          <article key={m.id}>
            <img
              src={m.url}
              srcSet={
                m.variants?.length
                  ? m.variants
                      .map((variant) => `${variant.url} ${variant.width}w`)
                      .join(", ")
                  : undefined
              }
              sizes="(max-width: 700px) 50vw, 240px"
              alt={m.alt || "Vista previa sin texto alternativo"}
              loading="lazy"
            />
            <div>
              <b>{m.name}</b>
              <small>
                {m.width ? `${m.width} × ${m.height} · ` : ""}
                {m.type}
              </small>
              <input
                aria-label={`Texto alternativo de ${m.name}`}
                value={m.alt || ""}
                onChange={(e) =>
                  updateItem("media", m.id, { alt: e.target.value })
                }
                placeholder="Describe la imagen para accesibilidad"
              />
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(m.rightsVerified)}
                  onChange={(e) =>
                    updateItem("media", m.id, {
                      rightsVerified: e.target.checked,
                    })
                  }
                />{" "}
                Derechos de uso verificados
              </label>
            </div>
            <button className="danger" onClick={() => setDeleting(m)}>
              <Trash2 />
            </button>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar archivo"
        message={`“${deleting?.name || ""}” se eliminará de la biblioteca. Comprueba antes que ninguna página lo esté usando.`}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          setData((prev) => ({
            ...prev,
            media: prev.media.filter((item) => item.id !== deleting.id),
          }));
          notify("Archivo eliminado");
        }}
      />
    </AdminPage>
  );
}

export function SettingsAdmin() {
  const { data, setData, exportData, importData, resetData, notify } =
    useSite();
  const [form, setForm] = useState(data.settings);
  const input = useRef();
  const save = () => {
    setData((prev) => ({ ...prev, settings: form }));
    notify("Ajustes guardados");
  };
  return (
    <AdminPage
      title="Ajustes"
      subtitle="Datos de contacto, identidad y respaldo del contenido."
    >
      <div className="settings-grid">
        <section className="admin-card">
          <CardTitle title="Información general" />
          <TextField
            label="Nombre del sitio"
            value={form.siteName}
            onChange={(siteName) => setForm({ ...form, siteName })}
          />
          <TextField
            label="Propietario"
            value={form.owner}
            onChange={(owner) => setForm({ ...form, owner })}
          />
          <TextField
            label="Eslogan"
            value={form.tagline}
            onChange={(tagline) => setForm({ ...form, tagline })}
          />
          <TextField
            label="Correo"
            value={form.email}
            onChange={(email) => setForm({ ...form, email })}
          />
          <TextField
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(whatsapp) => setForm({ ...form, whatsapp })}
          />
          <TextField
            label="Instagram"
            value={form.instagram}
            onChange={(instagram) => setForm({ ...form, instagram })}
          />
          <TextField
            label="Dominio definitivo"
            value={form.domain || ""}
            onChange={(domain) => setForm({ ...form, domain })}
          />
          <TextField
            label="Imagen social predeterminada"
            value={form.defaultOgImage || ""}
            onChange={(defaultOgImage) => setForm({ ...form, defaultOgImage })}
          />
          <button className="button primary" onClick={save}>
            <Save />
            Guardar ajustes
          </button>
        </section>
        <section className="admin-card">
          <CardTitle title="Datos y respaldo" />
          <p className="settings-copy">
            Exporta todo el contenido antes de cambios importantes o importa un
            respaldo anterior.
          </p>
          <button className="button ghost wide" onClick={exportData}>
            <Download />
            Exportar JSON
          </button>
          <input
            ref={input}
            hidden
            type="file"
            accept="application/json"
            onChange={async (e) => {
              try {
                importData(JSON.parse(await e.target.files[0].text()));
                notify("Respaldo importado");
              } catch {
                notify("El archivo no es válido");
              }
            }}
          />
          <button
            className="button ghost wide"
            onClick={() => input.current.click()}
          >
            <Upload />
            Importar JSON
          </button>
          <button
            className="button danger-button wide"
            onClick={() =>
              confirm("¿Restaurar todo el contenido de ejemplo?") && resetData()
            }
          >
            <Trash2 />
            Restaurar contenido
          </button>
          <div className="integration-note">
            <b>Próxima integración</b>
            <p>
              Supabase Auth, base de datos, Storage, correo transaccional y RLS.
            </p>
          </div>
        </section>
      </div>
    </AdminPage>
  );
}

function AdminPage({ title, subtitle, action, children }) {
  return (
    <main className="admin-page">
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">JEP Designer / Admin</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </main>
  );
}
function CardTitle({ title, link }) {
  return (
    <div className="card-title">
      <h3>{title}</h3>
      {link && (
        <NavLink to={link}>
          Ver todo <ChevronRight />
        </NavLink>
      )}
    </div>
  );
}
function Status({ status }) {
  const labels = {
    new: "Nueva",
    contacted: "Contactada",
    closed: "Cerrada",
    published: "Publicada",
    draft: "Borrador",
  };
  return <span className={`status ${status}`}>{labels[status] || status}</span>;
}
function EmptyState({ title, copy }) {
  return (
    <div className="empty-state">
      <Inbox />
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}
function EditorDrawer({
  title,
  onClose,
  onSave,
  children,
  wide,
  hideSave,
  dirty = false,
  savedAt,
}) {
  const ref = useRef();
  const previous = useRef();
  useEffect(() => {
    previous.current = document.activeElement;
    requestAnimationFrame(() =>
      ref.current?.querySelector("input,textarea,select,button")?.focus(),
    );
    const key = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key !== "Tab") return;
      const nodes = [
        ...ref.current.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[contenteditable="true"]',
        ),
      ];
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous.current?.focus?.();
    };
  }, []);
  return (
    <div
      className="drawer-backdrop editor-workspace-backdrop"
      role="presentation"
    >
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`editor-drawer editor-workspace ${wide ? "wide" : ""}`}
      >
        <header>
          <div className="editor-title">
            <span className="eyebrow">JEP Studio / Editor de contenido</span>
            <h2>{title}</h2>
          </div>
          <div className="editor-header-actions">
            <span className={`editor-status ${dirty ? "dirty" : "saved"}`}>
              {dirty ? <MoreHorizontal /> : <Check />}
              {dirty
                ? "Cambios sin guardar"
                : savedAt
                  ? `Autoguardado ${new Date(savedAt).toLocaleTimeString("es-EC")}`
                  : "Borrador seguro"}
            </span>
            <button aria-label="Cerrar editor" onClick={onClose}>
              <X />
            </button>
          </div>
        </header>
        <div className="drawer-body editor-workspace-body">{children}</div>
        <footer>
          <div>
            <span>
              {dirty
                ? "El borrador se autoguarda; guardar crea una versión recuperable."
                : "Todos los cambios están guardados."}
            </span>
          </div>
          <button className="button ghost" onClick={onClose}>
            Cerrar
          </button>
          {!hideSave && (
            <button className="button primary" onClick={onSave}>
              <Save size={17} />
              Guardar versión
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
function TextField({ label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function RichTextEditor({ label, value, onChange }) {
  const exec = (cmd) => {
    document.execCommand(cmd, false, null);
  };
  return (
    <div className="field rich-field">
      <span>{label}</span>
      <div className="rich-toolbar">
        <button onClick={() => exec("bold")}>
          <b>B</b>
        </button>
        <button onClick={() => exec("italic")}>
          <i>I</i>
        </button>
        <button onClick={() => exec("insertUnorderedList")}>• Lista</button>
      </div>
      <div
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerText)}
      >
        {value}
      </div>
    </div>
  );
}
function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i />
    </label>
  );
}
function ImageField({ label, value, onChange }) {
  return (
    <div className="field image-field">
      <span>{label}</span>
      <img src={value} />
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
async function optimizeImage(file) {
  const bitmap = await createImageBitmap(file);
  const makeVariant = (maximum) => {
    const scale = Math.min(1, maximum / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return {
      url: canvas.toDataURL("image/webp", maximum <= 480 ? 0.76 : 0.82),
      width: canvas.width,
      height: canvas.height,
    };
  };
  const variants = [
    ...new Set(
      [480, 960, 1920]
        .filter((size) => size < bitmap.width)
        .concat(Math.min(bitmap.width, 1920)),
    ),
  ]
    .sort((a, b) => a - b)
    .map(makeVariant);
  bitmap.close?.();
  const largest = variants.at(-1);
  return { ...largest, variants };
}
