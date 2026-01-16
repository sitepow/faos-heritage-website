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
  onOpenChange: () => void
  onConfirm: () => void
  isPending: boolean
  title?: string
  description?: string
}

export const ConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
  title = 'Are you about to delete this information?',
  description = 'Are you sure you want to delete this data? This deletion is permanent and irrecoverable.',
}: ConfirmModalProps) => {
  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
            <ModalBody>
              <span>{description}</span>
            </ModalBody>
            <ModalFooter className='gap-2'>
              <Button disabled={isPending} variant='faded' onPress={onClose}>
                Cancel
              </Button>
              <Button
                className='text-secondary'
                color='primary'
                disabled={isPending}
                isLoading={isPending}
                onPress={onConfirm}
              >
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
