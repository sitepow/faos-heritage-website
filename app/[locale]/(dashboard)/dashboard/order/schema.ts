import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

export type OrderInput = z.infer<typeof orderSchema>

export const orderSchema = z.object({
  reason: z.string('Please specify a note').optional(),
  status: z.enum(OrderStatus),
  tempStatus: z.enum(OrderStatus),
  trackingWebsite: z
    .string(`Please provide the shipping company's website`)
    .optional(),
  trackingNumber: z
    .string(`Please provide the item's tracking number`)
    .optional(),
})
