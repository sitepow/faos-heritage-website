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
  Divider,
} from '@heroui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useOrderStore } from '../store'

import { getOrder } from '@/app/[locale]/(main)/account/_components/order/action'
import { Stepper } from '@/components/common/stepper'
import { NO_IMAGE } from '@/utils/constants'
import { getProductUnit } from '@/utils/features/product/helpers'
import { formatCurrency, formatNumber } from '@/utils/number'

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
    >
      <ModalContent>
        <ModalHeader className='border-divider flex flex-col gap-1 border-b'>
          {t('title')}
          <span className='text-default-400 text-sm font-normal'>
            {t('orderId')}: {order?.id}
          </span>
        </ModalHeader>

        {isLoadingOrder ? (
          <ModalBody className='flex items-center justify-center py-10'>
            <Spinner label={t('loading')} />
          </ModalBody>
        ) : (
          <ModalBody className='gap-6 py-4'>
            <section>
              <Stepper
                createdAt={order?.createdAt!}
                deliveredAt={order?.deliveredAt!}
                paidAt={order?.paidAt!}
                shippedAt={order?.shippedAt!}
                status={order?.status!}
              />
            </section>

            <Divider />

            <section className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <h4 className='text-default-500 text-sm font-bold uppercase'>
                  {t('shippingAddress')}
                </h4>
                <p className='text-sm'>{order?.shippingAddressText}</p>
              </div>
              <div className='flex flex-col gap-1'>
                <h4 className='text-default-500 text-sm font-bold uppercase'>
                  {t('logistics')}
                </h4>
                {order?.trackingNumber ? (
                  <div className='flex flex-col text-sm'>
                    <span>{t('trackingNo')}:</span>
                    <Link
                      className='text-primary font-medium underline'
                      href={order?.trackingWebsite ?? ''}
                      target='_blank'
                    >
                      {order?.trackingNumber}
                    </Link>
                  </div>
                ) : (
                  <p className='text-default-400 text-sm'>{t('preparing')}</p>
                )}
              </div>
            </section>

            <section className='flex flex-col gap-3'>
              <h4 className='text-default-500 text-sm font-bold uppercase'>
                {t('productList')}
              </h4>
              {order?.items?.map((item) => (
                <div
                  key={item?.id}
                  className='border-divider flex items-start gap-4 border-b pb-3 last:border-0'
                >
                  <Avatar
                    radius='sm'
                    size='lg'
                    src={item?.product?.images?.[0]?.url ?? NO_IMAGE}
                    className='shrink-0'
                  />
                  <div className='flex flex-1 flex-col gap-1'>
                    <p className='line-clamp-2 text-sm font-medium'>
                      {item?.productName}
                    </p>
                    <div className='flex items-center justify-between'>
                      <p className='text-default-500 text-xs'>
                        x{formatNumber(item?.quantity)}{' '}
                        {getProductUnit(item?.product?.unit!)}
                      </p>
                      <p className='text-sm font-semibold'>
                        {formatCurrency(
                          item?.price * item?.quantity,
                          CURRENCY_OPTIONS,
                        )}
                      </p>
                    </div>
                    {item?.variantId && (
                      <p className='text-default-400 text-[10px] tracking-tighter uppercase'>
                        Option: {item?.variantId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <section className='bg-default-50 flex flex-col gap-2 rounded-lg p-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-default-500'>{t('subtotal')}</span>
                <span>
                  {formatCurrency(
                    order?.total! - (order?.shippingCost ?? 0),
                    CURRENCY_OPTIONS,
                  )}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-default-500'>{t('shippingFee')}</span>
                <span>
                  {formatCurrency(order?.shippingCost ?? 0, CURRENCY_OPTIONS)}
                </span>
              </div>
              <Divider />
              <div className='flex items-center justify-between'>
                <span className='font-bold'>{t('totalAmount')}</span>
                <span className='text-primary text-xl font-bold'>
                  {formatCurrency(order?.total ?? 0, CURRENCY_OPTIONS)}
                </span>
              </div>
              {order?.cancelReason && (
                <div className='bg-danger-50 text-danger mt-2 rounded p-2 text-xs'>
                  <strong>{t('cancelNote')}:</strong> {order?.cancelReason}
                </div>
              )}
            </section>
          </ModalBody>
        )}

        <ModalFooter className='border-divider border-t'>
          <Button variant='flat' color='default' onClick={onClose}>
            {t('close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
