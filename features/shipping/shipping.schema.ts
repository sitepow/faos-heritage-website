import { Currency } from '@prisma/client'
import { z } from 'zod'

const shippingWeightTierSchema = z.object({
  id: z.string().optional(),
  minWeight: z.number('ระบุน้ำหนักเริ่มต้น').min(0),
  maxWeight: z.number('ระบุน้ำหนักสิ้นสุด').min(0),
  rate: z.number('ระบุค่าส่งในช่วงนี้').min(0),
})

const shippingCountrySchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().length(2, 'รหัสประเทศต้องมี 2 ตัวอักษร'),
  countryName: z.string().min(1, 'กรุณาระบุชื่อประเทศ'),

  baseRate: z.number().min(0),
  pricePerKg: z.number().min(0),

  freeShippingThreshold: z.number().nullish(),
  weightTiers: z.array(shippingWeightTierSchema).default([]),

  currency: z.nativeEnum(Currency),
  isActive: z.boolean().default(true),
})

type ShippingCountryInput = z.infer<typeof shippingCountrySchema>
type ShippingWeightTierInput = z.infer<typeof shippingWeightTierSchema>

export { shippingCountrySchema, shippingWeightTierSchema }
export type { ShippingCountryInput, ShippingWeightTierInput }
