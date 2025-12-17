import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Spinner } from '@heroui/spinner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

import { useOrderStore } from '../../store'

import { getOrder } from '@/actions/order'
import { SubHeader } from '@/app/(main)/_components/section/header'
import { Stepper } from '@/components/stepper'
import { getProductUnit } from '@/utils/helper'
import { formatCurrency, formatNumber } from '@/utils/number'

const OrderView = () => {
  const queryClient = useQueryClient()
  const { isViewOpen, onOpenViewChange, orderId, setState } = useOrderStore()

  const QUERY = {
    order: ['dashboard', 'order', orderId],
  }

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY.order,
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  })

  const onClose = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY.order,
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
      size='3xl'
      onOpenChange={onOpenViewChange}
    >
      <ModalContent>
        <ModalHeader>Order details</ModalHeader>

        {isLoadingOrder && <Spinner label='Loading...' />}

        {!isLoadingOrder && (
          <ModalBody>
            <SubHeader title='Basic information' />
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
                <span className='text-default-500'>{formatCurrency(0)}</span>
              </span>
              <span>
                Additional discount:{' '}
                <span className='text-default-500'>{formatCurrency(0)}</span>
              </span>
              <span>
                Net total price:{' '}
                <span className='text-default-500'>
                  {formatCurrency(order?.total!)}
                </span>
              </span>
            </div>
            <SubHeader title='Shipping status' />
            <Stepper
              createdAt={order?.createdAt!}
              deliveredAt={order?.deliveredAt!}
              paidAt={order?.paidAt!}
              shippedAt={order?.shippedAt!}
              status={order?.status!}
            />

            <SubHeader title='Product list' />
            <div className='flex flex-col gap-2'>
              {order?.items?.map((item) => (
                <Card key={item?.id}>
                  <CardBody>
                    <div className='flex flex-wrap items-center gap-4 sm:flex-nowrap'>
                      <Avatar
                        className='shrink-0'
                        size='lg'
                        src={item?.product?.images?.[0]?.url ?? '/no-image.png'}
                      />

                      <span>
                        {item?.productName}{' '}
                        <span className='text-default-500'>
                          (Price per
                          {getProductUnit(item?.product?.unit!)}{' '}
                          {formatCurrency(item?.price)})
                        </span>
                        <span className='text-default-500'>
                          (Quantity {formatNumber(item?.quantity)}{' '}
                          {getProductUnit(item?.product?.unit!)})
                        </span>
                        <span className='text-default-500'>
                          (Total price{' '}
                          {formatCurrency(item?.price * item?.quantity)})
                        </span>
                        {item?.productId && !item?.variantId && (
                          <span className='text-default-500'>
                            (Product code {item?.productId})
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
          <Button color='primary' variant='bordered' onClick={onClose}>
            Close the window
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderView }
