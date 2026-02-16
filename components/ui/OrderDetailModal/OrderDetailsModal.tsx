'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  ModalFooter,
} from '@heroui/react'
import { MapPin, CreditCard } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Order } from '@/features/order/useOrder'

import { OrderItems } from './OrderItems'
import { OrderSummary } from './OrderSummary'

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
        <ModalHeader className='flex flex-col gap-1'>
          <span className='text-lg font-bold uppercase'>
            {tField('orderId')} #{order.id.slice(-8).toUpperCase()}
          </span>
          <p className='text-default-500 text-sm font-normal'>
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </ModalHeader>

        <ModalBody>
          <OrderItems items={order.items} title={tProfile('tabs.orders')} />

          <Divider className='bg-default-100 my-4' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-semibold'>
                <MapPin size={16} />
                <span>{t('view.shipping')}</span>
              </div>
              <div className='text-default-600 border-default-100 rounded-lg border p-3 text-sm'>
                <p className='font-bold'>{order.shippingName}</p>
                <p>{order.shippingPhone}</p>
                <p className='mt-1 leading-relaxed'>
                  {order.shippingAddressText}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm font-semibold'>
                <CreditCard size={16} />
                <span>{t('view.preparing')}</span>
              </div>
              <div className='text-default-600 border-default-100 rounded-lg border p-3 text-sm'>
                -
              </div>
            </div>
          </div>

          <Divider className='bg-default-100 my-4' />

          <OrderSummary
            discount={order.discount}
            labels={{
              total: tCart('checkout.summary.total'),
              discount: tCart('checkout.summary.discount'),
              shipping: tCart('checkout.summary.shipping'),
              net: tCart('checkout.summary.net'),
            }}
            shippingCost={order.shippingCost}
            subtotal={order.subtotal}
            total={order.total}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

export { OrderDetailsModal }
