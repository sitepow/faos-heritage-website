import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'

import { Stepper } from '@/components/stepper'
import { formatDate } from '@/utils/date'
import { formatCurrency, formatNumber } from '@/utils/number'

const Order = () => {
  const steps = ['สั่งซื้อสินค้า', 'จัดสินค้า', 'พร้อมนำส่ง', 'รับสินค้าแล้ว']

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3 bg-divider p-2.5'>
        <div className='flex flex-wrap gap-3'>
          <AvatarGroup max={3}>
            <Avatar src='/placeholder.svg' />
            <Avatar src='/placeholder.svg' />
            <Avatar src='/placeholder.svg' />
            <Avatar src='/placeholder.svg' />
          </AvatarGroup>

          <div className='flex flex-col'>
            <span>
              เลขที่รายการ 2452587200 ({formatNumber(10)} รายการ){' '}
              {formatCurrency(829)}
            </span>
            <span className='text-default-500'>
              วันที่สั่งซื้อ {formatDate(new Date())} (ชำระเงินแล้ว)
            </span>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button variant='faded'>ซื้ออีกครั้ง</Button>
          <Button variant='faded'>รายละเอียด</Button>
        </div>
      </div>

      <Stepper currentStep={0} steps={steps} />
    </div>
  )
}

export { Order }
