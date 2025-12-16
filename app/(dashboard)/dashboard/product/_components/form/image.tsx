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

import type { ImageWithPreview } from '@/components/dropzone/image'

import { createImage, getImage, updateImage } from '../../actions/image'
import { imageSchema, type ImageInput } from '../../schema/image'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import { ImageDropzone } from '@/components/dropzone/image'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: ImageInput = {
  url: '',
  alt: '',
  isPrimary: false,
}

const ImageForm = () => {
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

  const QUERY = {
    IMAGE: ['dashboard', 'image', 'modal', imageId],
    IMAGES: ['dashboard', 'images', 'modal', productId],
    HOMEPAGE: ['products', 'homepage'],
    CAROUSEL: ['carousel', 'products', productId],
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
    queryKey: QUERY.IMAGE,
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
  }, [isLoadingImage, reset, image])

  const onRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY.IMAGE,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY.IMAGES,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY.HOMEPAGE,
    })
    queryClient.invalidateQueries({
      queryKey: QUERY.CAROUSEL,
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
      queryKey: QUERY.IMAGE,
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
      scrollBehavior='inside'
      onOpenChange={onOpenImageChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <ImageDropzone onFilesChange={onFilesChange} />

            <SubHeader title='Option status' />
            <Controller
              control={control}
              name='isPrimary'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Set as main profile picture
                </Switch>
              )}
            />
            <SubHeader title='Basic information' />
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
            isDisabled={isPending || !isDirty}
            variant='faded'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'In progress' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ImageForm }
