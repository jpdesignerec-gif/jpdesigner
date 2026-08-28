import { describe, expect, it } from "vitest";
import { dataUrlToFile, optimizeImage } from "../src/utils/images";

describe("herramientas de imágenes", () => {
  it("rechaza archivos que no son imágenes", async () => {
    await expect(optimizeImage(new File(["texto"], "nota.txt", { type: "text/plain" }))).rejects.toThrow("imagen válido");
  });

  it("convierte una variante WebP en un archivo subible", () => {
    const file = dataUrlToFile("data:image/webp;base64,AA==", "Portada.JPG");
    expect(file.name).toBe("Portada.webp");
    expect(file.type).toBe("image/webp");
    expect(file.size).toBe(1);
  });
});
