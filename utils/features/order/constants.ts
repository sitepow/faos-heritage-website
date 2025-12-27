import type { OrderStatus } from '@prisma/client'

export const ORDER_ALL_STATUS: Record<OrderStatus, string> = {
  PENDING: 'Order Created',
  PAID: 'Payment Completed',
  PROCESSING: 'Preparing Order',
  DELIVERED: 'Shipped',
  CANCELLED: 'Order Cancelled',
  REFUNDED: 'Refunded / Order Cancelled',
}

export const ORDER_STATUS = {
  PENDING: ORDER_ALL_STATUS.PENDING,
  PAID: ORDER_ALL_STATUS.PAID,
  PROCESSING: ORDER_ALL_STATUS.PROCESSING,
  DELIVERED: ORDER_ALL_STATUS.DELIVERED,
} satisfies Partial<Record<OrderStatus, string>>

export const ORDER_STEPS = Object.entries(ORDER_STATUS) as [
  OrderStatus,
  string,
][]

export const ORDER_STEPS_ALL = Object.entries(ORDER_ALL_STATUS) as [
  OrderStatus,
  string,
][]

export const ORDER_STATUS_FLOW: Record<OrderStatus, number> = {
  PENDING: 1,
  PAID: 2,
  PROCESSING: 3,
  DELIVERED: 4,
  CANCELLED: 99,
  REFUNDED: 100,
}
