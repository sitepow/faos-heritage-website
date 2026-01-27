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
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title = 'คุณกำลังจะลบข้อมูลนี้ใช่หรือไม่?',
  description = 'การลบนี้เป็นการลบถาวรและไม่สามารถกู้คืนได้',
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
}: ConfirmModalProps) => {
  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      onOpenChange={onClose}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>

        <ModalBody>
          <p className='text-default-500 text-sm'>{description}</p>
        </ModalBody>

        <ModalFooter className='gap-2'>
          <Button variant='faded' onPress={onClose} disabled={isPending}>
            {cancelText}
          </Button>

          <Button
            color='primary'
            className='text-secondary'
            onPress={onConfirm}
            isLoading={isPending}
            disabled={isPending}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ConfirmModal }
