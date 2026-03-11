import sharp from 'sharp'

interface ImageOptimizeOptions {
  width?: number
  height?: number
  quality?: number
}

const DEFAULT_IMAGE_OPTIONS = {
  width: 1200,
  quality: 90,
} as const

const toBuffer = (input: Buffer | ArrayBuffer): Buffer =>
  Buffer.isBuffer(input) ? input : Buffer.from(input)

const ImageOptimizeServer = async (
  input: Buffer | ArrayBuffer,
  options: ImageOptimizeOptions = {},
): Promise<{ buffer: Buffer; format: string }> => {
  const {
    width = DEFAULT_IMAGE_OPTIONS.width,
    height,
    quality = DEFAULT_IMAGE_OPTIONS.quality,
  } = options

  const image = sharp(toBuffer(input), { failOn: 'none' })
  const metadata = await image.metadata()

  const format = metadata.format === 'png' ? 'png' : 'jpeg'

  const pipeline = image
    .resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({
      sigma: 0.5,
      m1: 0,
      m2: 10,
    })

  if (format === 'png') {
    pipeline.png({
      quality,
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
  } else {
    pipeline.jpeg({
      quality,
      progressive: true,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
      trellisQuantisation: true,
      overshootDeringing: true,
      optimizeScans: true,
    })
  }

  const buffer = await pipeline.toBuffer()

  return { buffer, format }
}

export { ImageOptimizeServer }
