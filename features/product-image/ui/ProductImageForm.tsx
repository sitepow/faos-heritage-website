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
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { useProductUIStore } from '../../product/store'
import { useProductImageDetail } from '../hook'
import { useProductImageMutation } from '../mutation'
import { imageSchema, type ImageInput } from '../schema'
import { useProductImageUIStore } from '../store'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

interface ProductImageRow {
  id: string
  url: string | null
  alt: string | null
  isPrimary: boolean
  index: string | null
  productId: string | null
}

const DEFAULT_VALUES: ImageInput = {
  url: '',
  alt: '',
  isPrimary: false,
  index: '0',
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
    formState: { errors, isDirty },
  } = useForm<ImageInput>({
    resolver: zodResolver(imageSchema) as Resolver<ImageInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedImageId && image) {
        const imageData = image as ProductImageRow

        reset({
          id: imageData.id,
          url: imageData.url!,
          alt: imageData.alt!,
          isPrimary: imageData.isPrimary,
          index: imageData.index!,
          productId: imageData.productId ?? selectedProductId!,
        })
        setOldImage(imageData.url)
      } else {
        reset({ ...DEFAULT_VALUES, productId: selectedProductId! })
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

    const payload: ImageInput = {
      ...data,
      url: imagePath || data.url,
      productId: selectedProductId || data.productId || '',
    }

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
      hideCloseButton
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
          {isLoadingDetail && selectedImageId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูล...' />
            </div>
          ) : (
            <div className='space-y-4'>
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
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-8'>
                  <Controller
                    control={control}
                    name='alt'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.alt?.message?.toString()}
                        isInvalid={!!errors.alt}
                        label='คำอธิบายรูปภาพ (Alt Text)'
                        placeholder='เช่น หน้าตรงของสินค้า'
                        value={field.value ?? ''}
                        variant='bordered'
                      />
                    )}
                  />
                </div>
                <div className='col-span-4'>
                  <Controller
                    control={control}
                    name='index'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.index?.message?.toString()}
                        isInvalid={!!errors.index}
                        label='ลำดับ (Index)'
                        placeholder='0'
                        type='number'
                        value={field.value ?? '0'}
                        variant='bordered'
                      />
                    )}
                  />
                </div>
              </div>

              {errors.url && (
                <p className='text-danger text-tiny px-1'>
                  {errors.url.message?.toString()}
                </p>
              )}
            </div>
          )}
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
            onClick={handleSubmit(onSubmit)}
          >
            {selectedImageId ? 'บันทึกการแก้ไข' : 'อัปโหลดรูปภาพ'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductImageForm }
