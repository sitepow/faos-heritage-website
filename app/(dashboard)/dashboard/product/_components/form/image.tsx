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

import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'

type ProductImageInput = Omit<ProductImage, 'id' | 'createdAt' | 'updatedAt'>

const ImageForm = () => {
  const { isImageOpen, onOpenImageChange, onOpenImageManagerChange } =
    useProductStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductImageInput>()

  const onSubmit = (data: ProductImageInput) => {}

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isImageOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenImageChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          เพิ่มรูปภาพสินค้า
        </ModalHeader>
        <ModalBody>
          <SubHeader title='สถานะตัวเลือก' />
          <Switch {...register('isPrimary')}>ตั้งเป็นรูปหลัก</Switch>
          <SubHeader title='ข้อมูลพื้นฐาน' />
          <Input
            label='URL ของรูปภาพ'
            {...register('url')}
            errorMessage={errors.url?.message}
            isInvalid={!!errors.url}
          />
          <Input label='ข้อความอธิบายรูป (alt text)' {...register('alt')} />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='faded'
            onPress={() => {
              onOpenImageChange()
              onOpenImageManagerChange()
            }}
          >
            ยกเลิก
          </Button>
          <Button variant='faded'>บันทึกรูปภาพ</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ImageForm }
