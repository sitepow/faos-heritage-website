'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react'
import { useTranslations } from 'next-intl'

import type { Order } from '@/features/order/hook'

import { OrderContent } from './OrderContent'

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

  const labels = {
    orderId: tField('orderId'),
    itemsTitle: tProfile('tabs.orders'),
    pickup: tCheckout('pickupOption') || 'รับหน้าร้าน',
    shipping: tCheckout('shippingOption') || 'จัดส่งไปยังที่อยู่',
    summary: {
      total: tCart('checkout.summary.total'),
      discount: tCart('checkout.summary.discount'),
      shipping: tCart('checkout.summary.shipping'),
      net: tCart('checkout.summary.net'),
    },
  }

  return (
    <Modal isOpen={isOpen} scrollBehavior='inside' size='2xl' onClose={onClose}>
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <OrderContent labels={labels} order={order} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

export { OrderDetailsModal }
