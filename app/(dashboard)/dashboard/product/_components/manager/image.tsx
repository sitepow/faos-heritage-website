'use client'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

import type { ProductImage } from '@prisma/client'

import { useProductStore } from '../../store'
import { ImageForm } from '../form/image'

const ImageManager = () => {
  const { isImageManagerOpen, onOpenImageManagerChange, onOpenImageChange } =
    useProductStore()
  const [images, setImages] = useState<ProductImage[]>([])

  return (
    <>
      <ImageForm />

      <Modal
        hideCloseButton
        isDismissable={false}
        isOpen={isImageManagerOpen}
        size='2xl'
        onOpenChange={onOpenImageManagerChange}
      >
        <ModalContent>
          <ModalHeader>จัดการรูปภาพสินค้า</ModalHeader>
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
          <ModalFooter>
            <Button
              variant='faded'
              onPress={() => {
                onOpenImageManagerChange()
              }}
            >
              ยกเลิก
            </Button>
            <Button
              startContent={<PlusIcon className='text-default-500' />}
              variant='faded'
              onPress={() => {
                onOpenImageManagerChange()
                onOpenImageChange()
              }}
            >
              เพิ่มรูปภาพ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { ImageManager }
