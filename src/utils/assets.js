export function assetUrl(value) {
  if (!value || typeof value !== "string") return value;
  // Assets are real files, so they must never be placed after the hash used
  // by HashRouter (e.g. `/#/assets/foo.jpg`). Hash fragments are not sent in
  // the HTTP request and make every local image look like a broken image.
  const hashPath = value.startsWith("/") && value.includes("#")
    ? value.slice(value.indexOf("#") + 1)
    : value;
  const normalizedPath = hashPath.startsWith("/") ? hashPath : `/${hashPath}`;
  const isAsset = normalizedPath.startsWith("/assets/") || normalizedPath === "/favicon.svg";
  if (!isAsset) return value;
  const base = import.meta.env.BASE_URL || "/";
  const assetPath = normalizedPath.slice(1);
  return `${base.replace(/\/$/, "")}/${assetPath}`;
}

export function appUrl(value) {
  if (!value || typeof value !== "string" || !value.startsWith("/")) return value;
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || value.startsWith(base)) return value;
  return `${base.replace(/\/$/, "")}${value}`;
}
