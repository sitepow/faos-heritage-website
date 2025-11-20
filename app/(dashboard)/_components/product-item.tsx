import { Button } from '@heroui/button'
import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const ProductItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-between gap-3 py-2 md:flex-nowrap',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex gap-3'>
        <Image
          alt='product-image'
          className='size-12 rounded-full'
          height={100}
          src='/placeholder.svg'
          width={100}
        />

        <div className='flex flex-col *:line-clamp-1'>
          <span>มังคุดกระป๋อง 565 กรัม</span>
          <span className='text-default-500'>
            (ยอดขายรวม 83 ชิ้น) (สต็อกคงเหลือ 3 ชิ้น)
          </span>
        </div>
      </div>

      <Button className='shrink-0' variant='faded'>
        รายละเอียด
      </Button>
    </div>
  )
}

export { ProductItem }
