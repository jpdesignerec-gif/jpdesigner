export function assetUrl(value) {
  if (!value || typeof value !== "string") return value;
  if (!value.startsWith("/assets/") && value !== "/favicon.svg") return value;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}${value}`;
}

export function appUrl(value) {
  if (!value || typeof value !== "string" || !value.startsWith("/")) return value;
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || value.startsWith(base)) return value;
  return `${base.replace(/\/$/, "")}${value}`;
}
