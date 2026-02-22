import type { OrderStatus } from '@prisma/client'

type OrderListFilters = {
  page?: number
  limit?: number
  userId?: string
  status?: OrderStatus
}

const orderQueryKeys = {
  all: ['orders'] as const,

  lists: {
    all: () => [...orderQueryKeys.all, 'list'] as const,

    filtered: (filters: OrderListFilters) =>
      [...orderQueryKeys.lists.all(), filters] as const,
  },

  details: {
    all: () => [...orderQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...orderQueryKeys.details.all(), id] as const,
  },

  stats: {
    all: () => [...orderQueryKeys.all, 'stats'] as const,

    overview: () => [...orderQueryKeys.stats.all(), 'overview'] as const,

    revenue: () => [...orderQueryKeys.stats.all(), 'revenue'] as const,
  },

  affiliate: {
    all: ['orders', 'affiliate'] as const,
    stats: () => [...orderQueryKeys.affiliate.all, 'stats'] as const,
  },
}

export { orderQueryKeys }
export type { OrderListFilters }
