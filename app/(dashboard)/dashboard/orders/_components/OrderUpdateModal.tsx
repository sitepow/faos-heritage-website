'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  Textarea,
  Spinner,
  Avatar,
  Alert,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus, DeliveryType } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardListIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import {
  SHIPPING_PROVIDERS,
  ORDER_STEPS_ALL,
  IMAGE_FALLBACK,
} from '@/constants'
import { updateOrder } from '@/features/order/action'
import { useOrder } from '@/features/order/hook'
import { orderQueryKeys } from '@/features/order/query-key'
import { orderSchema, type OrderInput } from '@/features/order/schema'
import { useOrderStore } from '@/features/order/store'
import { storefrontInventoryKeys } from '@/features/storefront-inventory/query-key'
import { canTransitionOrderStatus, ORDER_STATUS_TH_MAP } from '@/utils'

const OrderUpdateModal = () => {
  const queryClient = useQueryClient()
  const { orderId, isOrderOpen, setState } = useOrderStore()

  const { data: order, isLoading: isOrderLoading } = useOrder(orderId!)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: OrderStatus.PENDING,
      tempStatus: OrderStatus.PENDING,
      reason: '',
      trackingWebsite: '',
      trackingNumber: '',
    },
  })

  const { status, tempStatus } = watch()

  const isPickup = order?.deliveryType === DeliveryType.PICKUP

  const checkIsCancelled = (s: OrderStatus) => {
    return s === OrderStatus.CANCELLED || s === OrderStatus.REFUNDED
  }

  const isCancelledState = checkIsCancelled(tempStatus)

  const isDeliveredState =
    !isPickup &&
    (status === OrderStatus.DELIVERED || tempStatus === OrderStatus.DELIVERED)

  useEffect(() => {
    if (order) {
      reset({
        status: order.status as OrderStatus,
        tempStatus: order.status as OrderStatus,
        reason: order.cancelReason ?? '',
        trackingWebsite: order.trackingWebsite ?? SHIPPING_PROVIDERS[0]?.key,
        trackingNumber: order.trackingNumber ?? '',
      })
    }
  }, [order, reset])

  const mutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: storefrontInventoryKeys.all })
      return onClose()
    },
  })

  const onClose = () => {
    return setState({ isOrderOpen: false, orderId: null })
  }

  const onSubmit = (data: OrderInput) => {
    if (!orderId) {
      return
    }

    return mutation.mutate({
      orderId,
      status: data.tempStatus,
      ...(isCancelledState && { reason: data.reason }),
      ...(!isPickup &&
        isDeliveredState && {
          trackingWebsite: data.trackingWebsite,
          trackingNumber: data.trackingNumber,
        }),
    })
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOrderOpen}
      size='xl'
      onOpenChange={onClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='border-default-100 flex items-center border-b text-xl font-bold'>
            อัปเดตสถานะคำสั่งซื้อ{' '}
            {isPickup && (
              <span className='text-primary text-small ml-2'>
                (รับหน้าร้าน)
              </span>
            )}
          </ModalHeader>
          <ModalBody className='py-6'>
            {isOrderLoading ? (
              <div className='flex justify-center py-8 text-left'>
                <Spinner label='กำลังโหลดข้อมูลออเดอร์...' />
              </div>
            ) : (
              <div className='flex flex-col gap-5 text-left'>
                <Alert
                  color='primary'
                  description={
                    <div className='text-tiny mt-1 flex flex-col gap-1'>
                      <p>
                        • <strong>กำลังดำเนินการ (Processing):</strong>{' '}
                        ใช้เมื่อตรวจสอบยอดเงินเรียบร้อยและเริ่มเตรียมสินค้า
                      </p>
                      <p>
                        •{' '}
                        <strong>
                          {isPickup
                            ? 'พร้อมรับสินค้า (Ready for Pickup)'
                            : 'จัดส่งแล้ว (Delivered)'}
                          :
                        </strong>{' '}
                        {isPickup
                          ? 'ใช้แจ้งลูกค้าให้มารับของที่สาขา'
                          : 'ต้องกรอกเลข Tracking เพื่อให้ลูกค้าตรวจสอบสถานะได้'}
                      </p>
                      <p>
                        • <strong>ยกเลิก/คืนเงิน:</strong>{' '}
                        ระบบจะคืนสต็อกสินค้าให้โดยอัตโนมัติ
                        (กรุณาระบุเหตุผลให้ชัดเจน)
                      </p>
                    </div>
                  }
                  icon={<ClipboardListIcon />}
                  title='คู่มือการอัปเดตสถานะออเดอร์'
                  variant='flat'
                />

                <Controller
                  control={control}
                  name='tempStatus'
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label='เลือกสถานะที่ต้องการเปลี่ยน'
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          return onChange(Array.from(keys)[0])
                        }}
                      >
                        {ORDER_STEPS_ALL.map(([key, label]) => {
                          return (
                            <SelectItem
                              key={key}
                              isDisabled={
                                status !== OrderStatus.DELIVERED &&
                                !canTransitionOrderStatus(
                                  status,
                                  key as OrderStatus,
                                )
                              }
                            >
                              {ORDER_STATUS_TH_MAP[key as OrderStatus] || label}
                            </SelectItem>
                          )
                        })}
                      </Select>
                    )
                  }}
                />

                {isCancelledState && (
                  <Controller
                    control={control}
                    name='reason'
                    render={({ field }) => {
                      return (
                        <Textarea
                          {...field}
                          errorMessage={errors.reason?.message}
                          isInvalid={!!errors.reason}
                          label='ระบุเหตุผลในการยกเลิก'
                          placeholder='เช่น สินค้าหมดสต็อก, ลูกค้าขอยกเลิก...'
                          variant='bordered'
                        />
                      )
                    }}
                  />
                )}

                {isDeliveredState && (
                  <>
                    <Controller
                      control={control}
                      name='trackingWebsite'
                      render={({ field: { value, onChange } }) => {
                        return (
                          <Select
                            label='บริษัทขนส่ง'
                            selectedKeys={value ? [value] : []}
                            variant='bordered'
                            onSelectionChange={(keys) => {
                              return onChange(Array.from(keys)[0])
                            }}
                          >
                            {SHIPPING_PROVIDERS.map((provider) => {
                              return (
                                <SelectItem
                                  key={provider.key}
                                  startContent={
                                    <Avatar
                                      size='sm'
                                      src={
                                        provider.image || IMAGE_FALLBACK.EMPTY
                                      }
                                    />
                                  }
                                >
                                  {provider.label}
                                </SelectItem>
                              )
                            })}
                          </Select>
                        )
                      }}
                    />
                    <Controller
                      control={control}
                      name='trackingNumber'
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            errorMessage={errors.trackingNumber?.message}
                            isInvalid={!!errors.trackingNumber}
                            label='หมายเลขพัสดุ (Tracking Number)'
                            placeholder='กรอกเลขพัสดุ...'
                            variant='bordered'
                          />
                        )
                      }}
                    />
                  </>
                )}

                {isPickup && tempStatus === OrderStatus.DELIVERED && (
                  <Alert
                    description='เมื่อกดยืนยัน ระบบจะเปลี่ยนสถานะเป็นสำเร็จโดยไม่ต้องใช้เลขพัสดุ ลูกค้าจะได้รับแจ้งเตือนว่าได้รับสินค้าเรียบร้อยแล้ว'
                    title='รายการนี้เป็นการรับหน้าร้าน'
                  />
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter className='border-default-100 border-t'>
            <Button
              isDisabled={mutation.isPending}
              variant='flat'
              onPress={() => {
                return onClose()
              }}
            >
              ยกเลิก
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              isDisabled={!isDirty || isOrderLoading}
              isLoading={mutation.isPending}
              type='submit'
            >
              บันทึกการเปลี่ยนแปลง
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { OrderUpdateModal }
