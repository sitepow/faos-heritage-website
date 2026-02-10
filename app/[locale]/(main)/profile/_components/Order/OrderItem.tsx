'use client'

import { Button, Alert } from '@heroui/react'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, ArrowUpRightIcon, DownloadIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import type { Order } from '@/features/order/useOrder'

import { createStripeCheckout } from '@/app/actions/stripe'
import { AvatarGroupWrapper } from '@/components/ui/AvatarGroupWrapper'
import { OrderStepper } from '@/components/ui/OrderStepper/OrderStepper'
import { IMAGE_FALLBACK } from '@/constants'
import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { formatDate } from '@/utils/date'
import { formatCurrency, formatNumber } from '@/utils/number'

interface Props {
  order: Order
  hideButton?: boolean
}

const DISABLE_RECEIPT_STATUSES: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.REFUNDED,
]

const OrderItem = ({ order, hideButton }: Props) => {
  const t = useTranslations('orders')
  const tField = useTranslations('fields')
  const tProductUnit = useTranslations('global.productUnit')
  const tOrderStatus = useTranslations('global.orderStatus')

  const router = useRouter()

  const isPending = order?.status === OrderStatus.PENDING
  const isDisableReceipt = DISABLE_RECEIPT_STATUSES.includes(order.status)

  const productImages = useMemo(
    () =>
      order.items?.map(
        (item) => item.product?.images?.[0]?.url ?? IMAGE_FALLBACK.EMPTY,
      ),
    [order.items],
  )

  const { currencyOptions } = useExchangeRate()

  const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
    mutationFn: () => createStripeCheckout({ orderId: order?.id! }),
    onSuccess: (result) => {
      if (result.success) {
        router.push(result.data.checkoutUrl)
      }
    },
  })

  const renderActions = () => {
    if (hideButton) {
      return null
    }

    return (
      <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
        <Button
          color='primary'
          size='sm'
          startContent={<ArrowUpRightIcon />}
          variant='bordered'
        >
          {t('actions.view')}
        </Button>
        {isPending && (
          <>
            <Button
              color='danger'
              size='sm'
              startContent={<XIcon />}
              variant='bordered'
            >
              {t('actions.cancel')}
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              endContent={!isPendingCheckout && <ArrowRight />}
              isLoading={isPendingCheckout}
              size='sm'
              onPress={() => mutateCheckout()}
            >
              {t('actions.payNow')}
            </Button>
          </>
        )}

        {!isPending && (
          <Button
            color='default'
            isDisabled={!isDisableReceipt}
            size='sm'
            startContent={<DownloadIcon />}
            variant='bordered'
          >
            {t('actions.downloadReceipt')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='border-default-100 hover:bg-default-50/50 flex flex-col gap-4 rounded-xl border p-4 transition-all'>
      {isPending && (
        <Alert
          color='warning'
          description={t('paymentAlert')}
          variant='faded'
        />
      )}

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-1 flex-wrap gap-4'>
          <AvatarGroupWrapper images={productImages} max={3} />

          <div className='flex flex-col gap-0.5'>
            <p className='text-sm font-semibold'>
              {tField('orderId')} #{order?.id.slice(-8).toUpperCase()}
              <span className='ml-2'>
                ({formatNumber(order?.items?.length)} {tProductUnit('ITEM')})
              </span>
            </p>
            <p className='text-default-500 text-xs'>
              {formatDate(order.createdAt)} •
              <span className='text-primary ml-1 font-medium'>
                {tOrderStatus(order.status)}
              </span>
            </p>
          </div>
        </div>

        <div className='text-right'>
          <p className='text-primary text-lg font-bold'>
            {formatCurrency(order?.total, currencyOptions)}
          </p>
        </div>
      </div>

      <div className='bg-default-50 rounded-lg'>
        <OrderStepper
          className='py-5'
          createdAt={order?.createdAt!}
          deliveredAt={order?.deliveredAt!}
          paidAt={order?.paidAt!}
          shippedAt={order?.shippedAt!}
          status={order.status}
        />
      </div>

      <div className='border-default-100 border-t pt-4'>{renderActions()}</div>
    </div>
  )
}

export { OrderItem }
