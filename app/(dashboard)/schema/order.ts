import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

type OrderInput = z.infer<typeof orderSchema>

const orderSchema = z.object({
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

export type { OrderInput }
export { orderSchema }
