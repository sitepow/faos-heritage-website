type PostListFilters = {
  status?: string
  categoryId?: string | null
  isFeatured?: boolean
  limit?: number
}

const postQueryKeys = {
  all: ['posts'] as const,
  lists: {
    all: () => [...postQueryKeys.all, 'list'] as const,
    filtered: (filters: PostListFilters) =>
      [...postQueryKeys.lists.all(), filters] as const,
  },
  details: {
    all: () => [...postQueryKeys.all, 'detail'] as const,
    byId: (id: string) => [...postQueryKeys.details.all(), id] as const,
  },
  stats: () => [...postQueryKeys.all, 'stats'] as const,
}

export { postQueryKeys }
export type { PostListFilters }
