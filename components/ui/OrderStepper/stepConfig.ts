/* eslint-disable no-undef */
import { OrderStatus } from '@prisma/client'
import {
  CreditCardIcon,
  XIcon,
  PackageOpenIcon,
  PackageIcon,
  PackageCheckIcon,
  StoreIcon,
} from 'lucide-react'

const ORDER_STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  PENDING: PackageOpenIcon,
  PAID: CreditCardIcon,
  PROCESSING: PackageIcon,
  READY_FOR_PICKUP: StoreIcon,
  DELIVERED: PackageCheckIcon,
  CANCELLED: XIcon,
  REFUNDED: XIcon,
}

const getOrderStatusDate = (
  status: OrderStatus,
  dates: {
    createdAt: Date
    paidAt?: Date | null
    shippedAt?: Date | null
    deliveredAt?: Date | null
    updatedAt?: Date | null
  },
) => {
  switch (status) {
    case OrderStatus.PENDING:
      return dates.createdAt
    case OrderStatus.PAID:
      return dates.paidAt
    case OrderStatus.PROCESSING:
      return dates.shippedAt
    case OrderStatus.READY_FOR_PICKUP:
      return dates.updatedAt
    case OrderStatus.DELIVERED:
      return dates.deliveredAt
    default:
      return null
  }
}

export { getOrderStatusDate, ORDER_STATUS_ICONS }
