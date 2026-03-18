/* eslint-disable no-nested-ternary */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from '@heroui/react'

import { OrderContent } from '@/components/ui/OrderDetailsModal/OrderContent'
import { useOrder } from '@/features/order/hook'
import { useOrderStore } from '@/features/order/store'

const OrderDetailModal = () => {
  const { orderId, isViewOpen, setState } = useOrderStore()
  const { data: order, isLoading } = useOrder(orderId!)

  const onClose = () => {
    return setState({ isViewOpen: false, orderId: null })
  }

  const labels = {
    orderId: 'รหัสคำสั่งซื้อ',
    itemsTitle: 'รายการสินค้า',
    pickup: 'รับหน้าร้าน',
    shipping: 'จัดส่งไปยังที่อยู่',
    summary: {
      total: 'รวมค่าสินค้า',
      discount: 'ส่วนลด',
      shipping: 'ค่าจัดส่ง',
      net: 'ยอดสุทธิ',
    },
  }

  return (
    <Modal
      isOpen={isViewOpen}
      scrollBehavior='inside'
      size='2xl'
      onClose={onClose}
    >
      <ModalContent>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Spinner label='กำลังโหลด...' />
          </div>
        ) : order ? (
          <>
            <ModalHeader />
            <ModalBody>
              <OrderContent labels={labels} order={order} />
            </ModalBody>
          </>
        ) : (
          <div className='p-8 text-center'>ไม่พบข้อมูล</div>
        )}
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}

export { OrderDetailModal }
