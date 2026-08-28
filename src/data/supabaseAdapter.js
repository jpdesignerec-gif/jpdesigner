import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

const tables = {
  pages: "pages",
  categories: "portfolio_categories",
  projects: "projects",
  services: "services",
  plans: "plans",
  testimonials: "testimonials",
  faqs: "faqs",
  inquiries: "inquiries",
  media: "media",
  trash: "content_trash",
  versions: "content_versions",
};

const editorial = (item) => ({
  status: item.status || (item.published === false ? "draft" : "published"),
  published: item.status ? item.status === "published" : item.published !== false,
  publish_at: item.publishAt || null,
  content_verified: Boolean(item.contentVerified),
  sort_order: Number(item.order || 0),
});

const commonFrom = (row) => ({
  status: row.status,
  published: row.published,
  publishAt: row.publish_at,
  contentVerified: row.content_verified,
  order: row.sort_order,
  updatedAt: row.updated_at,
});

export function serializeItem(collection, item) {
  switch (collection) {
    case "pages":
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        eyebrow: item.eyebrow || null,
        headline: item.headline || null,
        intro: item.intro || null,
        body: item.body || [],
        blocks: item.blocks || [],
        seo: item.seo || {},
        ...editorial(item),
      };
    case "categories":
      return {
        id: item.id,
        parent_id: item.parentId || null,
        name: item.name,
        slug: item.slug,
        description: item.description || null,
        status: item.status || "published",
        sort_order: Number(item.order || 0),
      };
    case "projects":
      return {
        id: item.id,
        category_id: item.categoryId || null,
        title: item.title,
        slug: item.slug,
        summary: item.summary || null,
        body: item.body || null,
        blocks: item.blocks || [],
        cover_url: item.cover || null,
        gallery: item.gallery || [],
        video_url: item.videoUrl || null,
        tags: item.tags || [],
        services: item.services || [],
        client: item.client || null,
        project_year: item.year ? String(item.year) : null,
        featured: Boolean(item.featured),
        seo: item.seo || {},
        rights_verified: Boolean(item.rightsVerified),
        ...editorial(item),
      };
    case "services":
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        summary: item.summary || null,
        ideal_for: item.idealFor || null,
        base_price: item.basePrice ?? null,
        price_label: item.priceLabel || null,
        delivery_time: item.delivery || null,
        requirements: item.requirements || [],
        deliverables: item.deliverables || [],
        questions: item.questions || [],
        seo: item.seo || {},
        ...editorial(item),
      };
    case "plans":
      return {
        id: item.id,
        name: item.name,
        eyebrow: item.eyebrow || null,
        price: item.price ?? null,
        description: item.description || null,
        ideal_for: item.idealFor || null,
        delivery_time: item.delivery || null,
        revisions: item.revisions || null,
        features: item.features || [],
        formats: item.formats || [],
        not_included: item.notIncluded || [],
        featured: Boolean(item.featured),
        seo: item.seo || {},
        ...editorial(item),
      };
    case "testimonials":
      return {
        id: item.id,
        name: item.name,
        role: item.role || null,
        company: item.company || null,
        quote: item.quote,
        rating: Number(item.rating || 5),
        rights_verified: Boolean(item.rightsVerified),
        ...editorial(item),
      };
    case "faqs":
      return {
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category || "general",
        ...editorial(item),
      };
    case "inquiries":
      return {
        id: item.id,
        service_id: item.serviceId || null,
        service_name: item.serviceName || null,
        plan_id: item.planId || null,
        contact: item.contact || {},
        answers: item.answers || {},
        files: item.files || [],
        internal_notes: item.internalNotes || "",
        status: item.status || "new",
        created_at: item.createdAt || new Date().toISOString(),
      };
    case "versions":
      return {
        id: item.id,
        collection_name: item.collection,
        item_id: item.itemId,
        label: item.label || null,
        snapshot: item.snapshot,
        created_at: item.createdAt || new Date().toISOString(),
      };
    case "trash":
      return {
        id: item.id,
        collection_name: item.collection,
        item_id: item.itemId,
        snapshot: item.item,
        deleted_at: item.deletedAt || new Date().toISOString(),
      };
    case "media":
      return {
        id: item.id,
        name: item.name,
        storage_path: item.storagePath || `legacy/${item.id}`,
        public_url: item.url || null,
        mime_type: item.mimeType || "image/webp",
        alt_text: item.alt || "",
        rights_owner: item.rights || null,
        rights_verified: Boolean(item.rightsVerified),
        variants: item.variants || [],
      };
    default:
      throw new Error(`Colección no compatible: ${collection}`);
  }
}

