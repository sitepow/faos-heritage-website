import { Currency } from '@prisma/client'
import { z } from 'zod'

export type ShippingCountryInput = z.infer<typeof shippingCountrySchema>

export const shippingCountrySchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().length(2),
  countryName: z.string().min(1),
  baseRate: z.number().min(0),
  pricePerKg: z.number().min(0),
  currency: z.nativeEnum(Currency),
  isActive: z.boolean().optional(),
})
