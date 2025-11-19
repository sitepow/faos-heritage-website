import { Button } from '@heroui/button'
import { useState } from 'react'

import { Stepper } from '@/components/stepper'
import { formatCurrency, formatNumber } from '@/utils/number'

const Order = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = ['สั่งซื้อสินค้า', 'จัดสินค้า', 'พร้อมนำส่ง', 'รับสินค้าแล้ว']

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-5 bg-divider p-2.5'>
        <div className='flex flex-col'>
          <span>เลขที่รายการ</span>
          <span>2452587200</span>
        </div>

        <div className='flex flex-col'>
          <span>วันที่สั่งซื้อ</span>
          <span>15/11/2024 07:10:43</span>
        </div>

        <div className='flex flex-col'>
          <span>สินค้า</span>
          <span>{formatNumber(10)} รายการ</span>
        </div>

        <div className='flex flex-col'>
          <span>ยอดรวม</span>
          <span>{formatCurrency(829)}</span>
        </div>

        <div className='flex gap-2'>
          <Button variant='faded'>ซื้ออีกครั้ง</Button>
          <Button variant='faded'>รายละเอียด</Button>
        </div>
      </div>

      <Stepper currentStep={currentStep} steps={steps} />
    </div>
  )
}

export { Order }
