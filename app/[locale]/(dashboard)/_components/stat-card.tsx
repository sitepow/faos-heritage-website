'use client'

import { Card, Skeleton } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'

import { useAppStore } from '@/app/store'
import { EXCHANGE_RATE_TTL } from '@/utils/constants/app'
import { getThbExchangeRates } from '@/utils/helpers/currency/exchange'
import { formatCurrency, formatNumber } from '@/utils/helpers/number'

interface StatCardProps {
  name: string
  value: number
  isCurrency?: boolean
}

export const StatCardSkeleton = () => {
  return <Skeleton className='h-24 rounded-lg' />
}

export const StatCard = ({ name, value, isCurrency }: StatCardProps) => {
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

  return (
    <Card className='border-divider border' shadow='none' radius='sm'>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2 text-start'>
          <dt className='text-small text-default-500 font-medium'>{name}</dt>
          <dd className='text-default-700 text-2xl font-semibold'>
            {isCurrency
              ? formatCurrency(value, CURRENCY_OPTIONS)
              : formatNumber(value)}
          </dd>
        </div>
      </div>
    </Card>
  )
}
