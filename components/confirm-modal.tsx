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
  title = 'คุณกำลังจะลบข้อมูลนี้ใช่หรือไม่?',
  description = 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้ การลบนี้เป็นการลบถาวรและไม่สามารถกู้คืนได้',
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
                ยกเลิก
              </Button>
              <Button
                className='text-secondary'
                color='primary'
                disabled={isPending}
                isLoading={isPending}
                onPress={onConfirm}
              >
                ตกลง
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
