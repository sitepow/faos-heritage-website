import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

type OrderStatusInput = z.infer<typeof orderStatusSchema>

const orderStatusSchema = z.object({
  reason: z.string('โปรดระบุหมายเหตุ').optional(),
  status: z.enum(OrderStatus),
  tempStatus: z.enum(OrderStatus),
  trackingWebsite: z.string('โปรดระบุเว็บไซต์ของขนส่ง').optional(),
  trackingNumber: z.string('โปรดระบุหมายเลข Tracking สินค้า').optional(),
})

export type { OrderStatusInput }
export { orderStatusSchema }
