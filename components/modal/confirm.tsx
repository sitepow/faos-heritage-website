import { Button } from '@heroui/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'

import type { FC } from 'react'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
  onConfirm: () => void
  isPending: boolean
  title?: string
  description?: string
}

const ModalConfirm: FC<Props> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
  title = 'คุณกำลังจะลบข้อมูลนี้หรือไม่?',
  description = 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การลบครั้งนี้เป็นการลบถาวรและไม่สามารถกู้คืนได้',
}) => {
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
            <ModalFooter>
              <Button disabled={isPending} variant='faded' onPress={onClose}>
                ยกเลิก
              </Button>
              <Button
                disabled={isPending}
                isLoading={isPending}
                variant='faded'
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

export { ModalConfirm }
