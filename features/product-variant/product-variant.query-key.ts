type ProductVariantFilters = {
  productId?: string
  isActive?: boolean
  sku?: string
}

const productVariantQueryKeys = {
  all: ['productVariants'] as const,

  lists: {
    all: () => [...productVariantQueryKeys.all, 'list'] as const,

    byProductId: (productId: string, filters: ProductVariantFilters = {}) =>
      [...productVariantQueryKeys.lists.all(), productId, filters] as const,

    filtered: (filters: ProductVariantFilters) =>
      [...productVariantQueryKeys.lists.all(), 'filter', filters] as const,
  },

  details: {
    all: () => [...productVariantQueryKeys.all, 'detail'] as const,

    byId: (id: string) =>
      [...productVariantQueryKeys.details.all(), id] as const,
  },
}

export { productVariantQueryKeys }
export type { ProductVariantFilters }
