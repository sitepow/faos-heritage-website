type FavoriteListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const favoriteQueryKeys = {
  root: ['favorities'] as const,

  list: {
    all: [...['favorities'], 'list'] as const,

    byFilter: (filters: FavoriteListFilters = {}) =>
      [...favoriteQueryKeys.list.all, filters] as const,
  },

  detail: {
    all: [...['favorities'], 'detail'] as const,

    byId: (id: string) => [...favoriteQueryKeys.detail.all, id] as const,
  },
}

export { favoriteQueryKeys }
