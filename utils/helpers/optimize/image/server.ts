import sharp from 'sharp'

interface OptimizeImageParams {
  width?: number
  height?: number
  quality?: number
}

export const toBuffer = (input: Buffer | ArrayBuffer): Buffer =>
  Buffer.isBuffer(input) ? input : Buffer.from(input)

export const optimizeImageServer = async (
  input: Buffer | ArrayBuffer,
  options: OptimizeImageParams = {},
) => {
  const { width = 1200, height, quality = 82 } = options

  return sharp(toBuffer(input), { failOn: 'none' })
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
