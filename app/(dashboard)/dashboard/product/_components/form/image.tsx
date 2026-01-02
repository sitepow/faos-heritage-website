'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  Switch,
  Input,
  ModalFooter,
  Button,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components'

import { createImage, getImage, updateImage } from '../../action'
import { imageSchema, type ImageInput } from '../../schema'
import { useProductStore } from '../../store'

import { SubHeading } from '@/components/common/heading'
import { ImageDropzone } from '@/components/features/dropzone/image'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: ImageInput = {
  url: '',
  alt: '',
  isPrimary: false,
}

export const ImageForm = () => {
  const queryClient = useQueryClient()

  const {
    isImageOpen,
    onOpenImageChange,
    onOpenImageManagerChange,
    imageId,
    productId,
    setState,
  } = useProductStore()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)
  const { resolveImagePath, isUploading } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const QUERY_KEY = {
    IMAGE: ['dashboard', 'image', 'modal', imageId],
    IMAGES: ['dashboard', 'images', 'modal', productId],
    HOMEPAGE: ['products', 'homepage'],
    CAROUSEL: ['carousel', 'products'],
  }

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ImageInput>({
    resolver: zodResolver(imageSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: image, isLoading: isLoadingImage } = useQuery({
    queryKey: QUERY_KEY.IMAGE,
    queryFn: () => getImage(imageId!),
    enabled: !!imageId && isImageOpen,
  })

  useEffect(() => {
    if (imageId && !isLoadingImage && image) {
      reset(image, {
        keepDirty: false,
        keepTouched: false,
      })
      setOldImage(image.url)
    }
  }, [isLoadingImage, reset, image, imageId])

  const onRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.IMAGE,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.IMAGES,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.HOMEPAGE,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.CAROUSEL,
    })

    onClose()
  }

  const { mutate: mutateCreateImage, isPending: isPendingCreateImage } =
    useMutation({
      mutationFn: createImage,
      onSuccess: onRefetch,
    })

  const { mutate: mutateUpdateImage, isPending: isPendingUpdateImage } =
    useMutation({
      mutationFn: updateImage,
      onSuccess: onRefetch,
    })

  const isPending =
    isPendingCreateImage ||
    isLoadingImage ||
    isPendingUpdateImage ||
    isUploading
  const headerLable = imageId ? 'Edit product image' : 'Add product images'

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue(
      'url',
      files.length
        ? 'There have been changes to the image files.'
        : (oldImage ?? ''),
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    )
  }

  const onSubmit = async (data: ImageInput) => {
    const imagePath = await resolveImagePath()

    const payload = {
      ...data,
      url: imagePath,
      productId,
    }

    if (imageId) {
      mutateUpdateImage(payload)
    } else {
      mutateCreateImage(payload)
    }
  }

  const onClose = () => {
    setPreviewFiles([])
    setOldImage(null)

    queryClient.removeQueries({
      queryKey: QUERY_KEY.IMAGE,
    })
    reset(DEFAULT_VALUES)
    setState({ imageId: null })
    onOpenImageChange()
    onOpenImageManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isImageOpen}
      size='xl'
      scrollBehavior='inside'
      onOpenChange={onOpenImageChange}
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
              name='isPrimary'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Make primary photo
                </Switch>
              )}
            />
            <SubHeading title='Basic information' />
            <Controller
              control={control}
              name='url'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  isDisabled
                  errorMessage={errors.url?.message}
                  isInvalid={!!errors.url}
                  label='Image URL'
                  value={value ?? ''}
                  variant='bordered'
                />
              )}
            />
            <Controller
              control={control}
              name='alt'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.alt?.message}
                  isInvalid={!!errors.alt}
                  label='Image description (alt text)'
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
