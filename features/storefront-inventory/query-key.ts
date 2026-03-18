const storefrontInventoryKeys = {
  all: ['storefront-inventory'] as const,
  byStore: (storefrontId: string) =>
    [...storefrontInventoryKeys.all, 'store', storefrontId] as const,
  detail: (id: string) =>
    [...storefrontInventoryKeys.all, 'detail', id] as const,
}

export { storefrontInventoryKeys }
