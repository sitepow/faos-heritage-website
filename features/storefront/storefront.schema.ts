import { z } from 'zod'

const storefrontSchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อหน้าร้าน'),
  description: z.string().optional(),
  image: z.string().url('รูปแบบ URL ไม่ถูกต้อง').optional().or(z.literal('')),
  phone: z.string().min(1, 'กรุณาระบุเบอร์โทรศัพท์'),
  address: z.string().min(1, 'กรุณาระบุที่อยู่'),
  googleMapUrl: z
    .string()
    .url('รูปแบบ URL ไม่ถูกต้อง')
    .optional()
    .or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  businessHours: z.any().optional(),
  isActive: z.boolean().default(true),
})

type StorefrontInput = z.infer<typeof storefrontSchema>

export { storefrontSchema }
export type { StorefrontInput }
