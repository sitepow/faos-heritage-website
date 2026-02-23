const exchangeRateQueryKeys = {
  all: ['exchangeRates'] as const,

  lists: {
    all: () => [...exchangeRateQueryKeys.all, 'list'] as const,

    byCurrency: (currency: string) =>
      [...exchangeRateQueryKeys.lists.all(), currency] as const,

    bySource: (source: string) =>
      [...exchangeRateQueryKeys.lists.all(), 'source', source] as const,
  },
}

export { exchangeRateQueryKeys }
