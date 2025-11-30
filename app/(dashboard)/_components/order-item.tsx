import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'

import type { ComponentProps, FC } from 'react'

import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 py-2 md:flex-nowrap',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex flex-wrap gap-3 md:flex-nowrap'>
        <AvatarGroup max={3}>
          <Avatar src='/placeholder.svg' />
          <Avatar src='/placeholder.svg' />
          <Avatar src='/placeholder.svg' />
          <Avatar src='/placeholder.svg' />
        </AvatarGroup>

        <div className='flex flex-col *:line-clamp-1'>
          <span>เลขที่รายการ #2514814107 ยอดรวม {formatCurrency(1302)}</span>
          <span className='text-default-500'>วันที่ ({formatDate(new Date())})</span>
          <span className='text-default-500'>(9 รายการ)(กำลังรอชำระเงิน)</span>
        </div>
      </div>

      <Button className='shrink-0' variant='faded'>
        รายละเอียด
      </Button>
    </div>
  )
}

export { OrderItem }
