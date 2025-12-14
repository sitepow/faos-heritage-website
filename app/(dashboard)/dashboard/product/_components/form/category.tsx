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
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  createCategory,
  getCategory,
  updateCategory,
} from '../../actions/category'
import { categorySchema, type CategoryInput } from '../../schema/category'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/components/dropzone/image'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
}

const CategoryForm = () => {
  const queryClient = useQueryClient()
  const {
    isCategoryOpen,
    onOpenCategoryChange,
    onOpenCategoryManagerChange,
    categoryId,
    setState,
  } = useProductStore()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)
  const { resolveImagePath } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const QUERY = {
    CATEGORY: ['dashboard', 'categories', 'modal', categoryId],
    CATEGORIES: ['dashboard', 'categories', 'modal'],
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: QUERY.CATEGORY,
    queryFn: () => getCategory(categoryId!),
    enabled: !!categoryId && isCategoryOpen,
  })

  useEffect(() => {
    if (categoryId && !isLoadingCategory && category) {
      reset(category, {
        keepDirty: false,
        keepTouched: false,
      })
      setOldImage(category.image)
    }
  }, [isLoadingCategory, reset, category, category])

  const onRefetch = async () => {
    queryClient.invalidateQueries({
      queryKey: QUERY.CATEGORIES,
    })

    onClose()
  }

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: createCategory,
      onSuccess: onRefetch,
    })

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: updateCategory,
      onSuccess: onRefetch,
    })

  const isPending =
    isPendingCreateCategory || isLoadingCategory || isPendingUpdateCategory
  const headerLable = categoryId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue(
      'image',
      files.length ? 'มีการเปลี่ยนแปลงของไฟล์รูปภาพ' : (oldImage ?? ''),
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    )
  }

  const onSubmit = async (data: CategoryInput) => {
    const imagePath = await resolveImagePath()

    const payload = {
      ...data,
      image: imagePath,
    }

    if (categoryId) {
      mutateUpdateCategory(payload)
    } else {
      mutateCreateCategory(payload)
    }
  }

  const onClose = () => {
    setPreviewFiles([])
    setOldImage(null)

    queryClient.removeQueries({
      queryKey: QUERY.CATEGORY,
    })
    reset(DEFAULT_VALUES)
    setState({ categoryId: null })
    onOpenCategoryChange()
    onOpenCategoryManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isCategoryOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenCategoryChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <ImageDropzone onFilesChange={onFilesChange} />

            <SubHeader title='สถานะตัวเลือก' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  เปิดใช้งานหมวดหมู่นี้
                </Switch>
              )}
            />
            <SubHeader title='ข้อมูลพื้นฐาน' />
            <Controller
              control={control}
              name='image'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  isDisabled
                  errorMessage={errors.image?.message}
                  isInvalid={!!errors.image}
                  label='URL ของรูปภาพ'
                  value={value ?? ''}
                  variant='bordered'
                />
              )}
            />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='ชื่อหมวดหมู่'
                  variant='bordered'
                />
              )}
            />
            <Controller
              control={control}
              name='slug'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.slug?.message}
                  isInvalid={!!errors.slug}
                  label='Slug'
                  value={value ?? ''}
                  variant='bordered'
                />
              )}
            />
          </ModalBody>
        )}

        <ModalFooter>
          <Button isDisabled={isPending} variant='faded' onPress={onClose}>
            ยกเลิก
          </Button>
          <Button
            isDisabled={isPending || !isDirty}
            variant='faded'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'กำลังดำเนินการ' : 'บันทึกข้อมูล'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { CategoryForm }
