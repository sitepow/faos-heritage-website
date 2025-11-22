import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'

import type { ComponentProps, FC } from 'react'

import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  return (
    <Card fullWidth className={cn(className, 'h-fit')} {...props}>
      <CardHeader className='gap-5'>
        <Input label='ใส่โค้ดหรือกดใช้คูปอง' />
        <Button className='shrink-0' variant='faded'>
          ใช้คูปอง
        </Button>
      </CardHeader>

      <CardBody className='gap-1'>
        <span className='w-fit border-b border-primary-website pb-1 font-bold'>
          รายละเอียดการชำระเงิน
        </span>

        <div className='flex justify-between text-default-500'>
          <span>ราคารวม</span>
          <span>{formatCurrency(3990)}</span>
        </div>

        <div className='flex justify-between text-default-500'>
          <span>ค่าจัดส่ง</span>
          <span>{formatCurrency(250)}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='font-bold'>ราคารวมสุทธิ :</span>
          <span className='text-2xl font-bold text-primary-website'>
            {formatCurrency(3990)}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <Button fullWidth variant='faded'>
          ดำเนินการต่อ
        </Button>
      </CardFooter>
    </Card>
  )
}

export { OrderSection }
