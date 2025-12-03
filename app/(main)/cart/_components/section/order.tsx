import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'

import type { ComponentProps, FC } from 'react'

import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card fullWidth className={cn(className, 'h-fit')} {...props}>
      <CardBody className='gap-1'>
        <span className='w-fit border-b border-primary-website pb-1 font-bold'>
          รายละเอียดการชำระเงิน
        </span>

        <div className='flex justify-between text-default-500'>
          <span>ราคารวม</span>
          <span>{formatCurrency(0)}</span>
        </div>

        <div className='flex justify-between text-default-500'>
          <span>ค่าจัดส่ง</span>
          <span>{formatCurrency(0)}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='font-bold'>ราคารวมสุทธิ :</span>
          <span className='text-2xl font-bold text-primary-website'>{formatCurrency(0)}</span>
        </div>
      </CardBody>

      <CardFooter>
        <Button isDisabled fullWidth variant='faded'>
          ดำเนินการต่อ
        </Button>
      </CardFooter>
    </Card>
  )
}

export { OrderSection }
