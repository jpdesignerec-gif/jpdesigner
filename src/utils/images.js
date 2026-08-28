const DEFAULT_WIDTHS = [480, 960, 1920];

function loadBitmap(file) {
  if (typeof createImageBitmap === "function") return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    image.src = url;
  });
}

export async function optimizeImage(file, widths = DEFAULT_WIDTHS) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido");
  }
  const bitmap = await loadBitmap(file);
  const sourceWidth = bitmap.width || bitmap.naturalWidth;
  const sourceHeight = bitmap.height || bitmap.naturalHeight;
  if (!sourceWidth || !sourceHeight) throw new Error("La imagen no tiene dimensiones válidas");
  const makeVariant = (maximum) => {
    const scale = Math.min(1, maximum / sourceWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = canvas.getContext("2d", { alpha: true });
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return {
      url: canvas.toDataURL("image/webp", maximum <= 480 ? 0.76 : 0.82),
      width: canvas.width,
      height: canvas.height,
    };
  };
  const sizes = [...new Set([...widths.filter((size) => size < sourceWidth), Math.min(sourceWidth, Math.max(...widths))])].sort((a, b) => a - b);
  const variants = sizes.map(makeVariant);
  bitmap.close?.();
  return { ...variants.at(-1), variants };
}

export function dataUrlToFile(dataUrl, name = "imagen.webp") {
  const [header, body] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] || "image/webp";
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new File([bytes], name.replace(/\.[^.]+$/, ".webp"), { type: mime });
}
