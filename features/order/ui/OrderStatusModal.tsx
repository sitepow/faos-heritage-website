'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  Select,
  SelectItem,
  Textarea,
  Avatar,
  ModalFooter,
  Button,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { UpdateOrderInput } from '../order.action'

import { fetchOrderById, updateOrder } from '../order.action'
import { orderQueryKeys } from '../order.query-key'
import { orderSchema, type OrderInput } from '../order.schema'
import { useOrderStore } from '../order.store'

import {
  SHIPPING_PROVIDERS,
  ORDER_STEPS_ALL,
  IMAGE_FALLBACK,
} from '@/constants'
import { canTransitionOrderStatus } from '@/utils'

interface OrderStatusModalProps {
  mode: 'admin' | 'user'
}

const OrderStatusModal = ({ mode }: OrderStatusModalProps) => {
  const translate = useTranslations(
    mode === 'user' ? 'Account.OrderCancel' : 'Dashboard.Order',
  )
  const queryClient = useQueryClient()
  const { isOrderOpen, onOpenOrderChange, orderId, setState } = useOrderStore()

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty },
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

  const isUserMode = mode === 'user'

  const checkIsCancelled = (s: OrderStatus) =>
    s === OrderStatus.CANCELLED || s === OrderStatus.REFUNDED

  const isCancelledState = checkIsCancelled(tempStatus)
  const isCurrentlyFinal = checkIsCancelled(status)
  const isDeliveredState = tempStatus === OrderStatus.DELIVERED

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  })

  useEffect(() => {
    if (order) {
      reset({
        status: order.status,
        tempStatus: isUserMode ? OrderStatus.CANCELLED : order.status,
        reason: order.cancelReason ?? '',
        trackingWebsite: order.trackingWebsite ?? SHIPPING_PROVIDERS[0]?.key,
        trackingNumber: order.trackingNumber ?? '',
      })
    }
  }, [order, reset, isUserMode])

  const { mutate: mutateUpdateOrder, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateOrderInput) => updateOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.list.all })
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.detail.byId(orderId!),
      })
      onClose()
    },
  })

  const onClose = () => {
    setState({ orderId: null })

    if (isOrderOpen) {
      onOpenOrderChange()
    }
  }

  const onSubmit = (data: OrderInput) => {
    if (!orderId) {
      return
    }

    mutateUpdateOrder({
      orderId,
      status: data.tempStatus,
      ...(isCancelledState && { reason: data.reason }),
      ...(isDeliveredState && {
        trackingWebsite: data.trackingWebsite,
        trackingNumber: data.trackingNumber,
      }),
    })
  }

  const isLoading = isLoadingOrder || isUpdating

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOrderOpen}
      size='xl'
      onOpenChange={onClose}
    >
      <ModalContent>
        <ModalHeader>
          {isUserMode ? translate('title') : 'Update Order Status'}
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <div className='flex justify-center py-8'>
              <Spinner label={translate('loading') || 'Processing...'} />
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {!isUserMode && (
                <Controller
                  control={control}
                  name='tempStatus'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      label='Order Status'
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
                            !canTransitionOrderStatus(
                              status,
                              key as OrderStatus,
                            )
                          }
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}

              {isCancelledState && (
                <Controller
                  control={control}
                  name='reason'
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label={
                        isUserMode
                          ? translate('reasonLabel')
                          : 'Reason for Cancellation'
                      }
                      placeholder={translate('placeholder')}
                      variant='bordered'
                    />
                  )}
                />
              )}

              {!isUserMode && isDeliveredState && (
                <>
                  <Controller
                    control={control}
                    name='trackingWebsite'
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Transport Provider'
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
                      <Textarea
                        {...field}
                        label='Tracking Number'
                        placeholder='Enter tracking ID...'
                        variant='bordered'
                      />
                    )}
                  />
                </>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button isDisabled={isUpdating} variant='faded' onPress={onClose}>
            {translate('back') || 'Cancel'}
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={
              isLoading || !isDirty || (isUserMode && isCurrentlyFinal)
            }
            onPress={() => handleSubmit(onSubmit)}
          >
            {isUpdating
              ? translate('submitting') || 'Saving...'
              : translate('confirm') || 'Save Changes'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderStatusModal }
