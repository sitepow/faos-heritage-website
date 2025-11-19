import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { formatDate } from '@/utils/date'
import { cn } from '@/utils/style'

const CustomerItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex justify-between py-2.5'>
        <div className='flex items-center gap-2'>
          <Image
            alt='teeraphat'
            className='size-12 rounded-full'
            height={100}
            src='/placeholder.svg'
            width={100}
          />
          <span>Teeraphat Saengkum</span>
          <span>(kteeraphatt@gmail.com)</span>
        </div>

        <span className='cursor-pointer hover:underline'>รายละเอียด</span>
      </div>

      <span className='text-default-500'>
        วันที่ ({formatDate(new Date())})
      </span>
    </div>
  )
}

export { CustomerItem }
