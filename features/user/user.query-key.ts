type UserListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const userQueryKeys = {
  root: ['users'] as const,

  list: {
    all: [...['users'], 'list'] as const,

    byFilter: (filters: UserListFilters = {}) =>
      [...userQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...userQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['users'], 'detail'] as const,

    byId: (id: string) => [...userQueryKeys.detail.all, id] as const,
  },
}

export { userQueryKeys }
