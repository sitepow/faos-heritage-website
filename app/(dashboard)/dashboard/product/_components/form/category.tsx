'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components'

import { createCategory, getCategory, updateCategory } from '../../action'
import { categorySchema, type CategoryInput } from '../../schema'
import { useProductStore } from '../../store'

import { SubHeading } from '@/components/common/heading'
import { ImageDropzone } from '@/components/features/dropzone/image'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
}

export const CategoryForm = () => {
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
  const { resolveImagePath, isUploading } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const QUERY_KEY = {
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
    queryKey: QUERY_KEY.CATEGORY,
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
  }, [isLoadingCategory, reset, category, categoryId])

  const onRefetch = async () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.CATEGORIES,
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
    isPendingCreateCategory ||
    isLoadingCategory ||
    isPendingUpdateCategory ||
    isUploading
  const headerLable = categoryId ? 'Edit Category' : 'Add a category'

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue(
      'image',
      files.length
        ? 'There have been changes to the image files.'
        : (oldImage ?? ''),
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
      queryKey: QUERY_KEY.CATEGORY,
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
      size='xl'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <ImageDropzone onFilesChange={onFilesChange} />

            <SubHeading title='Option status' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Enable
                </Switch>
              )}
            />
            <SubHeading title='Basic information' />
            <Controller
              control={control}
              name='image'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  isDisabled
                  errorMessage={errors.image?.message}
                  isInvalid={!!errors.image}
                  label='Image URL'
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
                  label='Category Name'
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
            Cancel
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
