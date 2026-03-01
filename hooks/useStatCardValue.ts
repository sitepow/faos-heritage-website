import { useQuery } from '@tanstack/react-query'

import { useAppStore } from '@/app/store'
import { getExchangeRates } from '@/utils/exchange-rate'
import { formatCurrency, formatNumber } from '@/utils/number'

interface Params {
  value: number
  isCurrency?: boolean
  currency?: string
}

const useStatCardValue = ({ value, isCurrency, currency }: Params): string => {
  const { appLocale, hasHydrated } = useAppStore()

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchange-rates', 'THB'],
    queryFn: getExchangeRates,
    enabled: hasHydrated && isCurrency,
    retry: 1,
  })

  if (!isCurrency) {
    return formatNumber(value)
  }

  return formatCurrency(value, {
    ...appLocale,
    currency: currency || appLocale.currency,
    rates: exchangeRates,
    skipCalculation: true,
  })
}

export { useStatCardValue }
