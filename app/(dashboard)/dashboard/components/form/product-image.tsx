'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from '@heroui/react'
import { useForm } from 'react-hook-form'

import type { ProductImage } from '@prisma/client'
import type { FC } from 'react'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ProductImageForm: FC<Props> = ({ isOpen, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductImage>()

  const onSubmit = (data: ProductImage) => {
    console.log(data)
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='outside'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className='flex flex-col gap-1'>
              เพิ่มรูปภาพสินค้า
            </ModalHeader>
            <ModalBody className='space-y-4'>
              <Input
                label='URL ของรูปภาพ'
                placeholder='https://example.com/image.jpg'
                {...register('url', {
                  required: 'กรุณากรอก URL ของรูปภาพ',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'URL ต้องขึ้นต้นด้วย http หรือ https',
                  },
                })}
                errorMessage={errors.url?.message}
                isInvalid={!!errors.url}
              />
              <Input
                label='ข้อความอธิบายรูป (alt text)'
                placeholder='เช่น เสื้อยืดลายแมวสีดำ'
                {...register('alt')}
              />
              <div className='flex items-center gap-6'>
                <Switch {...register('isPrimary')}>ตั้งเป็นรูปหลัก</Switch>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                ยกเลิก
              </Button>
              <Button color='primary' type='submit'>
                บันทึกรูปภาพ
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export { ProductImageForm }
