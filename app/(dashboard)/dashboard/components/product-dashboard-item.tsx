import { Divider } from '@heroui/divider'
import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

const ProductDashboardItem: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex flex-col gap-2', className)} {...props}>
      <div className='flex justify-between py-2.5'>
        <div className='flex items-center gap-2'>
          <img
            alt='product'
            className='size-12 rounded-full'
            src='/placeholder.svg'
          />
          <span>มังคุดกระป๋อง 565 กรัม</span>
          <span>(ยอดขายรวม 83 ชิ้น)</span>
          <span>(สต็อกคงเหลือ 3 ชิ้น)</span>
        </div>

        <span className='cursor-pointer hover:underline'>รายละเอียด</span>
      </div>

      <Divider />
    </div>
  )
}

export { ProductDashboardItem }
