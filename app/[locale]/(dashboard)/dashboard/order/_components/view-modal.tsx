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

import { useOrderStore } from '../store'

import { getOrder } from '@/app/[locale]/(main)/account/_components/order/action'
import { Stepper } from '@/components/stepper'
import { NO_IMAGE } from '@/utils/constants/seo'
import { formatCurrency, formatNumber } from '@/utils/helpers/number'
import { getProductUnit } from '@/utils/helpers/product'

export const OrderViewModal = () => {
  const t = useTranslations('Account.OrderView')
  const queryClient = useQueryClient()
  const { isViewOpen, onOpenViewChange, orderId, setState } = useOrderStore()

  const QUERY_KEY = {
    order: ['dashboard', 'order', orderId],
  }

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY_KEY.order,
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  })

  const CURRENCY_OPTIONS = {
    currency: order?.currency,
    locale: order?.exchangeLocale!,
  }

  const onClose = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.order })
    setState({ orderId: null })
    onOpenViewChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isViewOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={onOpenViewChange}
      classNames={{
        base: 'bg-[#f1f1f1] dark:bg-[#131314] rounded-xl shadow-sm border border-divider',
        header: 'px-8 pt-8 pb-0',
        body: 'px-8 py-6 gap-8',
        footer: 'px-8 pb-8 pt-2',
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col items-start gap-1'>
              <h2 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
                {t('title')}
              </h2>
              <p className='text-[10px] font-medium tracking-widest text-zinc-400 uppercase'>
                ID: {order?.id?.slice(-12)}
              </p>
            </ModalHeader>

            {isLoadingOrder ? (
              <ModalBody className='flex min-h-[300px] items-center justify-center'>
                <Spinner color='default' size='sm' />
              </ModalBody>
            ) : (
              <ModalBody>
                <section className='w-full py-2'>
                  <Stepper
                    createdAt={order?.createdAt!}
                    deliveredAt={order?.deliveredAt!}
                    paidAt={order?.paidAt!}
                    shippedAt={order?.shippedAt!}
                    status={order?.status!}
                  />
                </section>

                <div className='border-divider grid grid-cols-1 gap-x-12 gap-y-6 border-t pt-5 md:grid-cols-2'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-bold tracking-wider text-zinc-400 uppercase'>
                      {t('shippingAddress')}
                    </label>
                    <p className='text-sm leading-relaxed font-medium text-zinc-600 uppercase dark:text-zinc-400'>
                      {order?.shippingAddressText}
                    </p>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label className='text-[10px] font-bold tracking-wider text-zinc-400 uppercase'>
                      {t('logistics')}
                    </label>
                    {order?.trackingNumber ? (
                      <Link
                        className='dark:border-divider w-fit border-b text-sm font-bold text-zinc-900 dark:text-zinc-100'
                        href={order?.trackingWebsite ?? ''}
                        target='_blank'
                      >
                        {order?.trackingNumber}
                      </Link>
                    ) : (
                      <p className='text-sm text-zinc-300 italic'>
                        {t('preparing')}
                      </p>
                    )}
                  </div>
                </div>

                <section className='flex flex-col gap-4'>
                  <label className='text-[10px] font-bold tracking-wider text-zinc-400 uppercase'>
                    {t('productList')}
                  </label>
                  <div className='space-y-4'>
                    {order?.items?.map((item) => (
                      <div key={item?.id} className='flex items-center gap-4'>
                        <Avatar
                          radius='none'
                          className='size-12 bg-zinc-50 dark:bg-zinc-900'
                          src={item?.product?.images?.[0]?.url ?? NO_IMAGE}
                        />
                        <div className='flex flex-1 flex-col'>
                          <div className='flex items-baseline justify-between'>
                            <p className='text-sm font-medium tracking-tight text-zinc-800 uppercase dark:text-zinc-200'>
                              {item?.productName}
                            </p>
                            <p className='text-sm font-bold text-zinc-900 dark:text-zinc-100'>
                              {formatCurrency(
                                item?.price * item?.quantity,
                                CURRENCY_OPTIONS,
                              )}
                            </p>
                          </div>
                          <span className='text-[10px] font-medium text-zinc-400'>
                            {formatNumber(item?.quantity)}{' '}
                            {getProductUnit(item?.product?.unit!)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className='border-divider mt-4 space-y-2 border-t pt-6'>
                  <div className='flex justify-between text-xs font-medium text-zinc-500'>
                    <span>{t('subtotal')}</span>
                    <span>
                      {formatCurrency(
                        order?.total! - (order?.shippingCost ?? 0),
                        CURRENCY_OPTIONS,
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs font-medium text-zinc-500'>
                    <span>{t('shippingFee')}</span>
                    <span>
                      {order?.shippingCost === 0
                        ? 'Complimentary'
                        : formatCurrency(
                            order?.shippingCost ?? 0,
                            CURRENCY_OPTIONS,
                          )}
                    </span>
                  </div>
                  <div className='flex items-end justify-between pt-4'>
                    <span className='text-xs font-bold tracking-[0.1em] text-zinc-900 uppercase dark:text-zinc-100'>
                      {t('totalAmount')}
                    </span>
                    <span className='text-3xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100'>
                      {formatCurrency(order?.total ?? 0, CURRENCY_OPTIONS)}
                    </span>
                  </div>
                </section>
              </ModalBody>
            )}

            <ModalFooter className='justify-center'>
              <Button
                variant='bordered'
                startContent={<XIcon />}
                className='font-bold text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white'
                onClick={onClose}
              >
                {t('close')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
