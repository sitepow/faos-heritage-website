import { z } from 'zod'

export type ShippingWeightTierInput = z.infer<typeof shippingWeightTierSchema>

export const shippingWeightTierSchema = z.object({
  id: z.string().optional(),
  countryCode: z.string().length(2),
  minWeight: z.number().min(0),
  maxWeight: z.number().min(0),
  pricePerKg: z.number().min(0),
})
