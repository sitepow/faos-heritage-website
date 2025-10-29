import { Divider } from '@heroui/divider'
import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

const OrderDashboardItem: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  const formatDate = () => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format()
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)} {...props}>
      <div className='flex flex-col'>
        <div className='flex justify-between py-2.5'>
          <div className='flex gap-2'>
            <span>เลขที่รายการ #2514814107</span>
            <span>สินค้า 9 รายการ</span>
            <span>ยอดรวม 829 บาท</span>
            <span>(กำลังรอชำระเงิน)</span>
          </div>

          <span className='cursor-pointer hover:underline'>รายละเอียด</span>
        </div>

        <span className='text-default-500'>วันที่ ({formatDate()})</span>
      </div>

      <Divider />
    </div>
  )
}

export { OrderDashboardItem }
