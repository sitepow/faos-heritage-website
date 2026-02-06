type ShippingListFilters = {
  locale?: string
  isActive?: boolean
}

const shippingQueryKeys = {
  root: ['shippings'] as const,

  list: {
    all: [...['shippings'], 'list'] as const,

    byFilter: (filters: ShippingListFilters = {}) =>
      [...shippingQueryKeys.list.all, filters] as const,
  },

  cost: {
    byUserId: (id: string, countryCode?: string, cartItems?: any[]) =>
      [
        ...shippingQueryKeys.root,
        'cost',
        id,
        { countryCode, cartItems },
      ] as const,
  },

  detail: {
    all: [...['shippings'], 'detail'] as const,

    byId: (id: string) => [...shippingQueryKeys.detail.all, id] as const,
  },
}

export { shippingQueryKeys }
