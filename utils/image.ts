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
  const { width = 400, height = 400, quality = 70 } = options

  return sharp(toBuffer(input))
    .resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer()
}

export { optimizeImage }
