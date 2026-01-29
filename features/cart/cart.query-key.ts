type CartListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const cartQueryKeys = {
  root: ['carts'] as const,

  list: {
    all: [...['carts'], 'list'] as const,

    byFilter: (filters: CartListFilters = {}) =>
      [...cartQueryKeys.list.all, filters] as const,

    homepage: (locale?: string, itemsPerPage?: number) =>
      [...cartQueryKeys.list.all, 'homepage', locale, itemsPerPage] as const,
  },

  detail: {
    all: [...['carts'], 'detail'] as const,

    byId: (id: string) => [...cartQueryKeys.detail.all, id] as const,
  },
}

export { cartQueryKeys }
