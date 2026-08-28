import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { seedData } from "../src/data/seed.js";
import { serializeItem } from "../src/data/supabaseAdapter.js";

const target = fileURLToPath(new URL("../supabase/migrations/0004_seed_content.sql", import.meta.url));
const collections = ["categories", "pages", "services", "plans", "projects", "testimonials", "faqs", "media"];
const tableNames = { categories: "portfolio_categories" };

function recordStatement(collection, item) {
  const table = tableNames[collection] || collection;
  const row = serializeItem(collection, item);
  const columns = Object.keys(row);
  const updates = columns.filter((column) => column !== "id").map((column) => `${column} = excluded.${column}`).join(", ");
  const json = JSON.stringify(row).replaceAll("$jep$", "$ jep $");
  return `insert into public.${table} (${columns.join(", ")})\nselect ${columns.map((column) => `x.${column}`).join(", ")}\nfrom jsonb_populate_record(null::public.${table}, $jep$${json}$jep$::jsonb) as x\non conflict (id) do update set ${updates};`;
}

const statements = [
  "-- Contenido inicial generado desde src/data/seed.js. No editar manualmente.",
  "-- Regenerar con: npm run db:seed-migration",
  ...collections.flatMap((collection) => seedData[collection].map((item) => recordStatement(collection, item))),
  `insert into public.site_settings (key, value)\nvalues ('site', $jep$${JSON.stringify(seedData.settings)}$jep$::jsonb)\non conflict (key) do update set value = excluded.value;`,
  "",
];

writeFileSync(target, statements.join("\n\n"), "utf8");
console.log(`Migración de contenido generada: ${target}`);
