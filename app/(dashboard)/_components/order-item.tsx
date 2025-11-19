import type { ComponentProps, FC } from 'react'

import { formatDate } from '@/utils/date'
import { cn } from '@/utils/style'

const OrderItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex justify-between py-2.5'>
        <div className='flex gap-2'>
          <span>เลขที่รายการ #2514814107</span>
          <span>สินค้า 9 รายการ</span>
          <span>ยอดรวม 829 บาท</span>
          <span>(กำลังรอชำระเงิน)</span>
        </div>

        <span className='cursor-pointer hover:underline'>รายละเอียด</span>
      </div>

      <span className='text-default-500'>
        วันที่ ({formatDate(new Date())})
      </span>
    </div>
  )
}

export { OrderItem }
