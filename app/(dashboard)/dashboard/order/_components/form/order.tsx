'use client'

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
import { ORDER_STATUS_FLOW, ORDER_STEPS_ALL } from '@/utils/const'

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
  const [trackingWebsite, setTrackingWebsite] = useState('')

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status)
      setTrackingNumber(order?.trackingNumber ?? '')
      setTrackingWebsite(order?.trackingWebsite ?? '')
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
        <ModalHeader>แก้ไขคำสั่งซื้อ</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <Select
              disallowEmptySelection
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
                    ORDER_STATUS_FLOW[key] < ORDER_STATUS_FLOW[currentStatus]
                  }
                >
                  {label}
                </SelectItem>
              ))}
            </Select>

            {requireReason && (
              <Textarea
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
                <Input
                  label='เว็บไซต์ขนส่ง'
                  placeholder='กรอกเว็บไซต์ขนส่ง [ตัวอย่าง: https://track.thailandpost.com]'
                  value={trackingWebsite}
                  variant='bordered'
                  onChange={(e) => setTrackingWebsite(e.target.value)}
                />
                <Input
                  label='หมายเลข Tracking'
                  placeholder='กรอกหมายเลขสิ่งของ 13 หลัก [ตัวอย่าง : EF582568151TH]'
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
              (requireTracking && !trackingNumber.trim())
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
