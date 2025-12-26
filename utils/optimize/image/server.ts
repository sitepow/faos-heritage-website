import sharp from 'sharp'

interface optimizeImageParams {
  width?: number
  height?: number
  quality?: number
}

export const toBuffer = (input: Buffer | ArrayBuffer): Buffer => {
  return Buffer.isBuffer(input) ? input : Buffer.from(input)
}

export const optimizeImageServer = async (
  input: Buffer | ArrayBuffer,
  options: optimizeImageParams = {},
) => {
  const { width = 800, height, quality = 88 } = options

  return sharp(toBuffer(input))
    .resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({
      quality,
      effort: 4,
      smartSubsample: false,
    })
    .toBuffer()
}
