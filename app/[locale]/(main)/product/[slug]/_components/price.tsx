'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { useAppStore } from '@/app/store'
import { EXCHANGE_RATE_TTL } from '@/utils/constants/app'
import { getThbExchangeRates } from '@/utils/helpers/currency/exchange'
import { formatCurrency, formatCurrencyRange } from '@/utils/helpers/number'
import { getRangeDisplayValue } from '@/utils/helpers/range'
import { cn } from '@/utils/style'

type ProductPriceProps = ComponentProps<'div'> & {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

export const ProductPrice = ({
  price,
  priceMin,
  priceMax,
  unit = 'item',
  className,
  ...props
}: ProductPriceProps) => {
  const t = useTranslations('ProductUnit')
  const { country, hasHydrated } = useAppStore()

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchange-rates', 'THB'],
    queryFn: getThbExchangeRates,
    staleTime: EXCHANGE_RATE_TTL,
    gcTime: EXCHANGE_RATE_TTL * 2,
    enabled: hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const CURRENCY_OPTIONS = {
    currency: country?.currency,
    locale: country?.locale,
    rates: exchangeRates,
  }

  const displayPrice = getRangeDisplayValue(
    {
      min: priceMin,
      max: priceMax,
      fallback: price,
    },
    {
      formatSingle: (value) => formatCurrency(value, CURRENCY_OPTIONS),
      formatRange: (min, max) =>
        formatCurrencyRange(min, max, CURRENCY_OPTIONS),
    },
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-0',
        className,
      )}
      {...props}
    >
      <div className='flex items-baseline gap-1'>
        <span className='text-2xl font-black tracking-tighter text-zinc-900 dark:text-white'>
          {displayPrice}
        </span>
        <span className='text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
          / {t(unit?.toUpperCase())}
        </span>
      </div>
    </div>
  )
}
