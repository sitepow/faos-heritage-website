import { Button } from '@heroui/button'
import { Textarea } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Spinner } from '@heroui/spinner'
import { OrderStatus } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import type { UpdateOrderInput } from '@/actions/order'

import { updateOrder } from '@/actions/order'
import { useOrderStore } from '@/app/(dashboard)/dashboard/order/store'

const OrderForm = () => {
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
        <ModalHeader>Cancel order / Change of mind</ModalHeader>

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
            color='primary'
            isDisabled={isPendingUpdateOrder}
            variant='bordered'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            isDisabled={isPendingUpdateOrder || !reason}
            variant='bordered'
            onClick={onSubmit}
          >
            {isPendingUpdateOrder ? 'In progress' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderForm }
