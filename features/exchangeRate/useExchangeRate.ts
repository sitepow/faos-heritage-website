import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { CurrencyFormatOptions } from '@/utils'

import { exchangeRateQueryKeys } from './exchangeRate.query-key'

import { useAppStore } from '@/app/store'
import { getExchangeRates } from '@/utils/exchangeRate'

const useExchangeRate = (country: string = 'TH') => {
  const { appLocale, hasHydrated } = useAppStore()

  const exchangeRate = useQuery({
    queryKey: exchangeRateQueryKeys.list(country),
    queryFn: () => getExchangeRates(),
    enabled: !!country && hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const currencyOptions = useMemo(
    () => ({
      currency: appLocale?.currency,
      locale: appLocale?.locale,
      rates: exchangeRate?.data?.exchangeRates,
    }),
    [appLocale?.currency, appLocale?.locale, exchangeRate?.data?.exchangeRates],
  ) as CurrencyFormatOptions

  return {
    ...exchangeRate,
    currencyOptions,
  }
}

export { useExchangeRate }
