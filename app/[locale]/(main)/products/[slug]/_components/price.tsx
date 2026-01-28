'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { useAppStore } from '@/app/store'
import { resolveRangeDisplayValue } from '@/utils/app'
import { getExchangeRates } from '@/utils/exchangeRate'
import { formatCurrency, formatCurrencyRange } from '@/utils/number'
import { cn } from '@/utils/style'

type ProductPriceProps = ComponentProps<'div'> & {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

const ProductPrice = ({
  price,
  priceMin,
  priceMax,
  unit = 'item',
  className,
  ...props
}: ProductPriceProps) => {
  const t = useTranslations('ProductUnit')
  const { appLocale, hasHydrated } = useAppStore()

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchange-rates', 'THB'],
    queryFn: getExchangeRates,
    enabled: hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const CURRENCY_OPTIONS = {
    currency: appLocale?.currency,
    locale: appLocale?.locale,
    rates: exchangeRates,
  }

  const displayPrice = resolveRangeDisplayValue(
    {
      min: priceMin,
      max: priceMax,
      fallback: price,
    },
    {
      single: (value) => formatCurrency(value, CURRENCY_OPTIONS),
      range: (min, max) => formatCurrencyRange(min, max, CURRENCY_OPTIONS),
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

export { ProductPrice }
