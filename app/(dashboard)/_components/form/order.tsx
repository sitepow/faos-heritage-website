'use client'

import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Textarea } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { Spinner } from '@heroui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { OrderInput } from '../../schema/order'
import type { UpdateOrderInput } from '@/app/(main)/actions/order'

import { orderSchema } from '../../schema/order'
import { useOrderStore } from '../../store/order'

import { getOrder, updateOrder } from '@/app/(main)/actions/order'
import { ORDER_STEPS_ALL, SHIPPING_PROVIDERS } from '@/utils/const'
import { checkOrderStatus } from '@/utils/helper'

const DEFAULT_VALUES: OrderInput = {
  status: OrderStatus.PENDING,
  tempStatus: OrderStatus.PENDING,
  reason: '',
  trackingWebsite: '',
  trackingNumber: '',
}

const OrderForm = () => {
  const queryClient = useQueryClient()
  const { isOrderOpen, onOpenOrderChange, orderId, setState } = useOrderStore()

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { status, tempStatus, trackingWebsite } = watch()

  const QUERY = {
    ORDER: ['dashboard', 'order', orderId],
    ORDERS: ['dashboard', 'orders'],
  }

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY.ORDER,
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  })

  useEffect(() => {
    if (!order) return

    reset({
      status: order.status,
      tempStatus: order.status,
      reason: order.cancelReason ?? '',
      trackingWebsite: order.trackingWebsite ?? SHIPPING_PROVIDERS[0]?.value,
      trackingNumber: order.trackingNumber ?? '',
    })
  }, [order, reset])

  const { mutate: mutateUpdateOrder, isPending: isPendingUpdateOrder } =
    useMutation({
      mutationFn: (payload: UpdateOrderInput) => updateOrder(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.ORDERS })
        onClose()
      },
    })

  const onClose = () => {
    queryClient.invalidateQueries({ queryKey: QUERY.ORDER })
    setState({ orderId: null })
    reset(DEFAULT_VALUES)
    onOpenOrderChange()
  }

  const isDelivered = tempStatus === OrderStatus.DELIVERED
  const isFinalStatus =
    status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED
  const isCancelled =
    tempStatus === OrderStatus.CANCELLED || tempStatus === OrderStatus.REFUNDED

  const onSubmit = (data: OrderInput) => {
    if (!orderId) return

    mutateUpdateOrder({
      orderId,
      status: data.tempStatus,
      ...(isCancelled && { reason: data.reason }),
      ...(isDelivered && {
        trackingWebsite: data.trackingWebsite,
        trackingNumber: data.trackingNumber,
      }),
    })
  }

  const isPending = isPendingUpdateOrder || isLoadingOrder

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOrderOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenOrderChange}
    >
      <ModalContent>
        <ModalHeader>Order status</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <Controller
              control={control}
              name='tempStatus'
              render={({ field: { value, onChange, ...field } }) => (
                <Select
                  {...field}
                  disallowEmptySelection
                  errorMessage={errors.tempStatus?.message}
                  isInvalid={!!errors.tempStatus}
                  label='Order status'
                  selectedKeys={value ? [value] : []}
                  variant='bordered'
                  onSelectionChange={(keys) =>
                    onChange(Array.from(keys)[0] as OrderStatus)
                  }
                >
                  {ORDER_STEPS_ALL.map(([key, label]) => (
                    <SelectItem
                      key={key}
                      isDisabled={!checkOrderStatus(status, key)}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            {isCancelled && (
              <Controller
                control={control}
                name='reason'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label='Reason'
                    placeholder='Please enter the reason for cancellation/refund.'
                    variant='bordered'
                  />
                )}
              />
            )}

            {isDelivered && (
              <>
                <Controller
                  control={control}
                  name='trackingWebsite'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
                      disallowEmptySelection
                      errorMessage={errors.trackingWebsite?.message}
                      isInvalid={!!errors.trackingWebsite}
                      label='Transport'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0])
                      }
                    >
                      {SHIPPING_PROVIDERS.map((provider) => (
                        <SelectItem
                          key={provider.value}
                          startContent={
                            <Avatar src={provider.image || '/no-image.png'} />
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
                    <Textarea
                      {...field}
                      label='Tracking number'
                      placeholder={`Example: ${
                        SHIPPING_PROVIDERS.find(
                          (p) => p.value === trackingWebsite,
                        )?.placeholder
                      }`}
                      variant='bordered'
                    />
                  )}
                />
              </>
            )}
          </ModalBody>
        )}

        <ModalFooter>
          <Button
            color='primary'
            isDisabled={isPending}
            variant='bordered'
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            isDisabled={isPending || !isDirty || isFinalStatus}
            variant='bordered'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'In progress' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderForm }
