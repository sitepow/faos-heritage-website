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
        <div className='flex justify-around gap-4'>
          <Image
            alt='product-image'
            height={120}
            src='/placeholder.svg'
            width={120}
          />

          <div className='flex flex-col justify-between'>
            <div className='flex flex-col'>
              <span className='line-clamp-2'>
                หน้าต่างบานเลื่อนอะลูมิเนียม 2 บาน พร้อมมุ้งลวด SS WINKING ขนาด
                120 x 110 ซม. สีเทา
              </span>

              <div className='line-clamp-2 flex gap-2 text-default-500'>
                <span>รหัสสินค้า: 60429009</span>
                <span>ราคา: {formatCurrency(4399)}/ชิ้น</span>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='flex items-center gap-4'>
                <span>จำนวน</span>
                <Quantity />
              </div>

              <span className='text-2xl font-bold text-primary-website dark:text-white'>
                {formatCurrency(13900)}
              </span>
            </div>
          </div>

          <Button
            startContent={<TrashIcon className='text-default-500' />}
            variant='light'
          />
        </div>
      </CardBody>
    </Card>
  )
}

export { CartCard }
