import { Button } from '@heroui/button'
import Image from 'next/image'

import type { ComponentProps, FC } from 'react'

import { formatDate } from '@/utils/date'
import { cn } from '@/utils/style'

const CustomerItem: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'flex flex-col py-2',
        className,
        '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
      )}
      {...props}
    >
      <div className='flex flex-wrap justify-between gap-3 md:flex-nowrap'>
        <div className='flex gap-3'>
          <Image
            alt='teeraphat'
            className='size-12 rounded-full'
            height={100}
            src='/placeholder.svg'
            width={100}
          />

          <div className='flex flex-col *:line-clamp-1'>
            <span>Teeraphat Saengkum (kteeraphatt@gmail.com)</span>
            <span className='text-default-500'>
              วันที่ ({formatDate(new Date())})
            </span>
          </div>
        </div>

        <Button className='shrink-0' variant='faded'>
          รายละเอียด
        </Button>
      </div>
    </div>
  )
}

export { CustomerItem }
