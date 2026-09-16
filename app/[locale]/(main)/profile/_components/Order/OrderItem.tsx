'use client'

import { Button, Alert, useDisclosure } from '@heroui/react'
import { OrderStatus } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, ArrowUpRightIcon, DownloadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import type { Order } from '@/features/order/hook'

import { createStripeCheckout } from '@/app/actions/stripe'
import { AvatarGroupWrapper } from '@/components/ui/AvatarGroupWrapper'
import { OrderDetailsModal } from '@/components/ui/OrderDetailsModal/OrderDetailsModal'
import { OrderStepper } from '@/components/ui/OrderStepper/OrderStepper'
import { IMAGE_FALLBACK } from '@/constants'
import { useExchangeRate } from '@/features/exchange-rate/hook'
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

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isPending = order?.status === OrderStatus.PENDING
  const isDisableReceipt = DISABLE_RECEIPT_STATUSES.includes(order.status)
  const hasDiscount = order.discount > 0

  const productImages = useMemo(
    () =>
      order.items?.map(
        (item) => item.product?.images?.[0]?.url ?? IMAGE_FALLBACK.EMPTY,
      ),
    [order.items],
  )

  const { currencyOptions } = useExchangeRate({
    currency: order.currency,
    locale: order.exchangeLocale || undefined,
  })

  const { mutate: mutateCheckout, isPending: isPendingCheckout } = useMutation({
    mutationFn: () => createStripeCheckout({ orderId: order?.id! }),
    onSuccess: (result) => {
      if (result.success) {
        window.location.href = result.data.checkoutUrl
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
          startContent={<ArrowUpRightIcon size={16} />}
          variant='bordered'
          onPress={onOpen}
        >
          {t('actions.view')}
        </Button>

        {isPending && (
          <Button
            className='text-secondary'
            color='primary'
            endContent={!isPendingCheckout && <ArrowRight size={16} />}
            isLoading={isPendingCheckout}
            size='sm'
            onPress={() => mutateCheckout()}
          >
            {t('actions.payNow')}
          </Button>
        )}

        {!isPending && (
          <Button
            color='default'
            isDisabled={!isDisableReceipt}
            size='sm'
            startContent={<DownloadIcon size={16} />}
            variant='bordered'
          >
            {t('actions.downloadReceipt')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='border-default-100 flex flex-col gap-5 rounded-xl border p-4'>
      {isPending && (
        <Alert
          color='warning'
          description={t('paymentAlert')}
          variant='faded'
        />
      )}

      <div className='flex flex-col flex-wrap gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-wrap items-center gap-5'>
          <AvatarGroupWrapper images={productImages} max={3} />

          <div className='flex flex-col gap-0.5'>
            <p className='text-foreground text-sm font-semibold uppercase'>
              {tField('orderId')} #{order?.id.slice(-8).toUpperCase()}
              <span className='text-default-500 ml-2 font-normal lowercase'>
                ({formatNumber(order?.items?.length)} {tProductUnit('ITEM')})
              </span>
            </p>
            <p className='text-default-500 text-xs'>
              {formatDate(order.createdAt)} •
              <span className='text-primary ml-1 font-medium uppercase'>
                {tOrderStatus(order.status)}
              </span>
            </p>
          </div>
        </div>

        <div className='text-right'>
          <div className='flex flex-col items-end gap-0'>
            <p className='text-primary text-lg font-bold'>
              {formatCurrency(order?.total, {
                ...currencyOptions,
                skipCalculation: true,
              })}
            </p>
            {hasDiscount && (
              <p className='text-default-400 text-xs font-normal line-through'>
                {formatCurrency(Number(order.total) + Number(order.discount), {
                  ...currencyOptions,
                  skipCalculation: true,
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='bg-default-50 rounded-lg'>
        <OrderStepper
          className='py-5'
          createdAt={order?.createdAt!}
          deliveredAt={order?.deliveredAt!}
          deliveryType={order.deliveryType}
          paidAt={order.paidAt}
          pickupDate={order.pickupDate}
          shippedAt={order?.shippedAt!}
          status={order.status}
        />
      </div>

      <div className='border-default-100 border-t pt-4'>{renderActions()}</div>

      <OrderDetailsModal isOpen={isOpen} order={order} onClose={onClose} />
    </div>
  )
}

export { OrderItem }
