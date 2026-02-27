'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Switch,
  Input,
  ModalFooter,
  Button,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useProductUIStore } from '../../product/product.store'
import { useProductImageDetail } from '../product-image.hook'
import { useProductImageMutation } from '../product-image.mutation'
import { imageSchema, type ImageInput } from '../product-image.schema'
import { useProductImageUIStore } from '../product-image.store'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const DEFAULT_VALUES: ImageInput = {
  url: '',
  alt: '',
  isPrimary: false,
  productId: '',
}

const ProductImageForm = () => {
  const { selectedImageId, isFormOpen, closeForm } = useProductImageUIStore()
  const { selectedProductId } = useProductUIStore()
  const { create, update } = useProductImageMutation()

  const { data: image, isLoading: isLoadingDetail } =
    useProductImageDetail(selectedImageId)

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<ImageInput>({
    resolver: zodResolver(imageSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedImageId && image) {
        reset(image as ImageInput)
        setOldImage(image.url || null)
      } else {
        reset({ ...DEFAULT_VALUES, productId: selectedProductId || '' })
        setPreviewFiles([])
        setOldImage(null)
      }
    }
  }, [isFormOpen, selectedImageId, image, reset, selectedProductId])

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)
    if (files.length > 0) {
      setValue('url', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const onSubmit = async (data: ImageInput) => {
    const imagePath = await resolveImagePath()
    const payload = { ...data, url: imagePath, productId: selectedProductId }

    if (selectedImageId) {
      await update({ ...payload, id: selectedImageId })
    } else {
      await create(payload)
    }
    closeForm()
  }

  const isPending = isUploading || isLoadingDetail

  return (
    <Modal
      isDismissable={!isPending}
      isOpen={isFormOpen}
      size='xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='font-bold'>
          {selectedImageId ? 'แก้ไขข้อมูลรูปภาพ' : 'เพิ่มรูปภาพสินค้า'}
        </ModalHeader>
        <ModalBody>
          <ImageDropzone onFilesChange={onFilesChange} />

          <SectionLabel>สถานะรูปภาพ</SectionLabel>
          <Controller
            control={control}
            name='isPrimary'
            render={({ field: { value, onChange } }) => (
              <Switch isSelected={!!value} onValueChange={onChange}>
                ตั้งเป็นรูปหลัก (Primary Image)
              </Switch>
            )}
          />

          <SectionLabel>ข้อมูลประกอบ</SectionLabel>
          <Controller
            control={control}
            name='alt'
            render={({ field }) => (
              <Input
                {...field}
                label='คำอธิบายรูปภาพ (Alt Text)'
                placeholder='เช่น หน้าตรงของสินค้า, รายละเอียดบรรจุภัณฑ์'
                value={field.value || ''}
                variant='bordered'
              />
            )}
          />
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isPending} variant='flat' onPress={closeForm}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            onPress={() => handleSubmit(onSubmit)()}
          >
            {selectedImageId ? 'บันทึกการแก้ไข' : 'อัปโหลดรูปภาพ'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductImageForm }
