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
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import {
  SHIPPING_PROVIDERS,
  ORDER_STEPS_ALL,
  IMAGE_FALLBACK,
} from '@/constants'
import { updateOrder } from '@/features/order/order.action'
import { useOrder } from '@/features/order/order.hook'
import { orderQueryKeys } from '@/features/order/order.query-key'
import { orderSchema, type OrderInput } from '@/features/order/order.schema'
import { useOrderStore } from '@/features/order/order.store'
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
                  <div className='flex flex-col gap-4'>
                    <div className='bg-primary-50 border-primary-100 mb-2 rounded-lg border p-3'>
                      <p className='text-tiny text-primary font-bold'>
                        ข้อมูลการจัดส่งพัสดุ
                      </p>
                    </div>
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
                  </div>
                )}

                {isPickup && tempStatus === OrderStatus.DELIVERED && (
                  <Alert
                    description='เมื่อกดยืนยัน
                      ระบบจะเปลี่ยนสถานะเป็นสำเร็จโดยไม่ต้องใช้เลขพัสดุ'
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
