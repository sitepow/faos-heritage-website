'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { Switch } from '@heroui/switch'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components/dropzone/image'
import type { ProductImage } from '@prisma/client'

import { uploadFiles } from '../../action/file'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import { ImageDropzone } from '@/components/dropzone/image'

type ProductImageInput = Omit<ProductImage, 'id' | 'createdAt' | 'updatedAt'>

const ImageForm = () => {
  const { isImageOpen, onOpenImageChange, onOpenImageManagerChange } =
    useProductStore()
  const [files, setFiles] = useState<ImageWithPreview[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductImageInput>()

  const onSubmit = async (data: ProductImageInput) => {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    const filePaths = await uploadFiles(formData)

    if (filePaths) {
      setValue('url', filePaths[0])
    }
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isImageOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={onOpenImageChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          เพิ่มรูปภาพสินค้า
        </ModalHeader>
        <ModalBody>
          <ImageDropzone onFilesChange={setFiles} />

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
          <Button variant='faded' onClick={handleSubmit(onSubmit)}>
            บันทึกรูปภาพ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ImageForm }
