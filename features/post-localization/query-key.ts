const postLocaleKeys = {
  all: ['post-localizations'] as const,

  stats: {
    all: () => [...postLocaleKeys.all, 'stats'] as const,
    byPost: (postId: string) =>
      [...postLocaleKeys.stats.all(), postId] as const,
  },

  lists: {
    all: () => [...postLocaleKeys.all, 'list'] as const,
    byPost: (postId: string) =>
      [...postLocaleKeys.lists.all(), postId] as const,
  },

  details: {
    all: () => [...postLocaleKeys.all, 'detail'] as const,
    byId: (id: string) => [...postLocaleKeys.details.all(), id] as const,
  },
}

export { postLocaleKeys }
