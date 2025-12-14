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
            <ModalFooter>
              <Button disabled={isPending} variant='faded' onPress={onClose}>
                Cancel
              </Button>
              <Button
                disabled={isPending}
                isLoading={isPending}
                variant='faded'
                onPress={onConfirm}
              >
                Agree
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export { ModalConfirm }
