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

    bySlug: (slug: string, metadata?: { locale?: string }) => {
      const base = [...postQueryKeys.details.all(), slug]
      return metadata ? [...base, metadata] : base
    },

    byId: (id: string) => [...postQueryKeys.details.all(), 'id', id],
  },

  stats: () => [...postQueryKeys.all, 'stats'] as const,
}

export { postQueryKeys }
export type { PostListFilters }
