'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components/ui/ImageDropzone'

import { createBanner, getBannerById, updateBanner } from '../banner.action'
import { useBannerUIStore } from '../banner.store'
import { bannerSchema, type BannerInput } from '../schema'

import { ImageDropzone } from '@/components/ui/ImageDropzone'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { bannerQueryKeys } from '@/features/banner/banner.query-key'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const DEFAULT_VALUES: BannerInput = {
  url: '',
  alt: '',
  isActive: true,
}

const BannerForm = () => {
  const t = useTranslations('Dashboard.BannerForm')
  const tc = useTranslations('Common')
  const queryClient = useQueryClient()

  const {
    selectedBannerId,
    isFormOpen,
    closeForm,
    openManager,
    reset: resetUI,
  } = useBannerUIStore()

  const isEditMode = Boolean(selectedBannerId)

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const form = useForm<BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { isDirty, errors },
  } = form

  const { data: banner, isLoading } = useQuery({
    queryKey: bannerQueryKeys.detail.byId(selectedBannerId!),
    queryFn: () => getBannerById(selectedBannerId!),
    enabled: isEditMode && isFormOpen,
  })

  useEffect(() => {
    if (!banner) {
      return
    }

    reset(banner)
    setOldImage(banner.url)
  }, [banner, reset])

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: bannerQueryKeys.list.all,
    })
    handleClose()
  }

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: invalidateList,
  })

  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: invalidateList,
  })

  const isPending =
    isLoading ||
    isUploading ||
    createMutation.isPending ||
    updateMutation.isPending

  const handleFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue('url', files.length ? 'changed' : (oldImage ?? ''), {
      shouldDirty: true,
    })
  }

  const handleSubmitForm = async (data: BannerInput) => {
    const imagePath = await resolveImagePath()

    const payload: BannerInput = {
      ...data,
      url: imagePath,
    }

    if (isEditMode) {
      updateMutation.mutate(payload)
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleClose = () => {
    reset(DEFAULT_VALUES)
    setPreviewFiles([])
    setOldImage(null)
    resetUI()
    closeForm()
    openManager()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={(open) => !open && handleClose()}
    >
      <ModalContent>
        <ModalHeader>{isEditMode ? t('editTitle') : t('addTitle')}</ModalHeader>

        <ModalBody className='relative'>
          {isPending && (
            <div className='bg-background/70 absolute inset-0 z-10 flex items-center justify-center'>
              <Spinner label={tc('loading')} />
            </div>
          )}

          <ImageDropzone onFilesChange={handleFilesChange} />

          <SectionHeader title={t('statusHeading')} />
          <Controller
            control={control}
            name='isActive'
            render={({ field }) => (
              <Switch isSelected={field.value} onValueChange={field.onChange}>
                {t('activeLabel')}
              </Switch>
            )}
          />

          <SectionHeader title={t('infoHeading')} />
          <Controller
            control={control}
            name='url'
            render={({ field: { value, ...field } }) => (
              <Input
                {...field}
                isDisabled
                errorMessage={errors.url?.message}
                isInvalid={!!errors.url}
                label={t('urlLabel')}
                value={value!}
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
                label={t('altLabel')}
                value={value!}
                variant='bordered'
              />
            )}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant='faded' onPress={handleClose}>
            {tc('cancel')}
          </Button>

          <Button
            className='text-secondary'
            color='primary'
            isDisabled={!isDirty || isPending}
            onClick={handleSubmit(handleSubmitForm)}
          >
            {tc('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { BannerForm }
