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
        <ModalHeader>ยกเลิกสินค้า/เปลี่ยนใจ</ModalHeader>

        {isPendingUpdateOrder && <Spinner label='กำลังโหลด...' />}

        {!isPendingUpdateOrder && (
          <ModalBody>
            <Textarea
              label='เหตุผล'
              placeholder='กรุณากรอกเหตุผลในการยกเลิก / คืนเงิน'
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
            ยกเลิก
          </Button>
          <Button
            isDisabled={isPendingUpdateOrder || !reason}
            variant='faded'
            onClick={onSubmit}
          >
            {isPendingUpdateOrder ? 'กำลังดำเนินการ' : 'บันทึกข้อมูล'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderForm }
