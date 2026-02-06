type AddressListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const addressQueryKeys = {
  root: ['addresses'] as const,

  list: {
    all: [...['addresses'], 'list'] as const,

    byFilter: (filters: AddressListFilters = {}) =>
      [...addressQueryKeys.list.all, filters] as const,
  },

  detail: {
    all: [...['addresses'], 'detail'] as const,

    byId: (id: string) => [...addressQueryKeys.detail.all, id] as const,

    byUserId: (id: string) => [...addressQueryKeys.detail.all, id] as const,
  },
}

export { addressQueryKeys }
