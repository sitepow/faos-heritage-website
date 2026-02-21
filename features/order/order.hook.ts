import { useQuery } from '@tanstack/react-query'

import {
  getOrderById,
  getOrders,
  getOrderStats,
  getRevenueStats,
} from './order.action'
import { orderQueryKeys, type OrderListFilters } from './order.query-key'

type Orders = Awaited<ReturnType<typeof getOrders>>
type Order = NonNullable<Awaited<ReturnType<typeof getOrders>>['items']>[number]

const useOrders = (filters: OrderListFilters) => {
  return useQuery({
    queryKey: orderQueryKeys.lists.filtered(filters),
    queryFn: () => getOrders(filters),
  })
}

const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: orderQueryKeys.details.byId(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  })
}

const useOrderStats = () => {
  return useQuery({
    queryKey: orderQueryKeys.stats.overview(),
    queryFn: () => getOrderStats(),
  })
}

const useRevenueStats = () => {
  return useQuery({
    queryKey: orderQueryKeys.stats.revenue(),
    queryFn: () => getRevenueStats(),
  })
}

export { useOrders, useOrder, useOrderStats, useRevenueStats }
export type { Orders, Order }
