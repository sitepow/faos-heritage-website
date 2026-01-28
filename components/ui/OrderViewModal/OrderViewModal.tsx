'use client'

import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@heroui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { OrderStepper } from '../OrderStepper/OrderStepper'
import { InfoBlock } from './_components/InfoBlock'
import { Label } from './_components/Label'
import { SummaryRow } from './_components/SummaryRow'

import { getOrder } from '@/app/[locale]/(main)/profile/_components/order/action'
import { IMAGE_FALLBACK } from '@/constants/app'
import { orderQueryKeys } from '@/features/order/order.query-key'
import { useOrderStore } from '@/features/order/order.store'
import { resolveProductUnitLabel } from '@/utils/app'
import { formatCurrency, formatNumber } from '@/utils/number'

const OrderViewModal = () => {
  const translate = useTranslations('Account.OrderView')
  const queryClient = useQueryClient()
  const { isViewOpen, onOpenViewChange, orderId, setState } = useOrderStore()

  const { data: order, isLoading } = useQuery({
    queryKey: orderQueryKeys.detail.byId(orderId!),
    queryFn: () => getOrder(orderId as string),
    enabled: Boolean(orderId),
  })

  const currencyOptions = useMemo(() => {
    if (!order || !currencyOptions) {
      return null
    }

    return {
      currency: order.currency,
      locale: order.exchangeLocale ?? undefined,
    }
  }, [order])

  const handleClose = () => {
    if (orderId) {
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.detail.byId(orderId!),
      })
    }
    setState({ orderId: null })
    onOpenViewChange()
  }

  return (
    <Modal
      hideCloseButton
      classNames={{
        base: 'bg-[#f1f1f1] dark:bg-[#131314] rounded-xl shadow-sm border border-divider',
        header: 'px-8 pt-8 pb-0',
        body: 'px-8 py-6 gap-8',
        footer: 'px-8 pb-8 pt-2',
      }}
      isDismissable={false}
      isOpen={isViewOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={onOpenViewChange}
    >
      <ModalContent>
        {() => {
          if (isLoading) {
            return (
              <ModalBody className='flex min-h-[300px] items-center justify-center'>
                <Spinner size='sm' />
              </ModalBody>
            )
          }

          if (!order || !currencyOptions) {
            return null
          }

          return (
            <>
              <ModalHeader className='flex flex-col items-start gap-1'>
                <h2 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                  {translate('title')}
                </h2>
                <p className='text-[10px] font-medium tracking-widest text-zinc-400 uppercase'>
                  ID: {order.id.slice(-12)}
                </p>
              </ModalHeader>

              <ModalBody>
                <OrderStepper {...order} />

                <div className='border-divider grid grid-cols-1 gap-x-12 gap-y-6 border-t pt-5 md:grid-cols-2'>
                  <InfoBlock label={translate('shippingAddress')}>
                    {order.shippingAddressText}
                  </InfoBlock>

                  <InfoBlock label={translate('logistics')}>
                    {order.trackingNumber ? (
                      <Link
                        className='border-b text-sm font-bold'
                        href={order.trackingWebsite ?? '#'}
                        target='_blank'
                      >
                        {order.trackingNumber}
                      </Link>
                    ) : (
                      <span className='text-zinc-300 italic'>
                        {translate('preparing')}
                      </span>
                    )}
                  </InfoBlock>
                </div>

                <section className='space-y-4'>
                  <Label>{translate('productList')}</Label>

                  {order.items.map((item) => (
                    <div key={item.id} className='flex items-center gap-4'>
                      <Avatar
                        className='size-12 bg-zinc-50 dark:bg-zinc-900'
                        radius='none'
                        src={
                          item.product?.images?.[0]?.url ?? IMAGE_FALLBACK.EMPTY
                        }
                      />

                      <div className='flex flex-1 justify-between'>
                        <div>
                          <p className='text-sm font-medium uppercase'>
                            {item.productName}
                          </p>
                          <span className='text-[10px] text-zinc-400'>
                            {formatNumber(item.quantity)}{' '}
                            {resolveProductUnitLabel(item.product?.unit!)}
                          </span>
                        </div>

                        <p className='font-bold'>
                          {formatCurrency(
                            item.price * item.quantity,
                            currencyOptions,
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>

                <section className='border-divider mt-6 space-y-2 border-t pt-6'>
                  <SummaryRow
                    label={translate('subtotal')}
                    value={formatCurrency(
                      order.total - (order.shippingCost ?? 0),
                      currencyOptions,
                    )}
                  />

                  <SummaryRow
                    label={translate('shippingFee')}
                    value={
                      order.shippingCost === 0
                        ? 'Complimentary'
                        : formatCurrency(
                            order.shippingCost ?? 0,
                            currencyOptions,
                          )
                    }
                  />

                  <div className='flex justify-between pt-4'>
                    <span className='text-xs font-bold tracking-widest uppercase'>
                      {translate('totalAmount')}
                    </span>
                    <span className='text-3xl font-bold'>
                      {formatCurrency(order.total, currencyOptions)}
                    </span>
                  </div>
                </section>
              </ModalBody>

              <ModalFooter className='justify-center'>
                <Button
                  startContent={<XIcon />}
                  variant='bordered'
                  onClick={handleClose}
                >
                  {translate('close')}
                </Button>
              </ModalFooter>
            </>
          )
        }}
      </ModalContent>
    </Modal>
  )
}

export { OrderViewModal }
