import sharp from 'sharp'

interface Params {
  width?: number
  height?: number
  quality?: number
}

const toBuffer = (input: Buffer | ArrayBuffer): Buffer => {
  return Buffer.isBuffer(input) ? input : Buffer.from(input)
}

const optimizeImage = async (
  input: Buffer | ArrayBuffer,
  options: Params = {},
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

export { optimizeImage }
