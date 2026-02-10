type CartFilters = {
  userId?: string
  locale?: string
}

const cartQueryKeys = {
  all: ['carts'] as const,

  lists: {
    all: () => [...cartQueryKeys.all, 'list'] as const,

    byUserId: ({ userId, locale }: CartFilters) =>
      [...cartQueryKeys.lists.all(), userId, locale] as const,
  },

  stats: {
    all: () => [...cartQueryKeys.all, 'stat'] as const,

    byUserId: (userId: string) =>
      [...cartQueryKeys.stats.all(), userId] as const,
  },
}

export { cartQueryKeys }
export type { CartFilters }
