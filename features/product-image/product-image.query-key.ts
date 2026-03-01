type ProductImageListFilters = {
  productId?: string
  isPrimary?: boolean
  isActive?: boolean
}

const productImageQueryKeys = {
  all: ['productImages'] as const,

  lists: {
    all: () => [...productImageQueryKeys.all, 'list'] as const,

    byProductId: (productId: string, filters: ProductImageListFilters = {}) =>
      [...productImageQueryKeys.lists.all(), productId, filters] as const,

    filtered: (filters: ProductImageListFilters) =>
      [...productImageQueryKeys.lists.all(), 'filter', filters] as const,
  },

  details: {
    all: () => [...productImageQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...productImageQueryKeys.details.all(), id] as const,
  },
  stats: (productId: string) =>
    [...productImageQueryKeys.all, 'stats', productId] as const,
}

export { productImageQueryKeys }
export type { ProductImageListFilters }
