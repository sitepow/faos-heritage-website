'use client'

import { Card, Skeleton } from '@heroui/react'

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
  return (
    <Card>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2 text-start'>
          <dt className='text-small text-default-500 font-medium'>{name}</dt>
          <dd className='text-default-700 text-2xl font-semibold'>
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </dd>
        </div>
      </div>
    </Card>
  )
}
