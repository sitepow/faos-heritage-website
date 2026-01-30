import { OrderStatus } from '@prisma/client'

import type { GetAddressResult } from '@/features/address/address.action'

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

const resolveOrderStatusLabel = (status: OrderStatus): string =>
  ORDER_STATUS_LABELS[status] ?? status

const canTransitionOrderStatus = (
  current: OrderStatus,
  next: OrderStatus,
): boolean => {
  if (current === next) {
    return false
  }

  if (next === OrderStatus.CANCELLED) {
    return current === OrderStatus.PENDING
  }

  if (next === OrderStatus.REFUNDED) {
    return current === OrderStatus.DELIVERED
  }

  return ORDER_STATUS_FLOW[next] === ORDER_STATUS_FLOW[current] + 1
}

export { formatFullAddress, resolveOrderStatusLabel, canTransitionOrderStatus }
