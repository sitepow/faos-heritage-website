/* eslint-disable no-unused-vars */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'
import { useTranslations } from 'next-intl'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const ConfirmDeleteModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending = false,
  title,
  description,
  confirmText,
  cancelText,
}: Props) => {
  const tDeleteAlert = useTranslations('alert.delete')
  const tActions = useTranslations('actions')

  const handleCancel = () => {
    if (isPending) {
      return
    }
    onOpenChange(false)
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          {title ?? tDeleteAlert('title')}
        </ModalHeader>

        <ModalBody>
          <p>{description ?? tDeleteAlert('description')}</p>
        </ModalBody>

        <ModalFooter className='gap-2'>
          <Button isDisabled={isPending} variant='faded' onPress={handleCancel}>
            {cancelText ?? tActions('cancel')}
          </Button>

          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending}
            isLoading={isPending}
            onPress={onConfirm}
          >
            {confirmText ?? tActions('confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ConfirmDeleteModal }
