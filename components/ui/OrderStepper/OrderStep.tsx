import type { OrderStatus } from '@prisma/client'

import { ORDER_STATUS_ICONS } from './stepConfig'

import { formatDate } from '@/utils/date'
import { cn } from '@/utils/style'

interface Props {
  status: OrderStatus
  label: string
  date?: Date | null
  index: number
  isCompleted: boolean
  isCurrent: boolean
  locale?: string
}

const OrderStep = ({
  status,
  label,
  date,
  index,
  isCompleted,
  isCurrent,
}: Props) => {
  const Icon = ORDER_STATUS_ICONS[status]

  return (
    <div className='relative z-10 flex flex-col items-center'>
      <div
        className={cn(
          'flex size-8 items-center justify-center rounded-full transition-all duration-300',
          isCompleted && 'bg-primary text-secondary',
          isCurrent && 'bg-primary ring-primary/30 text-secondary ring-4',
          !isCompleted && !isCurrent && 'bg-divider text-default-500',
        )}
      >
        {isCompleted || isCurrent ? (
          <Icon size={16} />
        ) : (
          <span className='text-sm font-semibold'>{index + 1}</span>
        )}
      </div>
      <div
        className={cn(
          'mt-2 max-w-[80px] text-center text-[10px] leading-tight font-medium',
          !isCompleted && !isCurrent && 'text-default-400',
        )}
      >
        <div className='truncate-2-lines'>{label}</div>{' '}
        {date && (
          <div className='mt-0.5 text-[9px] opacity-70'>{formatDate(date)}</div>
        )}
      </div>
    </div>
  )
}

export { OrderStep }
