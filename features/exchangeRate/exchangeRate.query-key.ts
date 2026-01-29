const exchangeRateQueryKeys = {
  root: ['exchangeRates'] as const,
  lists: () => [...exchangeRateQueryKeys.root, 'list'] as const,
  list: (country: string) =>
    [...exchangeRateQueryKeys.lists(), country] as const,
}

export { exchangeRateQueryKeys }
