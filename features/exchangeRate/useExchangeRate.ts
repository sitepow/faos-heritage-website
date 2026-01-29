import { useQuery } from '@tanstack/react-query'

import { exchangeRateQueryKeys } from './exchangeRate.query-key'

import { useAppStore } from '@/app/store'
import { getExchangeRates } from '@/utils/exchangeRate'

const useExchangeRate = (country: string = 'TH') => {
  const { hasHydrated } = useAppStore()

  return useQuery({
    queryKey: exchangeRateQueryKeys.list(country),
    queryFn: () => getExchangeRates(),
    enabled: !!country && hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export { useExchangeRate }
