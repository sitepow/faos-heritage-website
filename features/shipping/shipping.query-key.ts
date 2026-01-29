type ShippingListFilters = {
  locale?: string
  isActive?: boolean
  position?: 'homepage' | 'dashboard'
}

const shippingQueryKeys = {
  root: ['shippings'] as const,

  list: {
    all: [...['shippings'], 'list'] as const,

    byFilter: (filters: ShippingListFilters = {}) =>
      [...shippingQueryKeys.list.all, filters] as const,

    homepage: (locale?: string) =>
      [...shippingQueryKeys.list.all, 'homepage', locale] as const,
  },

  detail: {
    all: [...['shippings'], 'detail'] as const,

    byId: (id: string) => [...shippingQueryKeys.detail.all, id] as const,
  },
}

export { shippingQueryKeys }
