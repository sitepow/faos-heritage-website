import { OrderStatus, PaymentStatus } from '@prisma/client'

import type { Prisma } from '@prisma/client'

const buildStatusUpdateData = (
  status: OrderStatus,
  meta: { trackingWebsite?: string; trackingNumber?: string; reason?: string },
): Prisma.OrderUpdateInput => {
  const now = new Date()
  const mapping: Partial<Record<OrderStatus, Prisma.OrderUpdateInput>> = {
    [OrderStatus.PAID]: { paymentStatus: PaymentStatus.PAID, paidAt: now },
    [OrderStatus.PROCESSING]: { shippedAt: now },
    [OrderStatus.DELIVERED]: {
      deliveredAt: now,
      trackingWebsite: meta.trackingWebsite,
      trackingNumber: meta.trackingNumber,
    },
    [OrderStatus.CANCELLED]: {
      cancelledAt: now,
      paymentStatus: PaymentStatus.FAILED,
      cancelReason: meta.reason,
    },
    [OrderStatus.REFUNDED]: {
      refundedAt: now,
      paymentStatus: PaymentStatus.REFUNDED,
      cancelReason: meta.reason,
    },
  }
  return mapping[status] ?? {}
}

export { buildStatusUpdateData }
