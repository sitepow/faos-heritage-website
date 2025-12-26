export const optimizeImageClient = async (
  file: File,
  options?: {
    maxWidth?: number
    quality?: number
  },
): Promise<File> => {
  const { maxWidth = 800, quality = 0.85 } = options || {}

  const bitmap = await createImageBitmap(file)

  const scale = Math.min(maxWidth / bitmap.width, 1)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/webp', quality),
  )

  return new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
    type: 'image/webp',
  })
}
