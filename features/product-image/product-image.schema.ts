import { z } from 'zod'

const imageSchema = z.object({
  id: z.string().nullish(),

  productId: z.string().nullish(),

  url: z.string('กรุณาอัปโหลดรูปภาพสินค้า').min(1, 'กรุณาอัปโหลดรูปภาพสินค้า'),

  alt: z.string('คำอธิบายรูปภาพต้องเป็นข้อความ').nullish(),

  isPrimary: z.boolean('สถานะรูปภาพหลักต้องเป็นจริงหรือเท็จเท่านั้น'),
})

type ImageInput = z.infer<typeof imageSchema>

export { imageSchema }
export type { ImageInput }
