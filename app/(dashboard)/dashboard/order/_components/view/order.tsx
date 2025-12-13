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
        <ModalHeader>รายละเอียดคำสั่งซื้อ</ModalHeader>

        {isLoadingOrder && <Spinner label='กำลังโหลด...' />}

        {!isLoadingOrder && (
          <ModalBody>
            <SubHeader title='ข้อมูลพื้นฐาน' />
            <div className='flex flex-col'>
              <span>
                หมายเลขคำสั่งซื้อ:{' '}
                <span className='text-default-500'>{order?.id}</span>
              </span>
              <span>
                ที่อยู่จัดส่ง:{' '}
                <span className='text-default-500'>
                  {order?.shippingAddressText}
                </span>
              </span>
              {order?.trackingNumber && (
                <span>
                  หมายเลข Tracking:{' '}
                  <Link
                    className='text-primary-website underline'
                    href={order?.trackingWebsite ?? ''}
                    target='_blank'
                  >
                    {order?.trackingNumber}
                  </Link>
                </span>
              )}
              <span>
                ค่าจัดส่ง:{' '}
                <span className='text-default-500'>{formatCurrency(0)}</span>
              </span>
              <span>
                ส่วนลดเพิ่มเติม:{' '}
                <span className='text-default-500'>{formatCurrency(0)}</span>
              </span>
              <span>
                ราคารวมสุทธิ:{' '}
                <span className='text-default-500'>
                  {formatCurrency(order?.total!)}
                </span>
              </span>
            </div>
            <SubHeader title='สถานะการจัดส่ง' />
            <Stepper
              createdAt={order?.createdAt!}
              deliveredAt={order?.deliveredAt!}
              paidAt={order?.paidAt!}
              shippedAt={order?.shippedAt!}
              status={order?.status!}
            />

            <SubHeader title='รายการสินค้า' />
            <div className='flex flex-col gap-2'>
              {order?.items?.map((item) => (
                <Card key={item?.id}>
                  <CardBody>
                    <div className='flex flex-wrap items-center gap-4 sm:flex-nowrap'>
                      <Avatar
                        className='shrink-0'
                        size='lg'
                        src={
                          item?.product?.images?.[0]?.url ?? '/placeholder.svg'
                        }
                      />

                      <span>
                        {item?.productName}{' '}
                        <span className='text-default-500'>
                          (ราคาต่อ
                          {getProductUnit(item?.product?.unit!)}{' '}
                          {formatCurrency(item?.price)})
                        </span>
                        <span className='text-default-500'>
                          (จำนวน {formatNumber(item?.quantity)}{' '}
                          {getProductUnit(item?.product?.unit!)})
                        </span>
                        <span className='text-default-500'>
                          (ราคารวม{' '}
                          {formatCurrency(item?.price * item?.quantity)}
                        </span>
                        {item?.productId && !item?.variantId && (
                          <span className='text-default-500'>
                            (รหัสสินค้า {item?.productId})
                          </span>
                        )}
                        {item?.productId && item?.variantId && (
                          <span className='text-default-500'>
                            (รหัสตัวเลือกสินค้า {item?.variantId})
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
          <Button variant='faded' onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderView }
