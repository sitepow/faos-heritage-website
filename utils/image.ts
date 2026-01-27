import sharp from 'sharp'

interface ImageOptimizeOptions {
  width?: number
  height?: number
  quality?: number
}

const DEFAULT_IMAGE_OPTIONS = {
  width: 1200,
  quality: 82,
} as const

const toBuffer = (input: Buffer | ArrayBuffer): Buffer =>
  Buffer.isBuffer(input) ? input : Buffer.from(input)

const ImageOptimizeServer = async (
  input: Buffer | ArrayBuffer,
  options: ImageOptimizeOptions = {},
): Promise<Buffer> => {
  const {
    width = DEFAULT_IMAGE_OPTIONS.width,
    height,
    quality = DEFAULT_IMAGE_OPTIONS.quality,
  } = options

  return await sharp(toBuffer(input), { failOn: 'none' })
    .resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({
      quality,
      effort: 6,
      nearLossless: true,
      smartSubsample: false,
    })
    .toBuffer()
}

export { ImageOptimizeServer }
export type { ImageOptimizeOptions }
