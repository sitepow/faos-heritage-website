const storefrontQueryKeys = {
  all: ['storefronts'] as const,
  lists: () => [...storefrontQueryKeys.all, 'list'] as const,
  active: () => [...storefrontQueryKeys.all, 'active'] as const,
  detail: (id: string) => [...storefrontQueryKeys.all, 'detail', id] as const,
}

export { storefrontQueryKeys }
