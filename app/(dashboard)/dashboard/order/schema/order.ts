import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

type OrderStatusInput = z.infer<typeof orderStatusSchema>

const orderStatusSchema = z.object({
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

export type { OrderStatusInput }
export { orderStatusSchema }
