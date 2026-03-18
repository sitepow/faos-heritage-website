import { OrderStatus } from '@prisma/client'

import type { GetAddressResult } from '@/features/address/action'

import {
  UNKNOWN_ADDRESS_MESSAGE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
} from '@/constants'

const formatFullAddress = (address?: GetAddressResult | null): string => {
  if (!address) {
    return UNKNOWN_ADDRESS_MESSAGE
  }

  const {
    name,
    address: street,
    subDistrict,
    district,
    province,
    postalCode,
    country,
    phone,
  } = address

  const addressParts = [
    name,
    street,
    subDistrict,
    district,
    province,
    postalCode,
    country,
  ].filter(Boolean)

  const formatted = addressParts.join(', ')

  return phone ? `${formatted}. Phone: ${phone}` : formatted
}

const resolveOrderStatusLabel = (status: OrderStatus): string => {
  return ORDER_STATUS_LABELS[status] ?? status
}

const canTransitionOrderStatus = (
  current: OrderStatus,
  next: OrderStatus,
): boolean => {
  if (current === next) {
    return false
  }

  if (next === OrderStatus.CANCELLED) {
    return (
      current === OrderStatus.PENDING ||
      current === OrderStatus.PAID ||
      current === OrderStatus.PROCESSING
    )
  }

  if (next === OrderStatus.REFUNDED) {
    return (
      current === OrderStatus.DELIVERED ||
      current === OrderStatus.READY_FOR_PICKUP
    )
  }

  return ORDER_STATUS_FLOW[next] === ORDER_STATUS_FLOW[current] + 1
}

const ORDER_STATUS_TH_MAP: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'รอการชำระเงิน',
  [OrderStatus.PAID]: 'ชำระเงินแล้ว',
  [OrderStatus.PROCESSING]: 'กำลังดำเนินการ',
  [OrderStatus.READY_FOR_PICKUP]: 'พร้อมให้มารับสินค้า',
  [OrderStatus.DELIVERED]: 'สำเร็จแล้ว',
  [OrderStatus.CANCELLED]: 'ยกเลิกแล้ว',
  [OrderStatus.REFUNDED]: 'คืนเงินแล้ว',
}

const ORDER_STATUS_COLOR_MAP: Record<
  OrderStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PAID]: 'success',
  [OrderStatus.PROCESSING]: 'warning',
  [OrderStatus.READY_FOR_PICKUP]: 'warning',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'danger',
  [OrderStatus.REFUNDED]: 'default',
}

const getOrderStatusColor = (status: OrderStatus) => {
  return ORDER_STATUS_COLOR_MAP[status] ?? 'default'
}

export {
  formatFullAddress,
  resolveOrderStatusLabel,
  canTransitionOrderStatus,
  getOrderStatusColor,
  ORDER_STATUS_TH_MAP,
  ORDER_STATUS_COLOR_MAP,
}
