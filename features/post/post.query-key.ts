type PostListFilters = {
  status?: string
  categoryId?: string | null
  isFeatured?: boolean
  limit?: number
  locale?: string
  excludeId?: string
}

const postQueryKeys = {
  all: ['posts'] as const,

  lists: {
    all: () => [...postQueryKeys.all, 'list'],
    filtered: (filters: PostListFilters) => [
      ...postQueryKeys.lists.all(),
      filters,
    ],
  },

  details: {
    all: () => [...postQueryKeys.all, 'detail'],
    byId: (id: string, metadata?: { locale?: string }) =>
      [...postQueryKeys.details.all(), id, metadata].filter(Boolean),
  },

  stats: () => [...postQueryKeys.all, 'stats'],
}

export { postQueryKeys }
export type { PostListFilters }
