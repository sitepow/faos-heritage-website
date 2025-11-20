'use client'
import { Card } from '@heroui/react'

import type { FC } from 'react'

import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  title: string
  value: number
  isCurrency?: boolean
}

const TrendCard: FC<Props> = ({ title, value, isCurrency }) => {
  return (
    <Card>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2'>
          <dt className='text-small font-medium text-default-500'>{title}</dt>
          <dd className='text-2xl font-semibold text-default-700'>
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </dd>
        </div>
      </div>
    </Card>
  )
}

export { TrendCard }
