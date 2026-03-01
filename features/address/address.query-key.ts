type AddressListFilters = {
  userId?: string
  isDefault?: boolean
}

const addressQueryKeys = {
  all: ['addresses'] as const,

  lists: {
    all: () => [...addressQueryKeys.all, 'list'] as const,

    byUserId: (userId: string, filters: AddressListFilters = {}) =>
      [...addressQueryKeys.lists.all(), userId, filters] as const,

    admin: () => [...addressQueryKeys.lists.all(), 'admin'] as const,
  },

  details: {
    all: () => [...addressQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...addressQueryKeys.details.all(), id] as const,

    defaultByUserId: (userId: string) =>
      [...addressQueryKeys.details.all(), 'default', userId] as const,
  },
  stats: () => [...addressQueryKeys.all, 'stats'] as const,
}

export { addressQueryKeys }
export type { AddressListFilters }
