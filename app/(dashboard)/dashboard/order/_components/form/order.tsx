'use client'

import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Input, Textarea } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { Spinner } from '@heroui/spinner'
import { OrderStatus } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import type { UpdateOrderInput } from '@/actions/order'

import { useOrderStore } from '../../store'

import { getOrder, updateOrder } from '@/actions/order'
import {
  ORDER_STATUS_FLOW,
  ORDER_STEPS_ALL,
  SHIPPING_PROVIDERS,
} from '@/utils/const'

const OrderForm = () => {
  const queryClient = useQueryClient()
  const { isOrderOpen, onOpenOrderChange, orderId, setState } = useOrderStore()

  const QUERY = {
    order: ['dashboard', 'order', orderId],
    orders: ['dashboard', 'orders'],
  }

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: QUERY.order,
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  })

  const currentStatus = order?.status as OrderStatus

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    OrderStatus.PENDING,
  )

  const [reason, setReason] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingWebsite, setTrackingWebsite] = useState(
    SHIPPING_PROVIDERS[0]?.value,
  )

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status)
      setTrackingWebsite(order?.trackingWebsite ?? SHIPPING_PROVIDERS[0]?.value)
      setTrackingNumber(order?.trackingNumber ?? '')
      setReason(order?.cancelReason ?? '')
    }
  }, [order])

  const requireReason =
    selectedStatus === OrderStatus.CANCELLED ||
    selectedStatus === OrderStatus.REFUNDED

  const requireTracking = selectedStatus === OrderStatus.DELIVERED

  const { mutate: mutateUpdateOrder, isPending: isPendingUpdateOrder } =
    useMutation({
      mutationFn: (payload: UpdateOrderInput) => updateOrder(payload),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.orders,
        })

        onClose()
      },
    })

  const onClose = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY.order,
    })

    setState({ orderId: null })
    setSelectedStatus(OrderStatus.PENDING)
    setReason('')
    setTrackingNumber('')
    setTrackingWebsite('')
    onOpenOrderChange()
  }

  const onSubmit = () => {
    if (!orderId) return

    mutateUpdateOrder({
      orderId,
      status: selectedStatus,
      ...(requireReason && { reason }),
      ...(requireTracking && {
        trackingNumber,
        trackingWebsite,
      }),
    })
  }

  const isPending = isPendingUpdateOrder || isLoadingOrder || !selectedStatus
  const isFinalStatus =
    currentStatus === OrderStatus.CANCELLED ||
    currentStatus === OrderStatus.REFUNDED

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOrderOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={onOpenOrderChange}
    >
      <ModalContent>
        <ModalHeader>สถานะคำสั่งซื้อ</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <Select
              disallowEmptySelection
              isDisabled={isFinalStatus}
              label='สถานะคำสั่งซื้อ'
              selectedKeys={selectedStatus ? [selectedStatus] : []}
              variant='bordered'
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as OrderStatus

                setSelectedStatus(selected)
              }}
            >
              {ORDER_STEPS_ALL?.map(([key, label]) => (
                <SelectItem
                  key={key}
                  isDisabled={
                    isFinalStatus ||
                    ORDER_STATUS_FLOW[key] < ORDER_STATUS_FLOW[currentStatus]
                  }
                >
                  {label}
                </SelectItem>
              ))}
            </Select>

            {requireReason && (
              <Textarea
                isDisabled={isFinalStatus}
                label='เหตุผล'
                minRows={5}
                placeholder='กรุณากรอกเหตุผลในการยกเลิก / คืนเงิน'
                value={reason}
                variant='bordered'
                onChange={(e) => setReason(e.target.value)}
              />
            )}

            {requireTracking && (
              <>
                <Select
                  disallowEmptySelection
                  label='ขนส่ง'
                  selectedKeys={trackingWebsite ? [trackingWebsite] : []}
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as OrderStatus

                    setTrackingWebsite(selected)
                  }}
                >
                  {SHIPPING_PROVIDERS?.map((provider) => (
                    <SelectItem
                      key={provider.value}
                      startContent={
                        <Avatar src={provider?.image || '/placeholder.svg'} />
                      }
                    >
                      {provider.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label='หมายเลข Tracking'
                  placeholder={`กรอกหมายเลข Tracking [ตัวอย่าง: ${
                    SHIPPING_PROVIDERS.find(
                      (provider) => provider.value === trackingWebsite,
                    )?.placeholder
                  }]`}
                  value={trackingNumber}
                  variant='bordered'
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </>
            )}
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant='faded' onClick={onClose}>
            ยกเลิก
          </Button>

          <Button
            isDisabled={
              !selectedStatus ||
              (requireReason && !reason.trim()) ||
              (requireTracking && !trackingNumber.trim()) ||
              isFinalStatus
            }
            variant='faded'
            onClick={onSubmit}
          >
            บันทึกข้อมูล
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderForm }
