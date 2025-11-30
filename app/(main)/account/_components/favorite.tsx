import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { Price } from '@/components/price'
import { cn } from '@/utils/style'

const Favorite: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card
      fullWidth
      className={cn(className, '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider')}
      radius='none'
      shadow='none'
      {...props}
    >
      <CardBody>
        <div className='flex flex-wrap justify-between gap-4'>
          <div className='flex flex-wrap gap-4 lg:max-w-1/2 lg:flex-nowrap'>
            <Image
              alt='product-image'
              className='size-32 rounded-xl'
              height={100}
              src='/placeholder.svg'
              width={100}
            />

            <div className='flex flex-col *:line-clamp-1'>
              <span>MICRON WARE</span>
              <span className='text-sm text-default-500'>
                ล่องอเนกประสงค์ซ้อนได้พร้อมฝาล็อก MICRON WARE รุ่น JCP-6658 ความจุ 10.5 ลิตร สีขาว
              </span>
              <span className='text-sm text-default-500'>รหัสสินค้า : 60188416</span>
              <Price price={250} />
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button variant='faded'>เพิ่มเข้าตระกร้า</Button>
            <Button variant='faded'>ลบจากรายการโปรด</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { Favorite }
