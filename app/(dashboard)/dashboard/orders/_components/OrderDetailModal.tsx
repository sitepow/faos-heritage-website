/* eslint-disable no-nested-ternary */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  ModalFooter,
  Spinner,
} from '@heroui/react'
import { DeliveryType } from '@prisma/client'
import { MapPin, Truck, Store, Phone, User } from 'lucide-react'

import { OrderItems } from '@/components/ui/OrderDetailModal/OrderItems'
import { OrderSummary } from '@/components/ui/OrderDetailModal/OrderSummary'
import { useOrder } from '@/features/order/order.hook'
import { useOrderStore } from '@/features/order/order.store'

const OrderDetailModal = () => {
  const { orderId, isViewOpen, setState } = useOrderStore()
  const { data: order, isLoading } = useOrder(orderId!)

  const onClose = () => {
    return setState({ isViewOpen: false, orderId: null })
  }

  const isPickup = order?.deliveryType === DeliveryType.PICKUP

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
            <ModalHeader className='flex flex-col gap-1'>
              <div className='flex items-center justify-between pr-6 text-left'>
                <span className='text-lg font-bold uppercase'>
                  รหัสคำสั่งซื้อ #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <p className='text-default-500 text-left text-sm font-normal'>
                {new Date(order.createdAt).toLocaleString('th-TH')}
              </p>
            </ModalHeader>

            <ModalBody>
              <OrderItems items={order.items} title='รายการสินค้า' />

              <Divider className='bg-default-100 my-4' />

              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  {isPickup ? (
                    <>
                      <Store size={20} />
                      <span>รับหน้าร้าน</span>
                    </>
                  ) : (
                    <>
                      <Truck size={20} />
                      <span>จัดส่งไปยังที่อยู่</span>
                    </>
                  )}
                </div>

                <div className='bg-default-50 text-default-600 border-default-100 rounded-xl border p-4 text-sm'>
                  {isPickup ? (
                    <div className='flex flex-col gap-2 text-left'>
                      <div className='text-default-900 flex items-center gap-2 font-bold'>
                        <span>
                          {order.storefront?.name || order.shippingName}
                        </span>
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
                        <Phone
                          className='text-default-400 shrink-0'
                          size={16}
                        />
                        <p>{order.shippingPhone || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-2 text-left'>
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
                  total: 'รวมค่าสินค้า',
                  discount: 'ส่วนลด',
                  shipping: 'ค่าจัดส่ง',
                  net: 'ยอดสุทธิ',
                }}
                shippingCost={order.shippingCost}
                subtotal={order.subtotal}
                total={order.total}
              />
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
