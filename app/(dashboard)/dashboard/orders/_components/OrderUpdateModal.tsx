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
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@prisma/client'
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

  const checkIsCancelled = (s: OrderStatus) =>
    s === OrderStatus.CANCELLED || s === OrderStatus.REFUNDED

  const isCancelledState = checkIsCancelled(tempStatus)

  const isDeliveredState =
    status === OrderStatus.DELIVERED || tempStatus === OrderStatus.DELIVERED

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
      onClose()
    },
  })

  const onClose = () => setState({ isOrderOpen: false, orderId: null })

  const onSubmit = (data: OrderInput) => {
    if (!orderId) return

    mutation.mutate({
      orderId,
      status: data.tempStatus,
      ...(isCancelledState && { reason: data.reason }),
      ...(isDeliveredState && {
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
          <ModalHeader className='border-default-100 border-b text-xl font-bold'>
            อัปเดตสถานะคำสั่งซื้อ
          </ModalHeader>
          <ModalBody className='py-6'>
            {isOrderLoading ? (
              <div className='flex justify-center py-8'>
                <Spinner label='กำลังโหลดข้อมูลออเดอร์...' />
              </div>
            ) : (
              <div className='flex flex-col gap-5'>
                <Controller
                  control={control}
                  name='tempStatus'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label='เลือกสถานะที่ต้องการเปลี่ยน'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0])
                      }
                    >
                      {ORDER_STEPS_ALL.map(([key, label]) => (
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
                      ))}
                    </Select>
                  )}
                />

                {isCancelledState && (
                  <Controller
                    control={control}
                    name='reason'
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        errorMessage={errors.reason?.message}
                        isInvalid={!!errors.reason}
                        label='ระบุเหตุผลในการยกเลิก'
                        placeholder='เช่น สินค้าหมดสต็อก, ลูกค้าขอยกเลิก...'
                        variant='bordered'
                      />
                    )}
                  />
                )}

                {isDeliveredState && (
                  <div className='flex flex-col gap-4'>
                    <Controller
                      control={control}
                      name='trackingWebsite'
                      render={({ field: { value, onChange } }) => (
                        <Select
                          label='บริษัทขนส่ง'
                          selectedKeys={value ? [value] : []}
                          variant='bordered'
                          onSelectionChange={(keys) =>
                            onChange(Array.from(keys)[0])
                          }
                        >
                          {SHIPPING_PROVIDERS.map((provider) => (
                            <SelectItem
                              key={provider.key}
                              startContent={
                                <Avatar
                                  size='sm'
                                  src={provider.image || IMAGE_FALLBACK.EMPTY}
                                />
                              }
                            >
                              {provider.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    <Controller
                      control={control}
                      name='trackingNumber'
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.trackingNumber?.message}
                          isInvalid={!!errors.trackingNumber}
                          label='หมายเลขพัสดุ (Tracking Number)'
                          placeholder='กรอกเลขพัสดุ...'
                          variant='bordered'
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter className='border-default-100 border-t'>
            <Button
              isDisabled={mutation.isPending}
              variant='flat'
              onPress={onClose}
            >
              ยกเลิก
            </Button>
            <Button
              className='text-secondary'
              color='primary'
              isDisabled={!isDirty || isOrderLoading}
              isLoading={mutation.isPending}
              onPress={() => handleSubmit(onSubmit)()}
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
