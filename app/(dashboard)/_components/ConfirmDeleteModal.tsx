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
          {title ?? 'ยืนยันการลบข้อมูล'}
        </ModalHeader>

        <ModalBody>
          <p>
            {description ??
              'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้'}
          </p>
        </ModalBody>

        <ModalFooter className='gap-2'>
          <Button isDisabled={isPending} variant='faded' onPress={handleCancel}>
            {cancelText ?? 'ยกเลิก'}
          </Button>

          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending}
            isLoading={isPending}
            onPress={onConfirm}
          >
            {confirmText ?? 'ยืนยันการลบ'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ConfirmDeleteModal }
