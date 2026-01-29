type ProductVariantListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const productVariantQueryKeys = {
  root: ['productVariants'] as const,

  list: {
    all: [...['productVariants'], 'list'] as const,

    byFilter: (filters: ProductVariantListFilters = {}) =>
      [...productVariantQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...productVariantQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['productVariants'], 'detail'] as const,

    byId: (id: string) => [...productVariantQueryKeys.detail.all, id] as const,
  },
}

export { productVariantQueryKeys }
