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

    homepage: (locale?: string, itemsPerPage?: number) =>
      [...addressQueryKeys.list.all, 'homepage', locale, itemsPerPage] as const,
  },

  detail: {
    all: [...['addresses'], 'detail'] as const,

    byId: (id: string) => [...addressQueryKeys.detail.all, id] as const,
  },
}

export { addressQueryKeys }
