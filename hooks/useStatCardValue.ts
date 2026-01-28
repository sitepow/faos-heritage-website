import { useQuery } from '@tanstack/react-query'

import { useAppStore } from '@/app/store'
import { getExchangeRates } from '@/utils/exchangeRate'
import { formatCurrency, formatNumber } from '@/utils/number'

interface UseStatCardValueParams {
  value: number
  isCurrency?: boolean
}

const useStatCardValue = ({
  value,
  isCurrency,
}: UseStatCardValueParams): string => {
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
    rates: exchangeRates,
  })
}

export { useStatCardValue }
