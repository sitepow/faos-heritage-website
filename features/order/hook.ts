import { useQuery } from '@tanstack/react-query'

import type { AffiliateFilter, GetAffiliateOrdersOptions } from './types'

import {
  getAffiliateOrders,
  getAffiliateStats,
  getOrderById,
  getOrders,
  getOrderStats,
  getRevenueStats,
} from './action'
import { orderQueryKeys, type OrderListFilters } from './query-key'

type Orders = Awaited<ReturnType<typeof getOrders>>
type Order = NonNullable<Awaited<ReturnType<typeof getOrders>>['items']>[number]

const useAffiliateOrders = (filters: GetAffiliateOrdersOptions) => {
  return useQuery({
    queryKey: [...orderQueryKeys.affiliate.all, 'list', filters],
    queryFn: () => getAffiliateOrders(filters),
  })
}

const useAffiliateStats = (filter?: AffiliateFilter) => {
  return useQuery({
    queryKey: [...orderQueryKeys.affiliate.stats(), filter],
    queryFn: () => getAffiliateStats(filter),
  })
}

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

export {
  useAffiliateOrders,
  useAffiliateStats,
  useOrders,
  useOrder,
  useOrderStats,
  useRevenueStats,
}
export type { Orders, Order }
