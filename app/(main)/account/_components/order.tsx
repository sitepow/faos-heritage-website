import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'

import type { GetOrderResult } from '@/actions/order'
import type { FC } from 'react'

import { Stepper } from '@/components/stepper'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/helper'
import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  order: GetOrderResult
  hideButton?: boolean
}

const Order: FC<Props> = ({ order, hideButton }) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid items-center gap-3 bg-divider p-2.5 sm:grid-cols-3'>
        <div className='flex flex-wrap gap-3 sm:col-span-2'>
          <AvatarGroup max={3}>
            {order?.items?.map((item) => (
              <Avatar
                key={item?.product?.images?.[0]?.url}
                src={item?.product?.images?.[0]?.url ?? '/placeholder.svg'}
              />
            ))}
          </AvatarGroup>

          <div className='flex flex-col'>
            <span className='line-clamp-2'>
              เลขที่รายการ {order?.id} ({formatNumber(order?.items?.length)}{' '}
              รายการ) {formatCurrency(order?.total)} (ชื่อลูกค้า{' '}
              {order?.user?.name})
            </span>
            <span className='text-default-500'>
              วันที่สั่งซื้อ {formatDate(order?.createdAt)} (
              {getOrderStatus(order.status)})
            </span>
          </div>
        </div>

        {!hideButton && (
          <div className='flex items-center gap-2 sm:justify-center'>
            <Button variant='faded'>รายละเอียด</Button>
            <Button variant='faded'>ชำระเงิน</Button>
          </div>
        )}
      </div>

      <Stepper currentStep={order.status} />
    </div>
  )
}

export { Order }
