type CategoryListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const categoryQueryKeys = {
  root: ['categories'] as const,

  list: {
    all: [...['categories'], 'list'] as const,

    byFilter: (filters: CategoryListFilters = {}) =>
      [...categoryQueryKeys.list.all, filters] as const,

    homepage: (locale?: string, itemsPerPage?: number) =>
      [
        ...categoryQueryKeys.list.all,
        'homepage',
        locale,
        itemsPerPage,
      ] as const,
  },

  detail: {
    all: [...['categories'], 'detail'] as const,

    byId: (id: string) => [...categoryQueryKeys.detail.all, id] as const,
  },
}

export { categoryQueryKeys }
