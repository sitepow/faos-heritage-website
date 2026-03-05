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
import { useEffect, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { CategoryInput } from '../category.schema'
import type { Resolver } from 'react-hook-form'

import { useCategoryAdmin } from '../category.hook'
import { useCategoryMutation } from '../category.mutation'
import { categorySchema } from '../category.schema'
import { useCategoryUIStore } from '../category.store'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  image: '',
  isActive: true,
}

const CategoryForm = () => {
  const { selectedCategoryId, isFormOpen, closeForm } = useCategoryUIStore()
  const { create, update, isCreating, isUpdating } = useCategoryMutation()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const { data: category, isLoading: isLoadingCategory } = useCategoryAdmin(
    selectedCategoryId || '',
  )

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const handleClose = useCallback(() => {
    setPreviewFiles([])
    setOldImage(null)
    resetForm(DEFAULT_VALUES)
    closeForm()
  }, [closeForm, resetForm])

  useEffect(() => {
    if (isFormOpen) {
      if (selectedCategoryId && category) {
        resetForm({
          id: category.id,
          name: category.name,
          slug: category.slug || '',
          image: category.image || '',
          isActive: category.isActive,
        })
        setOldImage(category.image || null)
      } else if (!selectedCategoryId) {
        resetForm(DEFAULT_VALUES)
        setPreviewFiles([])
        setOldImage(null)
      }
    }
  }, [isFormOpen, selectedCategoryId, category, resetForm])

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)
    if (files.length > 0) {
      setValue('image', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const onSubmit = async (data: CategoryInput) => {
    const imagePath = await resolveImagePath()
    const finalData = { ...data, image: imagePath || '' }

    if (selectedCategoryId) {
      await update({ ...finalData, id: selectedCategoryId })
    } else {
      await create(finalData)
    }
    handleClose()
  }

  const isPending = isLoadingCategory || isCreating || isUpdating || isUploading

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={(open) => {
        return !open && handleClose()
      }}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedCategoryId ? 'แก้ไขหมวดหมู่สินค้า' : 'เพิ่มหมวดหมู่ใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoadingCategory && selectedCategoryId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูล...' />
            </div>
          ) : (
            <div className='space-y-6'>
              <SectionLabel>รูปภาพหมวดหมู่</SectionLabel>
              <ImageDropzone onFilesChange={onFilesChange} />
              {errors.image && (
                <p className='text-tiny text-danger'>
                  {errors.image.message?.toString()}
                </p>
              )}

              <SectionLabel>สถานะการแสดงผล</SectionLabel>
              <Controller
                control={control}
                name='isActive'
                render={({ field: { value, onChange } }) => (
                  <Switch isSelected={!!value} onValueChange={onChange}>
                    เปิดใช้งานหมวดหมู่ (Active)
                  </Switch>
                )}
              />

              <SectionLabel>ข้อมูลพื้นฐาน</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message?.toString()}
                      isInvalid={!!errors.name}
                      label='ชื่อหมวดหมู่'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='slug'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.slug?.message?.toString()}
                      isInvalid={!!errors.slug}
                      label='URL Slug'
                      placeholder='เช่น organic-honey'
                      value={field.value || ''}
                      variant='bordered'
                    />
                  )}
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='flat' onPress={handleClose}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {selectedCategoryId ? 'บันทึกการแก้ไข' : 'สร้างหมวดหมู่'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { CategoryForm }
