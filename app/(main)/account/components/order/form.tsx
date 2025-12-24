'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  Textarea,
  ModalFooter,
  Button,
} from '@heroui/react'
import { OrderStatus } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import type { UpdateOrderInput } from './action'

import { updateOrder } from './action'

import { useOrderStore } from '@/app/(dashboard)/dashboard/order'

export const OrderForm = () => {
  const queryClient = useQueryClient()
  const { isOrderCancelOpen, onOpenOrderCancelChange, orderId } =
    useOrderStore()
  const [reason, setReason] = useState('')
  const status = OrderStatus.CANCELLED

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    ORDERS: ['account', 'orders', 'pagination', userId],
  }

  const { mutate: mutateUpdateOrder, isPending: isPendingUpdateOrder } =
    useMutation({
      mutationFn: (payload: UpdateOrderInput) => updateOrder(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.ORDERS })
        onClose()
      },
    })

  const onSubmit = () => {
    if (!orderId) return

    mutateUpdateOrder({
      orderId,
      status,
      reason,
    })
  }

  const onClose = () => {
    setReason('')
    onOpenOrderCancelChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOrderCancelOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={onOpenOrderCancelChange}
    >
      <ModalContent>
        <ModalHeader>Cancel order</ModalHeader>

        {isPendingUpdateOrder && <Spinner label='Loading...' />}

        {!isPendingUpdateOrder && (
          <ModalBody>
            <Textarea
              label='Reason'
              placeholder='Please enter the reason for cancellation/refund.'
              variant='bordered'
              onValueChange={setReason}
            />
          </ModalBody>
        )}

        <ModalFooter>
          <Button
            isDisabled={isPendingUpdateOrder}
            variant='faded'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPendingUpdateOrder || !reason}
            onClick={onSubmit}
          >
            {isPendingUpdateOrder ? 'In progress' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
