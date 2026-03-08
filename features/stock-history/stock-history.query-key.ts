const stockHistoryQueryKeys = {
  all: ['stock-history'] as const,
  lists: () => [...stockHistoryQueryKeys.all, 'list'] as const,
  list: (productId: string, page: number) =>
    [...stockHistoryQueryKeys.lists(), productId, { page }] as const,
}

export { stockHistoryQueryKeys }
