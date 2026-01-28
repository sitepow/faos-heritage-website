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

interface ConfirmModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending = false,
  title = 'คุณกำลังจะลบข้อมูลนี้ใช่หรือไม่?',
  description = 'การลบนี้เป็นการลบถาวรและไม่สามารถกู้คืนได้',
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
}: ConfirmModalProps) => {
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
        <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>

        <ModalBody>
          <p className='text-default-500 text-sm'>{description}</p>
        </ModalBody>

        <ModalFooter className='gap-2'>
          <Button isDisabled={isPending} variant='faded' onPress={handleCancel}>
            {cancelText}
          </Button>

          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending}
            isLoading={isPending}
            onPress={onConfirm}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ConfirmModal }
