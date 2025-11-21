'use client'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

import type { ProductImage } from '@prisma/client'

import { ImageForm } from '../form/image'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ImageManager = ({ isOpen, onOpenChange }: Props) => {
  const [images, setImages] = useState<ProductImage[]>([])
  const {
    isOpen: isFormOpen,
    onOpen,
    onOpenChange: onFormChange,
  } = useDisclosure()

  return (
    <>
      <Modal
        hideCloseButton
        isOpen={isOpen}
        scrollBehavior='outside'
        size='2xl'
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex items-center justify-between'>
                จัดการรูปภาพสินค้า
                <Button
                  startContent={<PlusIcon />}
                  variant='faded'
                  onPress={onOpen}
                >
                  เพิ่มรูปภาพ
                </Button>
              </ModalHeader>
              <ModalBody>
                {images.length === 0 ? (
                  <p className='text-center text-default-500'>
                    ยังไม่มีรูปภาพสินค้า
                  </p>
                ) : (
                  <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                    {images.map((img) => (
                      <Image
                        key={img.id}
                        alt={img?.alt ?? ''}
                        className='h-40 w-full object-cover'
                        height={200}
                        src={img.url}
                        width={200}
                      />
                    ))}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <ImageForm isOpen={isFormOpen} onOpenChange={onFormChange} />
    </>
  )
}

export { ImageManager }
