const stockQueryKeys = {
  all: ['stock'] as const,
  history: (productId: string) =>
    [...stockQueryKeys.all, 'history', productId] as const,
}

export { stockQueryKeys }
