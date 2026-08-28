import { writeFile } from "node:fs/promises";
import { seedData } from "../src/data/seed.js";

const base = (process.env.SITE_URL || seedData.settings.domain || "https://jepdesigner.ec").replace(/\/$/, "");
const staticRoutes = ["/", "/portfolio", "/servicios", "/planes", "/contacto", "/privacidad", "/terminos", "/cookies"];
const dynamicRoutes = [
  ...seedData.categories.map(item => `/portfolio/categoria/${item.slug}`),
  ...seedData.projects.filter(item => item.published !== false).map(item => `/portfolio/${item.slug}`),
  ...seedData.services.filter(item => item.published !== false).map(item => `/servicios/${item.slug}`),
];
const routes = [...new Set([...staticRoutes, ...dynamicRoutes])];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${base}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(`Sitemap generado: ${routes.length} URLs para ${base}`);
