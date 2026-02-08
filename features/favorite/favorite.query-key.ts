type FavoriteListFilters = {
  userId?: string
  productId?: string
  page?: number
  limit?: number
}

const favoriteQueryKeys = {
  all: ['favorites'] as const,

  lists: {
    all: () => [...favoriteQueryKeys.all, 'list'] as const,

    byUserId: (userId: string, filters: FavoriteListFilters = {}) =>
      [...favoriteQueryKeys.lists.all(), userId, filters] as const,

    byProduct: (userId: string, productId: string) =>
      [
        ...favoriteQueryKeys.lists.all(),
        'check',
        { userId, productId },
      ] as const,
  },

  details: {
    all: () => [...favoriteQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...favoriteQueryKeys.details.all(), id] as const,
  },
}

export { favoriteQueryKeys }
export type { FavoriteListFilters }
