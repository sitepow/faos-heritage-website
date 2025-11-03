'use client'
import { Card, Chip, cn } from '@heroui/react'
import { Icon } from '@iconify/react'

import type { FC } from 'react'

interface Props {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'neutral' | 'negative'
  trendType: 'up' | 'neutral' | 'down'
  trendChipPosition?: 'top' | 'bottom'
  trendChipVariant?: 'flat' | 'light'
}

const TrendCard: FC<Props> = ({
  title,
  value,
  change,
  changeType,
  trendType,
  trendChipPosition = 'top',
  trendChipVariant = 'light',
}) => {
  return (
    <Card>
      <div className='flex p-4'>
        <div className='flex flex-col items-start gap-y-2'>
          <dt className='text-small text-default-500 font-medium'>{title}</dt>
          <dd className='text-default-700 text-2xl font-semibold'>{value}</dd>
        </div>
        <Chip
          className={cn('absolute right-4', {
            'top-4': trendChipPosition === 'top',
            'bottom-4': trendChipPosition === 'bottom',
          })}
          classNames={{
            content: 'font-medium text-[0.65rem]',
          }}
          color={
            // eslint-disable-next-line no-nested-ternary
            changeType === 'positive'
              ? 'success'
              : changeType === 'neutral'
                ? 'warning'
                : 'danger'
          }
          radius='sm'
          size='sm'
          startContent={
            // eslint-disable-next-line no-nested-ternary
            trendType === 'up' ? (
              <Icon height={12} icon='solar:arrow-right-up-linear' width={12} />
            ) : trendType === 'neutral' ? (
              <Icon height={12} icon='solar:arrow-right-linear' width={12} />
            ) : (
              <Icon
                height={12}
                icon='solar:arrow-right-down-linear'
                width={12}
              />
            )
          }
          variant={trendChipVariant}
        >
          {change}
        </Chip>
      </div>
    </Card>
  )
}

export { TrendCard }
