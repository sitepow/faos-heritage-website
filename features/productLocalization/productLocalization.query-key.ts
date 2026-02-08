type ProductLocaleFilters = {
  productId?: string
  languageCode?: string
}

const productLocaleQueryKeys = {
  all: ['productLocales'] as const,

  lists: {
    all: () => [...productLocaleQueryKeys.all, 'list'] as const,

    byProductId: (productId: string) =>
      [...productLocaleQueryKeys.lists.all(), productId] as const,

    filtered: (filters: ProductLocaleFilters) =>
      [...productLocaleQueryKeys.lists.all(), filters] as const,
  },

  details: {
    all: () => [...productLocaleQueryKeys.all, 'detail'] as const,

    byId: (id: string) =>
      [...productLocaleQueryKeys.details.all(), id] as const,
  },
}

export { productLocaleQueryKeys }
export type { ProductLocaleFilters }
