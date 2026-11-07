/** Side of the stored square picture: sharp on retina at the largest size shown (128 px). */
export const AVATAR_SIDE = 512;

export interface SquareCrop {
  sx: number;
  sy: number;
  side: number;
}

/** The largest centred square inside an image, so faces in the middle survive the crop. */
export function centerSquare(width: number, height: number): SquareCrop {
  const side = Math.min(width, height);
  return { sx: Math.round((width - side) / 2), sy: Math.round((height - side) / 2), side };
}

/**
 * Crops a picture to a centred square and re-encodes it at AVATAR_SIDE px, so a 6 MB phone photo
 * uploads as a few dozen KB. Browser only. WebP where the browser can encode it, else JPEG.
 */
export async function resizeForAvatar(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const { sx, sy, side } = centerSquare(bitmap.width, bitmap.height);
    const target = Math.min(AVATAR_SIDE, side);
    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not available");
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, sx, sy, side, side, 0, 0, target, target);

    const webp = await toBlob(canvas, "image/webp", 0.85);
    if (webp?.type === "image/webp") {
      return webp;
    }
    const jpeg = await toBlob(canvas, "image/jpeg", 0.88);
    if (!jpeg) {
      throw new Error("The picture could not be encoded");
    }
    return jpeg;
  } finally {
    bitmap.close();
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}
