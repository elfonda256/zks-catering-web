/**
 * Transfer proof photos. The browser shrinks every photo before upload so the database stays
 * small (proofs are stored inline); the server only accepts results under MAX_PROOF_BYTES, which
 * a shrunk photo never reaches.
 */

/** Largest proof the server stores. A shrunk bank screenshot is usually 150–400 KB. */
export const MAX_PROOF_BYTES = 1.5 * 1024 * 1024;

export const PROOF_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Long side in pixels: keeps the small print of an m-banking receipt legible. */
const MAX_DIMENSION = 1800;
const JPEG_QUALITY = 0.72;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak bisa dibaca."));
    };
    img.src = url;
  });
}

/**
 * Scales the photo down to MAX_DIMENSION and re-encodes it as JPEG. Browser only.
 * Returns the original file when that is already smaller, or when the browser cannot decode it.
 */
export async function compressProofImage(file: File): Promise<File> {
  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  // JPEG has no transparency: paint PNG screenshots onto white instead of black.
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}
