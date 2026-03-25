const contractQueryKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractQueryKeys.all, 'list'] as const,
  details: (id: string) => [...contractQueryKeys.all, 'detail', id] as const,
  active: (storefrontId: string) =>
    [...contractQueryKeys.all, 'active', storefrontId] as const,
}

export { contractQueryKeys }
