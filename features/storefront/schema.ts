import { z } from 'zod'

const storefrontSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'กรุณาระบุชื่อหน้าร้าน'),
  description: z.string().nullable().optional().or(z.literal('')),
  image: z.string().nullable().optional().or(z.literal('')),

  phone: z.string().nullable().optional().or(z.literal('')),

  address: z.string().min(1, 'กรุณาระบุที่อยู่'),
  googleMapUrl: z.string().nullable().optional().or(z.literal('')),

  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),

  businessHours: z.any().nullable().optional(),

  isActive: z.boolean().default(true),
  isMain: z.boolean().default(false),

  managerIds: z.array(z.string()).default([]),
})

type StorefrontInput = z.infer<typeof storefrontSchema>

export { storefrontSchema }
export type { StorefrontInput }
