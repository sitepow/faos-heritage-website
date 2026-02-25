type ProductListFilters = {
  locale?: string
  isActive?: boolean
  categoryId?: string | null
  limit?: number
}

const productQueryKeys = {
  all: ['products'] as const,

  lists: {
    all: () => [...productQueryKeys.all, 'list'] as const,

    filtered: (filters: ProductListFilters) =>
      [...productQueryKeys.lists.all(), filters] as const,

    infinite: (filters: ProductListFilters & { cursor?: string | null }) =>
      [...productQueryKeys.lists.all(), 'infinite', filters] as const,

    similar: (locale: string, categoryId?: string | null) =>
      [...productQueryKeys.lists.all(), 'similar', locale, categoryId] as const,
  },

  details: {
    all: () => [...productQueryKeys.all, 'detail'] as const,

    bySlug: (slug: string, context?: { locale?: string; userId?: string }) =>
      [...productQueryKeys.details.all(), slug, context ?? {}] as const,

    byId: (id: string) =>
      [...productQueryKeys.details.all(), 'id', id] as const,
  },

  stats: () => [...productQueryKeys.all, 'stats'] as const,
}

export { productQueryKeys }
export type { ProductListFilters }
