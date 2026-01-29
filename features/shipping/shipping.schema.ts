import { Currency } from '@prisma/client'
import { z } from 'zod'

type ShippingCountryInput = z.infer<typeof shippingCountrySchema>
type ShippingWeightTierInput = z.infer<typeof shippingWeightTierSchema>

const shippingCountrySchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().length(2),
  countryName: z.string().min(1),
  baseRate: z.number().min(0),
  pricePerKg: z.number().min(0),
  currency: z.nativeEnum(Currency),
  isActive: z.boolean().optional(),
})

const shippingWeightTierSchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().length(2),
  minWeight: z.number().min(0),
  maxWeight: z.number().min(0),
  pricePerKg: z.number().min(0),
})

export { shippingCountrySchema, shippingWeightTierSchema }
export type { ShippingCountryInput, ShippingWeightTierInput }
