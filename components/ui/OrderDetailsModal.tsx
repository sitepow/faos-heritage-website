'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Image,
  ModalFooter,
} from '@heroui/react'
import { Package, MapPin, CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Order } from '@/features/order/useOrder'

import { IMAGE_FALLBACK } from '@/constants'
import { formatCurrency } from '@/utils/number'

interface Props {
  isOpen: boolean
  onClose: () => void
  order: Order
}

const OrderDetailsModal = ({ isOpen, onClose, order }: Props) => {
  const t = useTranslations('orders')
  const tProfile = useTranslations('profile')
  const tField = useTranslations('fields')
  const tCart = useTranslations('cart')

  return (
    <Modal isOpen={isOpen} scrollBehavior='inside' size='2xl' onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <span className='text-lg font-bold'>
                {tField('orderId')} #{order.id.toUpperCase()}
              </span>
              <p className='text-default-500 text-sm font-normal'>
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <div className='flex items-center gap-2 font-semibold'>
                  <Package />
                  <span>{tProfile('tabs.orders')}</span>
                </div>
                {order.items?.map((item) => (
                  <div key={item.id} className='flex items-center gap-4'>
                    <Image
                      alt={item.productName}
                      className='rounded-lg object-cover'
                      height={60}
                      src={
                        item.product?.images?.[0]?.url || IMAGE_FALLBACK.EMPTY
                      }
                      width={60}
                    />
                    <div className='flex-1'>
                      <p className='line-clamp-2 text-sm font-medium'>
                        {item.productName}
                      </p>
                      <p className='text-default-500 text-xs'>
                        {item.variantName} x {item.quantity}
                      </p>
                    </div>
                    <p className='text-sm font-semibold'>
                      {formatCurrency(item.subtotal, {
                        skipCalculation: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <Divider className='bg-default-100 my-4' />

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm font-semibold'>
                    <MapPin size={16} />
                    <span>{t('view.shipping')}</span>
                  </div>
                  <div className='text-default-600 bg-default-50 rounded-lg p-3 text-sm'>
                    <p className='font-bold'>{order.shippingName}</p>
                    <p>{order.shippingPhone}</p>
                    <p className='mt-1'>{order.shippingAddressText}</p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm font-semibold'>
                    <CreditCard size={16} />
                    <span>{t('view.preparing')}</span>
                  </div>
                  <div className='text-default-600 bg-default-50 rounded-lg p-3 text-sm'>
                    <p className='lowercase'>{order.paymentMethod}</p>
                    <p className='mt-1 text-xs'>
                      Status:{' '}
                      <span className='lowercase'>{order.paymentStatus}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Divider className='bg-default-100 my-4' />

              <div className='bg-default-50 space-y-2 rounded-xl p-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-default-500'>
                    {tCart('checkout.summary.total')}
                  </span>
                  <span>
                    {formatCurrency(order.subtotal, {
                      skipCalculation: true,
                    })}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-default-500'>
                    {tCart('checkout.summary.shipping')}
                  </span>
                  <span>
                    {formatCurrency(order.shippingCost, {
                      skipCalculation: true,
                    })}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className='text-danger flex justify-between text-sm'>
                    <span>{tCart('checkout.summary.discount')}</span>
                    <span>
                      -
                      {formatCurrency(order.discount, {
                        skipCalculation: true,
                      })}
                    </span>
                  </div>
                )}
                <Divider className='bg-default-100 my-1' />
                <div className='text-primary flex justify-between text-lg font-bold'>
                  <span>{tCart('checkout.summary.net')}</span>
                  <span>
                    {formatCurrency(order.total, {
                      skipCalculation: true,
                    })}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export { OrderDetailsModal }
