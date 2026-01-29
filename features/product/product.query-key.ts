type ProductListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const productQueryKeys = {
  root: ['products'] as const,

  list: {
    all: [...['products'], 'list'] as const,

    byFilter: (filters: ProductListFilters = {}) =>
      [...productQueryKeys.list.all, filters] as const,

    homepage: (locale?: string, itemsPerPage?: number) =>
      [...productQueryKeys.list.all, 'homepage', locale, itemsPerPage] as const,

    similar: (locale: string, categoryId?: string | null) =>
      ['products', 'similar', locale, categoryId] as const,
  },

  detail: {
    all: [...['products'], 'detail'] as const,

    byId: (id: string) => [...productQueryKeys.detail.all, id] as const,
  },
}

export { productQueryKeys }
