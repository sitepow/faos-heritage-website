const tagQueryKeys = {
  all: ['tags'] as const,
  stats: () => [...tagQueryKeys.all, 'stats'] as const,
  lists: () => [...tagQueryKeys.all, 'list'] as const,
  details: () => [...tagQueryKeys.all, 'detail'] as const,
  byId: (id: string) => [...tagQueryKeys.details(), id] as const,
}

export { tagQueryKeys }
