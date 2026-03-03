const blogCategoryLocaleKeys = {
  all: ['blog-category-localizations'] as const,

  stats: {
    all: () => [...blogCategoryLocaleKeys.all, 'stats'] as const,
    byCategory: (id: string) =>
      [...blogCategoryLocaleKeys.stats.all(), id] as const,
  },

  lists: {
    all: () => [...blogCategoryLocaleKeys.all, 'list'] as const,

    byCategory: (id: string) =>
      [...blogCategoryLocaleKeys.lists.all(), id] as const,
  },

  details: {
    all: () => [...blogCategoryLocaleKeys.all, 'detail'] as const,

    byId: (id: string) =>
      [...blogCategoryLocaleKeys.details.all(), id] as const,
  },
}

export { blogCategoryLocaleKeys }
