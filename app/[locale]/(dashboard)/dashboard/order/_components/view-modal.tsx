'use client'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@heroui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

import { useOrderStore } from '../store'

import { getOrder } from '@/app/[locale]/(main)/account/_components/order/action'
import { SubHeading } from '@/components/common/heading'
import { Stepper } from '@/components/common/stepper'
import { NO_IMAGE } from '@/utils/constants'
import { getProductUnit } from '@/utils/features/product/helpers'
import { formatCurrency, formatNumber } from '@/utils/number'

export const OrderViewModal = () => {
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
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.order,
    })

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
        <ModalHeader>Order details</ModalHeader>

        {isLoadingOrder && <Spinner label='Loading...' />}

        {!isLoadingOrder && (
          <ModalBody>
            <SubHeading title='Basic information' />
            <div className='flex flex-col'>
              <span>
                Order number:{' '}
                <span className='text-default-500'>{order?.id}</span>
              </span>
              <span>
                Shipping address:{' '}
                <span className='text-default-500'>
                  {order?.shippingAddressText}
                </span>
              </span>
              {order?.trackingNumber && (
                <span>
                  Tracking number:{' '}
                  <Link
                    className='text-primary underline'
                    href={order?.trackingWebsite ?? ''}
                    target='_blank'
                  >
                    {order?.trackingNumber}
                  </Link>
                </span>
              )}
              {order?.cancelReason && (
                <span>
                  Cancellation Note:{' '}
                  <span className='text-default-500'>
                    {order?.cancelReason}
                  </span>
                </span>
              )}
              <span>
                Shipping cost:{' '}
                <span className='text-default-500'>
                  {formatCurrency(order?.shippingCost ?? 0, CURRENCY_OPTIONS)}
                </span>
              </span>
              <span>
                Additional discount:{' '}
                <span className='text-default-500'>
                  {formatCurrency(0, CURRENCY_OPTIONS)}
                </span>
              </span>
              <span>
                Net total price:{' '}
                <span className='text-default-500'>
                  {formatCurrency(order?.total ?? 0, CURRENCY_OPTIONS)}
                </span>
              </span>
            </div>
            <SubHeading title='Shipping status' />
            <Stepper
              createdAt={order?.createdAt!}
              deliveredAt={order?.deliveredAt!}
              paidAt={order?.paidAt!}
              shippedAt={order?.shippedAt!}
              status={order?.status!}
            />

            <SubHeading title='Product list' />
            <div className='flex flex-col gap-2'>
              {order?.items?.map((item) => (
                <Card key={item?.id}>
                  <CardBody>
                    <div className='flex flex-wrap items-center gap-4 sm:flex-nowrap'>
                      <Avatar
                        className='shrink-0'
                        isBordered
                        src={item?.product?.images?.[0]?.url ?? NO_IMAGE}
                      />

                      <span>
                        {item?.productName}{' '}
                        <span className='text-default-500'>
                          (Price per
                          {getProductUnit(item?.product?.unit!)}{' '}
                          {formatCurrency(item?.price ?? 0, CURRENCY_OPTIONS)})
                        </span>
                        <span className='text-default-500'>
                          (Quantity {formatNumber(item?.quantity)}{' '}
                          {getProductUnit(item?.product?.unit!)})
                        </span>
                        <span className='text-default-500'>
                          (Total price{' '}
                          {formatCurrency(
                            item?.price * item?.quantity,
                            CURRENCY_OPTIONS,
                          )}
                          )
                        </span>
                        {item?.productId && !item?.variantId && (
                          <span className='text-default-500'>
                            (Product ID {item?.productId})
                          </span>
                        )}
                        {item?.productId && item?.variantId && (
                          <span className='text-default-500'>
                            (Product option code {item?.variantId})
                          </span>
                        )}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </ModalBody>
        )}

        <ModalFooter>
          <Button className='text-secondary' color='primary' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
