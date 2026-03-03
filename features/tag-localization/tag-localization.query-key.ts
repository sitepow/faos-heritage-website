const tagLocaleKeys = {
  all: ['tag-localizations'] as const,

  stats: {
    all: () => [...tagLocaleKeys.all, 'stats'] as const,
    byTag: (tagId: string) => [...tagLocaleKeys.stats.all(), tagId] as const,
  },

  lists: {
    all: () => [...tagLocaleKeys.all, 'list'] as const,
    byTag: (tagId: string) => [...tagLocaleKeys.lists.all(), tagId] as const,
  },

  details: {
    all: () => [...tagLocaleKeys.all, 'detail'] as const,
    byId: (id: string) => [...tagLocaleKeys.details.all(), id] as const,
  },
}

export { tagLocaleKeys }
