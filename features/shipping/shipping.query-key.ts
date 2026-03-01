type ShippingListFilters = {
  isActive?: boolean
  countryCode?: string
}

const shippingQueryKeys = {
  all: ['shippings'] as const,

  lists: {
    all: () => [...shippingQueryKeys.all, 'list'] as const,

    countries: (filters: ShippingListFilters = {}) =>
      [...shippingQueryKeys.lists.all(), 'countries', filters] as const,

    weightTiers: (countryCode: string) =>
      [...shippingQueryKeys.lists.all(), 'weightTiers', countryCode] as const,
  },

  costs: {
    all: () => [...shippingQueryKeys.all, 'cost'] as const,
    calculate: (
      countryCode: string,
      items: { quantity: number; weight: number }[],
    ) =>
      [
        ...shippingQueryKeys.costs.all(),
        'calculate',
        { countryCode, items },
      ] as const,
  },

  details: {
    all: () => [...shippingQueryKeys.all, 'detail'] as const,

    byId: (id: string) => [...shippingQueryKeys.details.all(), id] as const,
  },
  stats: () => [...shippingQueryKeys.all, 'stats'] as const,
}

export { shippingQueryKeys }
export type { ShippingListFilters }
