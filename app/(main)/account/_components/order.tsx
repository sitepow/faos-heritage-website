import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'
import Link from 'next/link'

import type { GetOrderResult } from '@/app/(dashboard)/dashboard/order/actions/order'
import type { FC } from 'react'

import { useOrderStore } from '@/app/(dashboard)/dashboard/order/store'
import { Stepper } from '@/components/stepper'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/helper'
import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  order: GetOrderResult
  hideButton?: boolean
}

const Order: FC<Props> = ({ order, hideButton }) => {
  const { onOpenViewChange, setState } = useOrderStore()

  const productImages = order.items?.map(
    (item) => item.product?.images?.[0]?.url ?? '/placeholder.svg',
  )

  const orderInfo = {
    id: order.id,
    totalItems: order.items.length,
    totalPrice: formatCurrency(order.total),
    createdAt: formatDate(order.createdAt),
    statusText: getOrderStatus(order.status),
  }

  const trackingInfo = order.trackingNumber && (
    <Link
      className='underline'
      href={order.trackingWebsite ?? ''}
      target='_blank'
    >
      หมายเลขสำหรับติดตามสินค้า{' '}
      <span className='text-primary-website'>{order.trackingNumber}</span>
    </Link>
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid items-center gap-3 bg-divider p-2.5 sm:grid-cols-3'>
        <div className='flex flex-wrap gap-3 sm:col-span-2'>
          <AvatarGroup max={3}>
            {productImages.map((src) => (
              <Avatar key={src} src={src} />
            ))}
          </AvatarGroup>

          <div className='flex flex-col'>
            <span>
              เลขที่รายการ {orderInfo.id} ({formatNumber(orderInfo.totalItems)}{' '}
              รายการ) {orderInfo.totalPrice}
            </span>

            <span className='text-default-500'>
              วันที่สั่งซื้อ {orderInfo.createdAt} ({orderInfo.statusText}){' '}
              {trackingInfo}
            </span>
          </div>
        </div>

        {!hideButton && (
          <div className='flex items-center gap-2 sm:justify-end'>
            <Button
              variant='faded'
              onClick={() => {
                setState({ orderId: order?.id })
                onOpenViewChange()
              }}
            >
              รายละเอียด
            </Button>
            <Button variant='faded'>ชำระเงินสินค้า</Button>
          </div>
        )}
      </div>

      <Stepper
        createdAt={order?.createdAt!}
        deliveredAt={order?.deliveredAt!}
        paidAt={order?.paidAt!}
        shippedAt={order?.shippedAt!}
        status={order.status}
      />
    </div>
  )
}

export { Order }
