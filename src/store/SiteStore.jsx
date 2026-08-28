import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedData } from "../data/seed";

const STORAGE_KEY = "jep-site-data-v2";
const SiteContext = createContext(null);
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL?.trim() &&
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
);
const remoteCall = async (method, ...args) => {
  const adapter = await import("../data/supabaseAdapter");
  return adapter[method](...args);
};

const collectionKeys = ["pages", "categories", "projects", "services", "plans", "testimonials", "faqs", "inquiries", "media", "trash", "versions"];
const editorialCollections = ["pages", "projects", "services", "plans", "testimonials", "faqs"];
const localizeInquiry = (inquiry) => ({
  ...inquiry,
  files: (inquiry.files || []).map((file) => {
    const isFile = typeof File !== "undefined" && file instanceof File;
    return isFile ? { name: file.name, type: file.type, size: file.size, lastModified: file.lastModified } : file;
  }),
});

function normalizeData(input = {}) {
  const normalized = { ...seedData, ...input, settings: { ...seedData.settings, ...(input.settings || {}) } };
  collectionKeys.forEach((key) => {
    normalized[key] = Array.isArray(input[key]) ? input[key] : seedData[key] || [];
  });
  normalized.pages = seedData.pages.map((defaultPage) => {
    const saved = normalized.pages.find((page) => page.id === defaultPage.id);
    if (!saved) return defaultPage;
    return { ...defaultPage, ...saved, blocks: Array.isArray(saved.blocks) && saved.blocks.length ? saved.blocks : defaultPage.blocks };
  });
  normalized.projects = normalized.projects.map((project) => ({ ...project, tags: Array.isArray(project.tags) ? project.tags : [], services: Array.isArray(project.services) ? project.services : [], gallery: Array.isArray(project.gallery) ? project.gallery : [], blocks: Array.isArray(project.blocks) ? project.blocks : [] }));
  editorialCollections.forEach((collection) => {
    normalized[collection] = (normalized[collection] || []).map((item) => ({
      ...item,
      status: item.status || (item.published === false ? "draft" : "published"),
      published: item.status ? item.status === "published" : item.published !== false,
      publishAt: item.publishAt || null,
      updatedAt: item.updatedAt || new Date().toISOString(),
      seo: { title: item.seo?.title || "", description: item.seo?.description || "", image: item.seo?.image || "", noIndex: Boolean(item.seo?.noIndex) },
      contentVerified: Boolean(item.contentVerified),
      rightsVerified: Boolean(item.rightsVerified),
    }));
  });
  normalized.schemaVersion = seedData.schemaVersion;
  delete normalized.settings.adminCode;
  return normalized;
}

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return normalizeData(seedData);
    const version = stored.schemaVersion || 0;
    let migrated = { ...stored };
    if (version < 3) migrated = { ...migrated, services: seedData.services, plans: seedData.plans };
    if (version < 4) migrated = { ...migrated, testimonials: seedData.testimonials, faqs: seedData.faqs };
    if (version < 5) migrated = { ...migrated, pages: (migrated.pages || []).map((page) => ({ ...page, blocks: page.blocks || seedData.pages.find((x) => x.id === page.id)?.blocks || [] })), projects: (migrated.projects || []).map((project) => ({ ...project, blocks: project.blocks || seedData.projects.find((x) => x.id === project.id)?.blocks || [] })) };
    if (version < 6) migrated = { ...migrated, pages: (migrated.pages || []).map((page) => page.id === "home" && !page.blocks?.length ? { ...page, blocks: seedData.pages.find((x) => x.id === "home").blocks } : page) };
    return normalizeData(migrated);
  } catch {
    return normalizeData(seedData);
  }
}

function mergeRemoteData(current, remote, admin) {
  if (!remote) return current;
  const next = { ...current, settings: { ...current.settings, ...(remote.settings || {}) } };
  const remoteCollections = admin ? collectionKeys : collectionKeys.filter((key) => !["inquiries", "trash", "versions"].includes(key));
  remoteCollections.forEach((key) => {
    if (!Array.isArray(remote[key])) return;
    next[key] = remote[key];
  });
  return normalizeData(next);
}

