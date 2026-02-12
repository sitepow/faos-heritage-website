'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { CurrencyFormatOptions } from '@/utils'

import { exchangeRateQueryKeys } from './exchangeRate.query-key'

import { useAppStore } from '@/app/store'
import { CURRENCY } from '@/constants'
import { getExchangeRates } from '@/utils/exchangeRate'

interface Props {
  currency?: string
  locale?: string
}

const useExchangeRate = (overrides?: Props) => {
  const { appLocale } = useAppStore()

  const currentCurrency =
    overrides?.currency || appLocale?.currency || CURRENCY.DEFAULT_CODE
  const currentLocale =
    overrides?.locale || appLocale?.locale || CURRENCY.DEFAULT_LOCALE

  const exchangeRate = useQuery({
    queryKey: exchangeRateQueryKeys.lists.byCurrency(currentCurrency),
    queryFn: () => getExchangeRates(),
    refetchOnWindowFocus: true,
    retry: 1,
  })

  const currencyOptions = useMemo(
    () => ({
      currency: currentCurrency,
      locale: currentLocale,
      rates: exchangeRate?.data,
    }),
    [currentCurrency, currentLocale, exchangeRate?.data],
  ) as CurrencyFormatOptions

  return {
    ...exchangeRate,
    currencyOptions,
  }
}

export { useExchangeRate }
