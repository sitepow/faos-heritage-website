type OrderListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const orderQueryKeys = {
  root: ['orders'] as const,

  list: {
    all: [...['orders'], 'list'] as const,

    byFilter: (filters: OrderListFilters = {}) =>
      [...orderQueryKeys.list.all, filters] as const,

    homepage: (locale?: string, itemsPerPage?: number) =>
      [...orderQueryKeys.list.all, 'homepage', locale, itemsPerPage] as const,
  },

  detail: {
    all: [...['orders'], 'detail'] as const,

    byId: (id: string) => [...orderQueryKeys.detail.all, id] as const,
  },
}

export { orderQueryKeys }
