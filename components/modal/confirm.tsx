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
  title = 'Are you about to delete this information?',
  description = 'Are you sure you want to delete this data? This deletion is permanent and irrecoverable.',
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
            <ModalFooter className='gap-2'>
              <Button
                color='primary'
                disabled={isPending}
                variant='bordered'
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                disabled={isPending}
                isLoading={isPending}
                variant='bordered'
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

export { ModalConfirm }
