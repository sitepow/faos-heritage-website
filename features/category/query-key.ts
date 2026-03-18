type CategoryListFilters = {
  isActive?: boolean
  search?: string
}

const categoryQueryKeys = {
  all: ['categories'] as const,

  stats: () => [...categoryQueryKeys.all, 'stats'] as const,

  lists: {
    all: () => [...categoryQueryKeys.all, 'list'] as const,

    filtered: (filters: CategoryListFilters = {}) =>
      [...categoryQueryKeys.lists.all(), filters] as const,
  },

  details: {
    all: () => [...categoryQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...categoryQueryKeys.details.all(), id] as const,

    bySlug: (slug: string) =>
      [...categoryQueryKeys.details.all(), 'slug', slug] as const,
  },
}

export { categoryQueryKeys }
export type { CategoryListFilters }
