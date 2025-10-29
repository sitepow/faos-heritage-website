import { Divider } from '@heroui/divider'
import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

const CustomerDashboardItem: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => {
  const formatDate = () => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format()
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)} {...props}>
      <div className='flex flex-col'>
        <div className='flex justify-between py-2.5'>
          <div className='flex items-center gap-2'>
            <img
              alt='teeraphat'
              className='size-12 rounded-full'
              src='/placeholder.svg'
            />
            <span>Teeraphat Saengkum</span>
            <span>(kteeraphatt@gmail.com)</span>
          </div>

          <span className='cursor-pointer hover:underline'>รายละเอียด</span>
        </div>

        <span className='text-default-500'>วันที่ ({formatDate()})</span>
      </div>

      <Divider />
    </div>
  )
}

export { CustomerDashboardItem }