export function deserializeItem(collection, row) {
  switch (collection) {
    case "pages":
      return { id: row.id, slug: row.slug, title: row.title, eyebrow: row.eyebrow, headline: row.headline, intro: row.intro, body: row.body, blocks: row.blocks || [], seo: row.seo || {}, ...commonFrom(row) };
    case "categories":
      return { id: row.id, parentId: row.parent_id, name: row.name, slug: row.slug, description: row.description, status: row.status, order: row.sort_order };
    case "projects":
      return { id: row.id, categoryId: row.category_id, title: row.title, slug: row.slug, summary: row.summary, body: row.body, blocks: row.blocks || [], cover: row.cover_url, gallery: row.gallery || [], videoUrl: row.video_url, tags: row.tags || [], services: row.services || [], client: row.client, year: row.project_year, featured: row.featured, seo: row.seo || {}, rightsVerified: row.rights_verified, ...commonFrom(row) };
    case "services":
      return { id: row.id, name: row.name, slug: row.slug, summary: row.summary, idealFor: row.ideal_for, basePrice: Number(row.base_price || 0), priceLabel: row.price_label, delivery: row.delivery_time, requirements: row.requirements || [], deliverables: row.deliverables || [], questions: row.questions || [], seo: row.seo || {}, ...commonFrom(row) };
    case "plans":
      return { id: row.id, name: row.name, eyebrow: row.eyebrow, price: Number(row.price || 0), description: row.description, idealFor: row.ideal_for, delivery: row.delivery_time, revisions: row.revisions, features: row.features || [], formats: row.formats || [], notIncluded: row.not_included || [], featured: row.featured, seo: row.seo || {}, ...commonFrom(row) };
    case "testimonials":
      return { id: row.id, name: row.name, role: row.role, company: row.company, quote: row.quote, rating: row.rating, rightsVerified: row.rights_verified, ...commonFrom(row) };
    case "faqs":
      return { id: row.id, question: row.question, answer: row.answer, category: row.category, ...commonFrom(row) };
    case "inquiries":
      return { id: row.id, serviceId: row.service_id, serviceName: row.service_name, planId: row.plan_id, contact: row.contact || {}, answers: row.answers || {}, files: row.files || [], internalNotes: row.internal_notes || "", status: row.status, createdAt: row.created_at, updatedAt: row.updated_at };
    case "versions":
      return { id: row.id, collection: row.collection_name, itemId: row.item_id, label: row.label, snapshot: row.snapshot, createdAt: row.created_at };
    case "trash":
      return { id: row.id, collection: row.collection_name, itemId: row.item_id, item: row.snapshot, deletedAt: row.deleted_at };
    case "media":
      return { id: row.id, name: row.name, storagePath: row.storage_path, url: row.public_url, mimeType: row.mime_type, type: row.mime_type?.startsWith("image/") ? "image" : "file", alt: row.alt_text, rights: row.rights_owner, rightsVerified: row.rights_verified, variants: row.variants || [] };
    default:
      return row;
  }
}

export async function loadRemoteData({ admin = false } = {}) {
  if (!isSupabaseConfigured) return null;
  const publicCollections = ["pages", "categories", "projects", "services", "plans", "testimonials", "faqs", "media"];
  const collections = admin ? [...publicCollections, "inquiries", "trash", "versions"] : publicCollections;
  const results = await Promise.all(
    collections.map(async (collection) => {
      const orderColumn = ["inquiries", "trash", "versions", "media"].includes(collection) ? null : "sort_order";
      let query = supabase.from(tables[collection]).select("*");
      if (orderColumn) query = query.order(orderColumn, { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      return [collection, data.map((row) => deserializeItem(collection, row))];
    }),
  );
  const { data: settingsRows, error: settingsError } = await supabase
    .from("site_settings")
    .select("key, value");
  if (settingsError) throw settingsError;
  const settings = (settingsRows || []).find((row) => row.key === "site")?.value || {};
  return { ...Object.fromEntries(results), settings };
}

export async function upsertRemoteItem(collection, item) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from(tables[collection]).upsert(serializeItem(collection, item));
  if (error) throw error;
}

export async function deleteRemoteItem(collection, id) {
  if (!isSupabaseConfigured) return;
  let storagePath = null;
  if (collection === "media") {
    const { data } = await supabase.from("media").select("storage_path").eq("id", id).maybeSingle();
    storagePath = data?.storage_path;
  }
  const { error } = await supabase.from(tables[collection]).delete().eq("id", id);
  if (error) throw error;
  if (collection === "media" && storagePath && !storagePath.startsWith("legacy/")) {
    const { error: storageError } = await supabase.storage.from("jep-media").remove([storagePath]);
    if (storageError) throw storageError;
  }
}

export async function saveRemoteSettings(settings) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "site", value: settings });
  if (error) throw error;
}

export async function submitRemoteInquiry(inquiry) {
  if (!isSupabaseConfigured) return null;
  const uploadedFiles = [];
  for (const file of inquiry.files || []) {
    if (typeof File === "undefined" || !(file instanceof File)) {
      uploadedFiles.push(file);
      continue;
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120);
    const path = `incoming/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("jep-inquiry-files")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    uploadedFiles.push({ path, name: file.name, type: file.type, size: file.size });
  }
  const { data, error } = await supabase.rpc("create_inquiry", {
    p_service_id: inquiry.serviceId || null,
    p_service_name: inquiry.serviceName || "Contacto general",
    p_plan_id: inquiry.planId || null,
    p_contact: inquiry.contact,
    p_answers: inquiry.answers || {},
    p_files: uploadedFiles,
  });
  if (error) throw error;
  return data ? deserializeItem("inquiries", data) : null;
}

export async function uploadRemoteMedia(file, metadata = {}) {
  if (!isSupabaseConfigured) throw new Error("Supabase no está configurado");
  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `site/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("jep-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("jep-media").getPublicUrl(path);
  const item = {
    id: crypto.randomUUID(),
    name: metadata.name || file.name,
    storagePath: path,
    url: data.publicUrl,
    mimeType: file.type,
    type: file.type.startsWith("image/") ? "image" : "file",
    alt: metadata.alt || "",
    rightsVerified: Boolean(metadata.rightsVerified),
    variants: [],
  };
  await upsertRemoteItem("media", item);
  return item;
}

export async function getSignedInquiryFile(path) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.storage
    .from("jep-inquiry-files")
    .createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}
