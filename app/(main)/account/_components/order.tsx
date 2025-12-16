import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { GetOrderResult } from '@/app/(dashboard)/dashboard/order/actions/order'
import type { FC } from 'react'

import { createStripeCheckout } from '@/actions/stripe'
import { useOrderStore } from '@/app/(dashboard)/dashboard/order/store'
import { Stepper } from '@/components/stepper'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/helper'
import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  order: GetOrderResult
  hideButton?: boolean
}

const DISABLE_RECEIPT_STATUSES: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.REFUNDED,
]

const Order: FC<Props> = ({ order, hideButton }) => {
  const router = useRouter()
  const { onOpenViewChange, onOpenOrderCancelChange, setState } =
    useOrderStore()

  const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
    mutationFn: () => createStripeCheckout({ orderId: order?.id! }),
    onSuccess: ({ checkoutUrl }) => {
      if (checkoutUrl) {
        router.push(checkoutUrl)
      }
    },
  })

  const productImages = order.items?.map(
    (item) => item.product?.images?.[0]?.url ?? '/no-image.png',
  )

  const isDisableReceipt = DISABLE_RECEIPT_STATUSES.includes(order.status)

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
              Item number {order?.id} ({formatNumber(order?.items?.length)}{' '}
              list) {formatCurrency(order?.total)}
            </span>

            <span className='text-default-500'>
              Order date {formatDate(order.createdAt)} (
              {getOrderStatus(order.status)}){' '}
              {order.trackingNumber && (
                <Link
                  className='underline'
                  href={order.trackingWebsite ?? ''}
                  target='_blank'
                >
                  Tracking number{' '}
                  <span className='text-primary'>{order.trackingNumber}</span>
                </Link>
              )}
            </span>
          </div>
        </div>

        {!hideButton && (
          <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
            <Button
              className='bg-white text-primary dark:bg-divider'
              color='primary'
              variant='bordered'
              onClick={() => {
                setState({ orderId: order?.id })
                onOpenViewChange()
              }}
            >
              Details
            </Button>
            {order?.status === OrderStatus.PENDING && (
              <Button
                className='bg-white text-primary dark:bg-divider'
                color='primary'
                variant='bordered'
                onClick={() => {
                  setState({ orderId: order?.id })
                  onOpenOrderCancelChange()
                }}
              >
                Cancel order / Change of mind
              </Button>
            )}
            {order?.status === OrderStatus.PENDING && (
              <Button
                className='bg-white text-primary dark:bg-divider'
                color='primary'
                isDisabled={isPendingCheckout}
                isLoading={isPendingCheckout}
                variant='bordered'
                onClick={() => {
                  mutateCheckout()
                }}
              >
                Pay for the goods
              </Button>
            )}
            {order?.status !== OrderStatus.PENDING && (
              <Button
                className='bg-white text-primary dark:bg-divider'
                color='primary'
                isDisabled={isDisableReceipt}
                variant='bordered'
              >
                Download the receipt
              </Button>
            )}
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
