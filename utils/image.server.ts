import sharp from 'sharp'

const toBuffer = (input: Buffer | ArrayBuffer): Buffer => {
  return Buffer.isBuffer(input) ? input : Buffer.from(input)
}

const ImageOptimizeServer = async (
  input: Buffer | ArrayBuffer,
): Promise<{ buffer: Buffer; format: string }> => {
  const buffer = toBuffer(input)
  const image = sharp(buffer, { failOn: 'none' })
  const metadata = await image.metadata()

  const format = metadata.format || 'jpg'

  return { buffer, format }
}

export { ImageOptimizeServer }