export function SiteProvider({ children }) {
  const [data, setData] = useState(loadData);
  const [theme, setTheme] = useState(() => localStorage.getItem("jep-theme") || data.settings.theme || "dark");
  const [notifications, setNotifications] = useState([]);
  const [remoteStatus, setRemoteStatus] = useState({ configured: isSupabaseConfigured, loading: isSupabaseConfigured, connected: false, error: "" });

  const notify = (input, type = "success") => {
    const item = typeof input === "string" ? { message: input, type } : { ...input, type: input.type || type };
    const notification = { id: crypto.randomUUID(), title: item.title || ({ success: "Listo", error: "Ocurrió un problema", warning: "Atención", info: "Información" }[item.type] || "Listo"), ...item };
    setNotifications((prev) => [...prev.slice(-3), notification]);
    setTimeout(() => setNotifications((prev) => prev.filter((x) => x.id !== notification.id)), 4200);
  };

  const reportRemoteError = (error) => {
    console.error("Supabase sync error", error);
    setRemoteStatus((current) => ({ ...current, loading: false, error: error?.message || "No se pudo sincronizar" }));
    notify({ message: "El cambio quedó guardado en este navegador, pero no se sincronizó con Supabase.", type: "warning" });
  };

  const refreshRemote = async () => {
    if (!isSupabaseConfigured) return;
    setRemoteStatus((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [{ getAdminSession }, { loadRemoteData }] = await Promise.all([
        import("../lib/supabase"),
        import("../data/supabaseAdapter"),
      ]);
      const { isAdmin } = await getAdminSession();
      const remote = await loadRemoteData({ admin: isAdmin });
      setData((current) => mergeRemoteData(current, remote, isAdmin));
      setRemoteStatus({ configured: true, loading: false, connected: true, error: "" });
    } catch (error) {
      console.error("Supabase load error", error);
      setRemoteStatus({ configured: true, loading: false, connected: false, error: error?.message || "No se pudo conectar" });
    }
  };

  useEffect(() => {
    let unsubscribe;
    const start = async () => {
      await refreshRemote();
      if (!isSupabaseConfigured) return;
      const { supabase } = await import("../lib/supabase");
      const { data: listener } = supabase.auth.onAuthStateChange(() => setTimeout(refreshRemote, 0));
      unsubscribe = () => listener.subscription.unsubscribe();
    };
    const timer = setTimeout(start, 0);
    return () => {
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("jep-theme", theme);
  }, [theme]);

  const api = useMemo(() => ({
    data, setData, theme, setTheme, remoteStatus, refreshRemote,
    toast: notifications[0]?.message || "", notifications, notify,
    dismissNotification: (id) => setNotifications((prev) => prev.filter((x) => x.id !== id)),
    updateItem(collection, id, patch) {
      const current = data[collection].find((item) => item.id === id);
      const next = current ? { ...current, ...patch } : null;
      setData((prev) => ({ ...prev, [collection]: prev[collection].map((item) => item.id === id ? { ...item, ...patch } : item) }));
      if (next) remoteCall("upsertRemoteItem", collection, next).catch(reportRemoteError);
    },
    saveEditorial(collection, id, next, { label = "Guardado manual", version = true } = {}) {
      const current = data[collection].find((item) => item.id === id);
      const now = new Date().toISOString();
      const snapshot = version && current ? { id: crypto.randomUUID(), collection, itemId: id, label, createdAt: now, snapshot: current } : null;
      const item = { ...next, id, updatedAt: now, published: next.status ? next.status === "published" : next.published !== false };
      setData((prev) => ({ ...prev, [collection]: prev[collection].map((entry) => entry.id === id ? item : entry), versions: snapshot ? [snapshot, ...(prev.versions || [])].slice(0, 250) : (prev.versions || []) }));
      remoteCall("upsertRemoteItem", collection, item).catch(reportRemoteError);
      if (snapshot) remoteCall("upsertRemoteItem", "versions", snapshot).catch(reportRemoteError);
    },
    autosaveItem(collection, id, patch) {
      setData((prev) => ({ ...prev, [collection]: prev[collection].map((item) => item.id === id ? { ...item, ...patch, autosavedAt: new Date().toISOString() } : item) }));
    },
    duplicateItem(collection, id) {
      const source = data[collection].find((item) => item.id === id);
      if (!source) return null;
      const copy = { ...structuredClone(source), id: crypto.randomUUID(), title: source.title ? `${source.title} — copia` : undefined, name: source.name ? `${source.name} — copia` : undefined, slug: source.slug ? `${source.slug}-copia-${Date.now().toString().slice(-4)}` : source.slug, status: "draft", published: false, publishAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setData((prev) => ({ ...prev, [collection]: [copy, ...prev[collection]] }));
      remoteCall("upsertRemoteItem", collection, copy).catch(reportRemoteError);
      return copy;
    },
    trashItem(collection, id) {
      const item = data[collection].find((entry) => entry.id === id);
      if (!item) return;
      const record = { id: crypto.randomUUID(), collection, itemId: id, deletedAt: new Date().toISOString(), item };
      setData((prev) => ({ ...prev, [collection]: prev[collection].filter((entry) => entry.id !== id), trash: [record, ...(prev.trash || [])] }));
      remoteCall("upsertRemoteItem", "trash", record).then(() => remoteCall("deleteRemoteItem", collection, id)).catch(reportRemoteError);
    },
    restoreTrash(trashId) {
      const record = (data.trash || []).find((entry) => entry.id === trashId);
      if (!record) return;
      setData((prev) => ({ ...prev, [record.collection]: [record.item, ...(prev[record.collection] || [])], trash: prev.trash.filter((entry) => entry.id !== trashId) }));
      remoteCall("upsertRemoteItem", record.collection, record.item).then(() => remoteCall("deleteRemoteItem", "trash", trashId)).catch(reportRemoteError);
    },
    permanentlyDelete(trashId) {
      setData((prev) => ({ ...prev, trash: (prev.trash || []).filter((entry) => entry.id !== trashId) }));
      remoteCall("deleteRemoteItem", "trash", trashId).catch(reportRemoteError);
    },
    restoreVersion(versionId) {
      const version = (data.versions || []).find((entry) => entry.id === versionId);
      if (!version) return;
      const current = data[version.collection].find((item) => item.id === version.itemId);
      const now = new Date().toISOString();
      const safety = { id: crypto.randomUUID(), collection: version.collection, itemId: version.itemId, label: "Antes de restaurar", createdAt: now, snapshot: current };
      const restored = { ...version.snapshot, updatedAt: now };
      setData((prev) => ({ ...prev, [version.collection]: prev[version.collection].map((item) => item.id === version.itemId ? restored : item), versions: [safety, ...prev.versions] }));
      Promise.all([remoteCall("upsertRemoteItem", version.collection, restored), remoteCall("upsertRemoteItem", "versions", safety)]).catch(reportRemoteError);
    },
    addItem(collection, item) {
      setData((prev) => ({ ...prev, [collection]: [...prev[collection], item] }));
      remoteCall("upsertRemoteItem", collection, item).catch(reportRemoteError);
    },
    removeItem(collection, id) {
      setData((prev) => ({ ...prev, [collection]: prev[collection].filter((item) => item.id !== id) }));
      remoteCall("deleteRemoteItem", collection, id).catch(reportRemoteError);
    },
    reorderItem(collection, id, direction) {
      const items = [...data[collection]];
      const index = items.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
      [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
      const ordered = items.map((item, order) => ({ ...item, order: order + 1 }));
      setData((prev) => ({ ...prev, [collection]: ordered }));
      Promise.all(ordered.map((item) => remoteCall("upsertRemoteItem", collection, item))).catch(reportRemoteError);
    },
    async submitInquiry(inquiry) {
      setData((prev) => ({ ...prev, inquiries: [localizeInquiry(inquiry), ...prev.inquiries] }));
      try {
        const remote = await remoteCall("submitRemoteInquiry", inquiry);
        if (remote) setData((prev) => ({ ...prev, inquiries: prev.inquiries.map((item) => item.id === inquiry.id ? remote : item) }));
        return true;
      } catch (error) {
        reportRemoteError(error);
        return false;
      }
    },
    async uploadMedia(file, metadata) {
      try {
        const item = await remoteCall("uploadRemoteMedia", file, metadata);
        setData((prev) => ({ ...prev, media: [item, ...prev.media] }));
        return item;
      } catch (error) {
        reportRemoteError(error);
        throw error;
      }
    },
    async openInquiryFile(file) {
      try {
        const url = await remoteCall("getSignedInquiryFile", file.path);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      } catch (error) {
        reportRemoteError(error);
      }
    },
    saveSettings(settings) {
      setData((prev) => ({ ...prev, settings }));
      remoteCall("saveRemoteSettings", settings).catch(reportRemoteError);
    },
    resetData() { setData(normalizeData(seedData)); },
    importData(next) { setData(normalizeData(next)); },
    exportData() {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "jep-designer-backup.json";
      link.click();
      URL.revokeObjectURL(url);
    },
  }), [data, theme, notifications, remoteStatus]);

  return <SiteContext.Provider value={api}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
