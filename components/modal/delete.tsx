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
}

const ModalDelete: FC<Props> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
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
            <ModalHeader className='flex flex-col gap-1'>
              คุณกำลังจะลบข้อมูล?
            </ModalHeader>
            <ModalBody>
              <span>
                คุณแน่ใจแล้วหรือไม่ที่จะลบข้อมูลดังกล่าวนี้และจะไม่สามารถกู้คืนกลับมาได้
              </span>
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

export { ModalDelete }
