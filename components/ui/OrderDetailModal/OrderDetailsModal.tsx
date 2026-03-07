'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  ModalFooter,
} from '@heroui/react'
import { DeliveryType } from '@prisma/client'
import { MapPin, Truck, Store, Phone, User } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { Order } from '@/features/order/order.hook'

import { OrderItems } from './OrderItems'
import { OrderSummary } from './OrderSummary'

interface Props {
  isOpen: boolean
  onClose: () => void
  order: Order
}

const OrderDetailsModal = ({ isOpen, onClose, order }: Props) => {
  const tProfile = useTranslations('profile')
  const tField = useTranslations('fields')
  const tCart = useTranslations('cart')
  const tCheckout = useTranslations('cart.checkout')

  const isPickup = order.deliveryType === DeliveryType.PICKUP

  return (
    <Modal isOpen={isOpen} scrollBehavior='inside' size='2xl' onClose={onClose}>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <div className='flex items-center justify-between pr-6'>
            <span className='text-lg font-bold uppercase'>
              {tField('orderId')} #{order.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <p className='text-default-500 text-sm font-normal'>
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </ModalHeader>

        <ModalBody>
          <OrderItems items={order.items} title={tProfile('tabs.orders')} />

          <Divider className='bg-default-100 my-4' />

          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              {isPickup ? (
                <>
                  <Store size={20} />
                  <span>{tCheckout('pickupOption') || 'รับหน้าร้าน'}</span>
                </>
              ) : (
                <>
                  <Truck size={20} />
                  <span>
                    {tCheckout('shippingOption') || 'จัดส่งไปยังที่อยู่'}
                  </span>
                </>
              )}
            </div>

            <div className='bg-default-50 text-default-600 border-default-100 rounded-xl border p-4 text-sm'>
              {isPickup ? (
                <div className='flex flex-col gap-2'>
                  <div className='text-default-900 flex items-center gap-2 font-bold'>
                    <span>{order.storefront?.name || order.shippingName}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <MapPin
                      className='text-default-400 mt-0.5 shrink-0'
                      size={16}
                    />
                    <p className='leading-relaxed'>
                      {order.shippingAddressText ||
                        'ข้อมูลที่อยู่สาขาไม่ครบถ้วน'}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='text-default-400 shrink-0' size={16} />
                    <p>{order.shippingPhone || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <div className='text-default-900 flex items-center gap-2 font-bold'>
                    <User className='text-default-400' size={16} />
                    <span>{order.shippingName}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='text-default-400' size={16} />
                    <p>{order.shippingPhone}</p>
                  </div>
                  <div className='flex items-start gap-2 pt-1'>
                    <MapPin
                      className='text-default-400 mt-0.5 shrink-0'
                      size={16}
                    />
                    <p className='leading-relaxed'>
                      {order.shippingAddressText}
                    </p>
                  </div>
                </div>
              )}
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
