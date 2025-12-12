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
import { deleteFile, uploadFiles } from '../../actions/file'
import { categorySchema, type CategoryInput } from '../../schema/category'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/components/dropzone/image'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
}

const CategoryForm = () => {
  const {
    isCategoryOpen,
    onOpenCategoryChange,
    onOpenCategoryManagerChange,
    categoryId,
    setState,
  } = useProductStore()

  const [filePaths, setFilePaths] = useState<string[]>([])
  const [oldUrl, setOldUrl] = useState<string | null>(null)

  const queryClient = useQueryClient()
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
    if (isCategoryOpen) {
      if (categoryId && !isLoadingCategory && category) {
        reset(category)
        setOldUrl(category.image)
      } else if (!categoryId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isCategoryOpen, categoryId, category, isLoadingCategory, reset])

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: createCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.CATEGORIES,
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: updateCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.CATEGORIES,
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateCategory || isLoadingCategory || isPendingUpdateCategory
  const headerLable = categoryId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'

  const onFilesChange = async (files: ImageWithPreview[]) => {
    if (files.length === 0) {
      setValue('image', oldUrl ?? '', { shouldDirty: true })

      return
    }

    const formData = new FormData()

    files.forEach((file) => formData.append('files', file))

    const imagePaths = await uploadFiles(formData)

    setFilePaths((prev) => [...prev, ...imagePaths])

    if (imagePaths?.length > 0) {
      setValue('image', imagePaths[0], { shouldDirty: true })
    }
  }

  const onSubmit = async (data: CategoryInput) => {
    const isUpdate = !!categoryId

    if (isUpdate && oldUrl && data.image !== oldUrl) {
      await deleteFile(oldUrl)
    }

    if (!isUpdate) {
      mutateCreateCategory(data)
    } else {
      mutateUpdateCategory(data)
    }

    setFilePaths([])
  }

  const onClose = async () => {
    if (filePaths.length > 0) {
      await Promise.all(filePaths.map((path) => deleteFile(path)))
    }

    setFilePaths([])

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
                  errorMessage={errors.image?.message}
                  isDisabled={!!filePaths}
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
