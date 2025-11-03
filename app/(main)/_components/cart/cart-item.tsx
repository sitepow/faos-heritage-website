import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import clsx from 'clsx'
import { CircleMinus, CirclePlus, TrashIcon } from 'lucide-react'
import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { formatNumber } from '@/utils/number'

const CartItem: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card fullWidth className={clsx(className)} shadow='none' {...props}>
      <CardBody className='flex flex-row items-center justify-around gap-5'>
        <Image
          alt='product-image'
          height={120}
          src='/placeholder.svg'
          width={120}
        />

        <div className='flex flex-col gap-2 font-bold'>
          <div className='flex gap-2'>
            <span>
              หน้าต่างบานเลื่อนอะลูมิเนียม 2 บาน พร้อมมุ้งลวด SS WINKING ขนาด
              120 x 110 ซม. สีเทา
            </span>
          </div>

          <div className='flex gap-2'>
            <span className='text-default-500'>รหัสสินค้า: 60429009</span>
            <span className='text-default-500'>
              ราคา: {formatNumber(4399)}/each
            </span>
          </div>

          <div className='flex justify-between'>
            <div className='flex items-center gap-4'>
              <span>จำนวน</span>

              <div className='flex items-center gap-2'>
                <CirclePlus className='text-default-500 cursor-pointer' />
                <Input className='w-24' defaultValue='1' />
                <CircleMinus className='text-default-500 cursor-pointer' />
              </div>
            </div>

            <span className='text-2xl font-bold text-red-800'>
              รวม {formatNumber(13900)}
            </span>
          </div>
        </div>

        <TrashIcon className='text-default-500 shrink-0 cursor-pointer' />
      </CardBody>
    </Card>
  )
}

export { CartItem }
