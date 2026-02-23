type BlogCategoryListFilters = {
  isActive?: boolean
  search?: string
}

const blogCategoryQueryKeys = {
  all: ['blog-categories'] as const,

  lists: {
    all: () => [...blogCategoryQueryKeys.all, 'list'] as const,
    filtered: (filters: BlogCategoryListFilters = {}) =>
      [...blogCategoryQueryKeys.lists.all(), filters] as const,
  },

  details: {
    all: () => [...blogCategoryQueryKeys.all, 'detail'] as const,
    byId: (id: string) => [...blogCategoryQueryKeys.details.all(), id] as const,
    bySlug: (slug: string) =>
      [...blogCategoryQueryKeys.details.all(), 'slug', slug] as const,
  },
}

export { blogCategoryQueryKeys }
export type { BlogCategoryListFilters }
