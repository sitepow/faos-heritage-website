'use client'

import { AvatarGroup, Avatar, Button, Alert } from '@heroui/react'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import {
  ArrowUpRightIcon,
  CreditCardIcon,
  DownloadIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { GetOrderResult } from '@/app/(dashboard)/dashboard/order/action'

import { createStripeCheckout } from '@/actions/stripe'
import { useOrderStore } from '@/app/(dashboard)/dashboard/order/store'
import { CountryFlag } from '@/components/common/country-flag'
import { Stepper } from '@/components/common/stepper'
// import { OmisePaymentButton } from '@/components/features/omise/payment-button'
import { NO_IMAGE } from '@/utils/constants'
import { formatDate } from '@/utils/date'
import { getOrderStatus } from '@/utils/features'
import { formatCurrency, formatNumber } from '@/utils/number'

interface OrderItemProps {
  order: GetOrderResult
  hideButton?: boolean
}

const DISABLE_RECEIPT_STATUSES: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.REFUNDED,
]

export const OrderItem = ({ order, hideButton }: OrderItemProps) => {
  const CURRENCY_OPTIONS = {
    currency: order?.currency,
    locale: order?.exchangeLocale!,
  }

  const router = useRouter()
  const { onOpenViewChange, onOpenOrderCancelChange, setState } =
    useOrderStore()

  const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
    mutationFn: () => createStripeCheckout({ orderId: order?.id! }),
    onSuccess: (result) => {
      if (result.success) {
        router.push(result.data.checkoutUrl)
      }
    },
  })

  const productImages = order.items?.map(
    (item) => item.product?.images?.[0]?.url ?? NO_IMAGE,
  )

  const isDisableReceipt = DISABLE_RECEIPT_STATUSES.includes(order.status)

  return (
    <div className='flex flex-col gap-4'>
      {order?.status === OrderStatus.PENDING && (
        <Alert
          description='Please complete your payment within 20 minutes. Otherwise, your order will be automatically canceled.
'
          color='warning'
          variant='faded'
        />
      )}

      <div className='border-divider flex flex-wrap items-center justify-between gap-3 border-b p-2.5'>
        <div className='flex flex-wrap gap-3 sm:col-span-2'>
          <AvatarGroup max={4} isBordered>
            <CountryFlag countryCode={order?.address?.countryCode!} />
            {productImages.map((src) => (
              <Avatar size='sm' key={src} src={src} />
            ))}
          </AvatarGroup>

          <div className='flex flex-col'>
            <span>
              Item number {order?.id} ({formatNumber(order?.items?.length)}{' '}
              list) {formatCurrency(order?.total, CURRENCY_OPTIONS)}
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
                  Tracking number <span>{order.trackingNumber}</span>
                </Link>
              )}
            </span>
          </div>
        </div>

        {!hideButton && (
          <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
            <Button
              color='primary'
              variant='bordered'
              startContent={<ArrowUpRightIcon className='shrink-0' />}
              onClick={() => {
                setState({ orderId: order?.id })
                onOpenViewChange()
              }}
            >
              Order details
            </Button>
            {order?.status === OrderStatus.PENDING && (
              <Button
                color='primary'
                variant='bordered'
                startContent={<XIcon className='shrink-0' />}
                onClick={() => {
                  setState({ orderId: order?.id })
                  onOpenOrderCancelChange()
                }}
              >
                Cancel order
              </Button>
            )}
            {order?.status === OrderStatus.PENDING && (
              <Button
                color='primary'
                variant='bordered'
                isDisabled={isPendingCheckout}
                isLoading={isPendingCheckout}
                startContent={
                  !isPendingCheckout && <CreditCardIcon className='shrink-0' />
                }
                onClick={() => {
                  mutateCheckout()
                }}
              >
                Pay now
              </Button>

              // <OmisePaymentButton
              //   orderId={order.id}
              //   amount={order.total}
              //   currency='THB'
              //   buttonText='Pay now'
              // />
            )}
            {order?.status !== OrderStatus.PENDING && (
              <Button
                color='primary'
                variant='bordered'
                isDisabled={isDisableReceipt}
                startContent={<DownloadIcon className='shrink-0' />}
              >
                Download receipt
              </Button>
            )}
          </div>
        )}
      </div>

      <Stepper
        className='p-5'
        createdAt={order?.createdAt!}
        deliveredAt={order?.deliveredAt!}
        paidAt={order?.paidAt!}
        shippedAt={order?.shippedAt!}
        status={order.status}
      />
    </div>
  )
}
