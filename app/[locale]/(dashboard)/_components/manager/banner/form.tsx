'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageBannerInput } from './schema'
import type { ImageWithPreview } from '@/components/dropzone/image'

import { createImageBanner, getImageBanner, updateImageBanner } from './action'
import { imageBannerSchema } from './schema'
import { useImageBannerStore } from './store'

import { ImageDropzone } from '@/components/dropzone/image'
import { SubHeading } from '@/components/heading'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: ImageBannerInput = {
  url: '',
  alt: '',
  isActive: true,
}

export const ImageBannerForm = () => {
  const translateBanner = useTranslations('Dashboard.BannerForm')
  const translateCommon = useTranslations('Common')
  const queryClient = useQueryClient()

  const {
    imageBannerId,
    isImageBannerOpen,
    onOpenImageBannertChange,
    onOpenImageBannertManagerChange,
    setState,
  } = useImageBannerStore()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { resolveImagePath, isUploading } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const QUERY_KEY = {
    IMAGE: ['dashboard', 'banner', imageBannerId],
    IMAGES: ['dashboard', 'banners'],
  }

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ImageBannerInput>({
    resolver: zodResolver(imageBannerSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: image, isLoading } = useQuery({
    queryKey: QUERY_KEY.IMAGE,
    queryFn: () => getImageBanner(imageBannerId!),
    enabled: !!imageBannerId && isImageBannerOpen,
  })

  useEffect(() => {
    if (imageBannerId && image) {
      reset(image)
      setOldImage(image.url)
    }
  }, [imageBannerId, image, reset])

  const onRefetch = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.IMAGES })
    onClose()
  }

  const { mutate: createBanner, isPending: creating } = useMutation({
    mutationFn: createImageBanner,
    onSuccess: onRefetch,
  })

  const { mutate: updateBanner, isPending: updating } = useMutation({
    mutationFn: updateImageBanner,
    onSuccess: onRefetch,
  })

  const isPending = creating || updating || isLoading || isUploading
  const headerLabel = imageBannerId
    ? translateBanner('editTitle')
    : translateBanner('addTitle')

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue(
      'url',
      files.length ? 'Image has been changed' : (oldImage ?? ''),
      { shouldDirty: true },
    )
  }

  const onSubmit = async (data: ImageBannerInput) => {
    const imagePath = await resolveImagePath()

    const payload = {
      ...data,
      url: imagePath,
    }

    if (imageBannerId) {
      updateBanner(payload)
    } else {
      createBanner(payload)
    }
  }

  const onClose = () => {
    setPreviewFiles([])
    setOldImage(null)
    reset(DEFAULT_VALUES)
    setState({ imageBannerId: null })
    onOpenImageBannertChange()
    onOpenImageBannertManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isImageBannerOpen}
      size='xl'
      scrollBehavior='inside'
      onOpenChange={onOpenImageBannertChange}
    >
      <ModalContent>
        <ModalHeader>{headerLabel}</ModalHeader>

        {isPending && <Spinner label={translateCommon('loading')} />}

        {!isPending && (
          <ModalBody>
            <ImageDropzone onFilesChange={onFilesChange} />

            <SubHeading title={translateBanner('statusHeading')} />
            <Controller
              control={control}
              name='isActive'
              render={({ field }) => (
                <Switch isSelected={field.value} onValueChange={field.onChange}>
                  {translateBanner('activeLabel')}
                </Switch>
              )}
            />

            <SubHeading title={translateBanner('infoHeading')} />
            <Controller
              control={control}
              name='url'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  isDisabled
                  label={translateBanner('urlLabel')}
                  value={value ?? ''}
                  isInvalid={!!errors.url}
                  errorMessage={errors.url?.message}
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
                  value={value ?? ''}
                  label={translateBanner('altLabel')}
                  isInvalid={!!errors.alt}
                  errorMessage={errors.alt?.message}
                  variant='bordered'
                />
              )}
            />
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant='faded' onPress={onClose}>
            {translateCommon('cancel')}
          </Button>
          <Button
            color='primary'
            className='text-secondary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {translateCommon('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
