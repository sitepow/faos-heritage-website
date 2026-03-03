const categoryLocaleKeys = {
  all: ['category-localizations'] as const,

  stats: {
    all: () => [...categoryLocaleKeys.all, 'stats'] as const,
    byCategory: (categoryId: string) =>
      [...categoryLocaleKeys.stats.all(), categoryId] as const,
  },

  lists: {
    all: () => [...categoryLocaleKeys.all, 'list'] as const,

    byCategory: (categoryId: string) =>
      [...categoryLocaleKeys.lists.all(), categoryId] as const,
  },

  details: {
    all: () => [...categoryLocaleKeys.all, 'detail'] as const,

    byId: (id: string) => [...categoryLocaleKeys.details.all(), id] as const,
  },
}

export { categoryLocaleKeys }
