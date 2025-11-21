import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { Quantity } from '@/components/quantity'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const CartCard: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card
      fullWidth
      className={cn(
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      radius='none'
      shadow='none'
      {...props}
    >
      <CardBody>
        <div className='flex flex-wrap items-center justify-start gap-4 lg:flex-nowrap lg:justify-around'>
          <div className='flex flex-wrap gap-5 sm:flex-nowrap'>
            <Image
              alt='product-image'
              className='shrink-0 object-cover'
              height={150}
              src='/placeholder.svg'
              width={150}
            />

            <div className='flex flex-col justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='line-clamp-1'>
                  หน้าต่างบานเลื่อนอะลูมิเนียม 2 บาน พร้อมมุ้งลวด SS WINKING
                  ขนาด 120 x 110 ซม. สีเทา
                </span>

                <div className='flex flex-col text-default-500 sm:flex-row sm:gap-2'>
                  <span>รหัสสินค้า: 60429009</span>
                  <span>ราคา: {formatCurrency(4399)}/ชิ้น</span>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-3'>
                <Quantity />
                <span className='text-lg font-bold text-primary-website sm:text-2xl'>
                  {formatCurrency(52320)}
                </span>
              </div>
            </div>
          </div>

          <Button
            className='w-full lg:w-fit'
            startContent={<TrashIcon className='text-default-500' />}
            variant='faded'
          />
        </div>
      </CardBody>
    </Card>
  )
}

export { CartCard }
