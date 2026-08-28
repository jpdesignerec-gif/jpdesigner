import { expect, test } from "@playwright/test";
const routes = [
  "/",
  "/portfolio",
  "/servicios",
  "/planes",
  "/contacto",
  "/privacidad",
  "/terminos",
  "/cookies",
];
test("las rutas públicas cargan sin errores visibles", async ({ page }) => {
  test.setTimeout(60000);
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator(".app-error")).toHaveCount(0);
  }
});
test("el panel optimiza y guarda una imagen subida", async ({ page }) => {
  await page.goto("/admin/acceso");
  await page.getByLabel("Código de acceso").fill("demo2026");
  await page.getByRole("button", { name: /Entrar al panel/i }).click();
  await page.goto("/admin/medios");
  await page.locator("input[type=file]").setInputFiles("public/assets/portada.jpg");
  await expect(page.getByText(/optimizada.*biblioteca/i)).toBeVisible();
  const image = page.locator(".media-grid article img").last();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", /^data:image\/webp/);
});
test("portfolio filtra con URL de categoría", async ({ page }) => {
  await page.goto("/portfolio");
  await page.getByRole("button", { name: "Branding", exact: true }).click();
  await expect(page).toHaveURL(/portfolio\/categoria\/branding/);
  await expect(page.locator(".project-card")).toHaveCount(1);
});
test("móvil no produce desbordamiento horizontal", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "solo proyecto móvil");
  await page.goto("/");
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width + 1);
});
test("administración exige acceso", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/admin\/acceso/);
  await expect(page.getByText(/Gestiona tu sitio/i)).toBeVisible();
});
test("sesión administrativa de desarrollo y constructor de bloques", async ({
  page,
}) => {
  await page.goto("/admin/acceso");
  await page.getByLabel("Código de acceso").fill("demo2026");
  await page.getByRole("button", { name: /Entrar al panel/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/paginas");
  await page.getByTitle("Editar").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Añadir bloque/i }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: /Cerrar editor/i }).click();
});
test("tema y menú contextual funcionan con teclado y ratón", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Cambiar tema/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .locator("body")
    .click({ button: "right", position: { x: 180, y: 180 } });
  await expect(
    page.getByRole("menu", { name: /Acciones rápidas/i }),
  ).toBeVisible();
});
