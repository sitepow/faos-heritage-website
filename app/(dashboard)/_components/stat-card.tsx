'use client'

import { Card, Skeleton } from '@heroui/react'

import { useAppStore } from '@/app/store'
import { formatCurrency, formatNumber } from '@/utils/number'

interface StatCardProps {
  name: string
  value: number
  isCurrency?: boolean
}

export const StatCardSkeleton = () => {
  return <Skeleton className='h-24 rounded-lg' />
}

export const StatCard = ({ name, value, isCurrency }: StatCardProps) => {
  const { country } = useAppStore()

  return (
    <Card>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2 text-start'>
          <dt className='text-small text-default-500 font-medium'>{name}</dt>
          <dd className='text-default-700 text-2xl font-semibold'>
            {isCurrency
              ? formatCurrency(value, {
                  currency: country?.currency,
                  locale: country?.locale,
                })
              : formatNumber(value)}
          </dd>
        </div>
      </div>
    </Card>
  )
}
