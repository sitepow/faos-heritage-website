/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Divider,
  Image,
  Chip,
} from '@heroui/react'

import type { OrderStatus } from '@prisma/client'

import { useOrder } from '@/features/order/order.hook'
import { useOrderStore } from '@/features/order/order.store'
import {
  formatCurrency,
  ORDER_STATUS_COLOR_MAP,
  ORDER_STATUS_TH_MAP,
} from '@/utils'

const OrderDetailModal = () => {
  const { orderId, isViewOpen, setState } = useOrderStore()
  const { data: order, isLoading } = useOrder(orderId!)

  const onClose = () => setState({ isViewOpen: false, orderId: null })

  return (
    <Modal
      hideCloseButton
      isOpen={isViewOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={onClose}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <span>รายละเอียดคำสั่งซื้อ</span>
            <span className='text-default-400 font-mono text-sm'>
              #{order?.id}
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className='flex justify-center p-12'>
              <Spinner label='กำลังโหลดรายละเอียด...' />
            </div>
          ) : order ? (
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4 rounded-xl'>
                <div>
                  <p className='text-tiny text-default-500 font-bold uppercase'>
                    ข้อมูลลูกค้า
                  </p>
                  <p className='font-semibold'>{order.shippingName}</p>
                  <p className='text-small text-default-600'>
                    {order.shippingPhone}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-tiny text-default-500 mb-2.5 font-bold uppercase'>
                    สถานะปัจจุบัน
                  </p>
                  <Chip
                    color={ORDER_STATUS_COLOR_MAP[order.status as OrderStatus]}
                    variant='dot'
                  >
                    {ORDER_STATUS_TH_MAP[order.status as OrderStatus]}
                  </Chip>
                </div>
              </div>

              <div>
                <p className='text-small mb-1 font-bold'>ที่อยู่จัดส่ง</p>
                <p className='text-small text-default-600 border-default-100 rounded-lg border-1 p-3'>
                  {order.shippingAddressText}
                </p>
              </div>

              <Divider className='bg-default-100' />

              <div>
                <p className='text-small mb-3 font-bold'>
                  รายการสินค้า ({order.items?.length || 0} รายการ)
                </p>
                <div className='space-y-3'>
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className='border-default-100 flex items-center gap-3 rounded-lg border-1 p-2'
                    >
                      <Image
                        alt={item.productName}
                        className='rounded-md object-cover'
                        height={60}
                        src={
                          item.product?.images?.[0]?.url ||
                          '/images/placeholder.png'
                        }
                        width={60}
                      />
                      <div className='flex-1'>
                        <p className='text-small font-medium'>
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className='text-tiny text-default-400'>
                            ตัวเลือก: {item.variantName}
                          </p>
                        )}
                        <p className='text-tiny text-default-500'>
                          {item.quantity} {item.product?.unit || 'ชิ้น'} x{' '}
                          {formatCurrency(Number(item.price), {
                            currency: order.currency,
                            skipCalculation: true,
                          })}
                        </p>
                      </div>
                      <div className='text-small text-right font-semibold'>
                        {formatCurrency(Number(item.subtotal), {
                          currency: order.currency,
                          skipCalculation: true,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Divider className='bg-default-100' />

              <div className='flex flex-col items-end gap-1 px-2 pb-4'>
                <div className='text-small flex w-48 justify-between'>
                  <span className='text-default-500'>รวมค่าสินค้า:</span>
                  <span>
                    {formatCurrency(Number(order.subtotal), {
                      currency: order.currency,
                      skipCalculation: true,
                    })}
                  </span>
                </div>
                <div className='text-small flex w-48 justify-between'>
                  <span className='text-default-500'>ค่าจัดส่ง:</span>
                  <span>
                    {formatCurrency(Number(order.shippingCost), {
                      currency: order.currency,
                      skipCalculation: true,
                    })}
                  </span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className='text-small text-danger flex w-48 justify-between'>
                    <span>ส่วนลด:</span>
                    <span>
                      -
                      {formatCurrency(Number(order.discount), {
                        currency: order.currency,
                        skipCalculation: true,
                      })}
                    </span>
                  </div>
                )}
                <div className='border-default-100 mt-2 flex w-48 justify-between border-t-1 pt-2 text-lg font-bold'>
                  <span>ยอดสุทธิ:</span>
                  <span className='text-primary'>
                    {formatCurrency(Number(order.total), {
                      currency: order.currency,
                      skipCalculation: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-default-400 p-8 text-center'>
              ไม่พบข้อมูลคำสั่งซื้อ
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='flat' onPress={onClose}>
            ปิดหน้าต่าง
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderDetailModal }
