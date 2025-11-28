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

import { deleteFile, uploadFiles } from '../../action/file'
import { createImage, getImage, updateImage } from '../../action/image'
import { imageSchema, type ImageInput } from '../../schema/image'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import { ImageDropzone } from '@/components/dropzone/image'

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
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [oldUrl, setOldUrl] = useState<string | null>(null)

  const QUERY_KEY = ['dashboard', 'modal', 'image', imageId]

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ImageInput>({
    resolver: zodResolver(imageSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: image, isLoading: isLoadingImage } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getImage(imageId!),
    enabled: !!imageId && isImageOpen,
  })

  useEffect(() => {
    if (isImageOpen) {
      if (imageId && !isLoadingImage && image) {
        reset(image)
        setOldUrl(image.url)
      } else if (!imageId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isImageOpen, imageId, image, isLoadingImage, reset])

  const { mutate: mutateCreateImage, isPending: isPendingCreateImage } =
    useMutation({
      mutationFn: createImage,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'modal', 'images'],
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateImage, isPending: isPendingUpdateImage } =
    useMutation({
      mutationFn: updateImage,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'modal', 'images'],
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateImage || isLoadingImage || isPendingUpdateImage
  const headerLable = imageId ? 'แก้ไขรูปภาพสินค้า' : 'เพิ่มรูปภาพสินค้า'

  const onFilesChange = async (files: ImageWithPreview[]) => {
    if (files.length === 0) {
      setValue('url', imageId ? (oldUrl ?? '') : '')

      return
    }

    const formData = new FormData()

    files.forEach((file) => formData.append('files', file))

    const imagePaths = await uploadFiles(formData)

    setFilePaths((prev) => [...prev, ...imagePaths])

    if (imagePaths?.length > 0) {
      setValue('url', imagePaths[0])
    }
  }

  const onSubmit = async (data: ImageInput) => {
    const isUpdate = !!imageId

    if (isUpdate && oldUrl && data.url !== oldUrl) {
      await deleteFile(oldUrl)
    }

    if (!isUpdate) {
      mutateCreateImage({ ...data, productId })
    } else {
      mutateUpdateImage({ ...data, productId })
    }

    setFilePaths([])
  }

  const onClose = async () => {
    if (filePaths.length > 0) {
      await Promise.all(filePaths.map((path) => deleteFile(path)))
    }

    setFilePaths([])

    queryClient.removeQueries({
      queryKey: QUERY_KEY,
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
      size='xl'
      onOpenChange={onOpenImageChange}
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
              name='isPrimary'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  ตั้งเป็นรูปหลัก
                </Switch>
              )}
            />
            <SubHeader title='ข้อมูลพื้นฐาน' />
            <Controller
              control={control}
              name='url'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.url?.message}
                  isDisabled={!!filePaths}
                  isInvalid={!!errors.url}
                  label='URL ของรูปภาพ'
                  value={value ?? ''}
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
                  label='ข้อความอธิบายรูป (alt text)'
                  value={value ?? ''}
                />
              )}
            />
          </ModalBody>
        )}
        <ModalFooter>
          <ModalFooter>
            <Button isDisabled={isPending} variant='faded' onPress={onClose}>
              ยกเลิก
            </Button>
            <Button
              isDisabled={isPending}
              variant='faded'
              onClick={handleSubmit(onSubmit)}
            >
              {isPending ? 'กำลังดำเนินการ' : 'บันทึกข้อมูล'}
            </Button>
          </ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ImageForm }
