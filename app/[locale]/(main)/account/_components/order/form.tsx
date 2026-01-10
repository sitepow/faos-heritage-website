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
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { UpdateOrderInput } from './action'

import { updateOrder } from './action'

import { useOrderStore } from '@/app/[locale]/(dashboard)/dashboard/order/store'

export const OrderForm = () => {
  const t = useTranslations('Account.OrderCancel')
  const queryClient = useQueryClient()
  const { isOrderCancelOpen, onOpenOrderCancelChange, orderId } =
    useOrderStore()
  const [reason, setReason] = useState('')
  const status = OrderStatus.CANCELLED

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    ORDER: ['dashboard', 'order', orderId],
    ORDERS: ['account', 'orders', 'pagination', userId],
  }

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ORDER }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ORDERS }),
    ])
  }

  const { mutate: mutateUpdateOrder, isPending: isPendingUpdateOrder } =
    useMutation({
      mutationFn: (payload: UpdateOrderInput) => updateOrder(payload),
      onSuccess: () => {
        onRefetch()
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
        <ModalHeader>{t('title')}</ModalHeader>

        {isPendingUpdateOrder && <Spinner label={t('loading')} />}

        {!isPendingUpdateOrder && (
          <ModalBody>
            <Textarea
              label={t('reasonLabel')}
              placeholder={t('placeholder')}
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
            {t('back')}
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPendingUpdateOrder || !reason}
            onClick={onSubmit}
          >
            {isPendingUpdateOrder ? t('submitting') : t('confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
