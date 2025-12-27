import { OrderStatus } from '@prisma/client'

import { ORDER_ALL_STATUS, ORDER_STATUS_FLOW } from './constants'

export const getOrderStatus = (key: OrderStatus) => ORDER_ALL_STATUS[key] ?? key

export const checkOrderStatus = (current: OrderStatus, next: OrderStatus) => {
  if (current === next) return false

  if (next === OrderStatus.CANCELLED) {
    return current === OrderStatus.PENDING
  }

  if (next === OrderStatus.REFUNDED) {
    return current === OrderStatus.DELIVERED
  }

  return ORDER_STATUS_FLOW[next] === ORDER_STATUS_FLOW[current] + 1
}
