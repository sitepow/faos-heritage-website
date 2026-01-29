type ProductImageListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const productImageQueryKeys = {
  root: ['productImages'] as const,

  list: {
    all: [...['productImages'], 'list'] as const,

    byFilter: (filters: ProductImageListFilters = {}) =>
      [...productImageQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...productImageQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['productImages'], 'detail'] as const,

    byId: (id: string) => [...productImageQueryKeys.detail.all, id] as const,
  },
}

export { productImageQueryKeys }
