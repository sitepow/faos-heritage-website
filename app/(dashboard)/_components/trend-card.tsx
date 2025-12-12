import { Card } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'

import type { FC } from 'react'

import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  name: string
  value: number
  isCurrency?: boolean
}

const TrendCard: FC<Props> = ({ name, value, isCurrency }) => {
  return (
    <Card>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2'>
          <dt className='text-small font-medium text-default-500'>{name}</dt>
          <dd className='text-2xl font-semibold text-default-700'>
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </dd>
        </div>
      </div>
    </Card>
  )
}

const TrendCardSkeleton = () => {
  return <Skeleton className='h-24 rounded-lg' />
}

export { TrendCard, TrendCardSkeleton }
