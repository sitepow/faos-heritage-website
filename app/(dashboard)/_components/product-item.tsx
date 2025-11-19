import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const ProductItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex justify-between py-2.5',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        <Image
          alt='product-image'
          className='size-12 rounded-full'
          height={100}
          src='/placeholder.svg'
          width={100}
        />
        <span>มังคุดกระป๋อง 565 กรัม</span>
        <span>(ยอดขายรวม 83 ชิ้น)</span>
        <span>(สต็อกคงเหลือ 3 ชิ้น)</span>
      </div>

      <span className='cursor-pointer hover:underline'>รายละเอียด</span>
    </div>
  )
}

export { ProductItem }
