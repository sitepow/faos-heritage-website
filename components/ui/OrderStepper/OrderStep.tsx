import type { OrderStatus } from '@prisma/client'

import { ORDER_STATUS_ICONS } from './stepConfig'

import { formatDate } from '@/utils/date'
import { cn } from '@/utils/style'

interface OrderStepProps {
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
}: OrderStepProps) => {
  const Icon = ORDER_STATUS_ICONS[status]

  return (
    <div className='flex flex-col items-center'>
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full',
          isCompleted && 'bg-primary text-secondary',
          isCurrent && 'bg-primary ring-primary/50 text-secondary ring-4',
          !isCompleted && !isCurrent && 'bg-divider text-default-500',
        )}
      >
        {isCompleted || isCurrent ? (
          <Icon />
        ) : (
          <span className='text-lg font-semibold'>{index + 1}</span>
        )}
      </div>

      <div
        className={cn(
          'mt-3 max-w-[120px] text-center text-sm font-medium',
          !isCompleted && !isCurrent && 'text-default-500',
        )}
      >
        <div>{label}</div>
        {date && <div>{formatDate(date)}</div>}
      </div>
    </div>
  )
}

export { OrderStep }
