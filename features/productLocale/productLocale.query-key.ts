type ProductLocaleListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const productLocaleQueryKeys = {
  root: ['productLocales'] as const,

  list: {
    all: [...['productLocales'], 'list'] as const,

    byFilter: (filters: ProductLocaleListFilters = {}) =>
      [...productLocaleQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...productLocaleQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['productLocales'], 'detail'] as const,

    byId: (id: string) => [...productLocaleQueryKeys.detail.all, id] as const,
  },
}

export { productLocaleQueryKeys }
