export interface ImageSize {
  width: number
  height: number
}

/** Limita o maior lado a `max`, preservando a proporção. */
export function targetSize(width: number, height: number, max = 1600): ImageSize {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 0, height: 0 }
  }
  const scale = Math.min(1, max / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/** Comprime no navegador para WebP; o bucket aceita no máximo 5 MB. */
export async function compressImage(file: File, max = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  try {
    const size = targetSize(bitmap.width, bitmap.height, max)
    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Não foi possível processar a imagem neste navegador.')
    context.drawImage(bitmap, 0, 0, size.width, size.height)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    if (!blob) throw new Error('Não foi possível comprimir a imagem.')
    return blob
  } finally {
    bitmap.close()
  }
}
