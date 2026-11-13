/** Aguarda as imagens da folha decodificarem antes de abrir a impressão. */
export async function printPage(): Promise<void> {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('.a4 img'))
  await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
  window.print()
}
