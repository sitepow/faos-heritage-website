'use client'

import {
  Card,
  CardHeader,
  CardBody,
  Input,
  CardFooter,
  Button,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components/ui/ImageDropzone'

import {
  getUser,
  updateUser,
} from '@/app/[locale]/(dashboard)/dashboard/user/action'
import {
  userUpdateSchema,
  type UserUpdateInput,
} from '@/app/[locale]/(dashboard)/dashboard/user/schema'
import { ImageDropzone } from '@/components/ui/ImageDropzone'
import { SubHeading } from '@/components/ui/SectionHeader'
import { useImageUpload } from '@/hooks/useResolveImageUpload'

const DEFAULT_VALUES: UserUpdateInput = {
  name: '',
  email: '',
  password: '',
  isActive: true,
  role: Role.CUSTOMER,
}

export const ProfileCard = () => {
  const t = useTranslations('Account')
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    USER: ['account', 'user', userId],
  }

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)
  const { resolveImagePath, isUploading } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY_KEY.USER,
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })

  useEffect(() => {
    if (userId && !isLoadingUser && user) {
      reset(
        { ...user, name: user?.name! },
        {
          keepDirty: false,
          keepTouched: false,
        },
      )
      setOldImage(user.image)
    }
  }, [isLoadingUser, reset, user, userId])

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.USER })
      },
    })

  const onSubmit = async (data: UserUpdateInput) => {
    mutateUpdateUser({
      ...data,
      image: await resolveImagePath(),
    })
  }

  const isPending = isPendingUpdateUser || isLoadingUser || isUploading

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)

    setValue('image', files.length ? t('imageChanged') : (oldImage ?? ''), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const onClose = () => {
    setPreviewFiles([])
    setOldImage(null)

    reset(
      { ...user, name: user?.name! },
      {
        keepDirty: false,
        keepTouched: false,
      },
    )
  }

  return (
    <Card fullWidth className='border-divider border' radius='sm' shadow='none'>
      <CardHeader>
        <span>{t('tabs.editProfile')}</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <div className='mx-auto max-w-2xl'>
          <ImageDropzone onFilesChange={onFilesChange} />
        </div>

        <SubHeading title={t('basicInfo')} />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <Controller
            control={control}
            name='image'
            render={({ field: { value, ...field } }) => (
              <Input
                {...field}
                isDisabled
                errorMessage={errors.image?.message}
                isInvalid={!!errors.image}
                label={t('fields.imageUrl')}
                value={value ?? ''}
                variant='bordered'
              />
            )}
          />

          <Controller
            control={control}
            name='name'
            render={({ field: { value, ...field } }) => (
              <Input
                {...field}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
                label={t('fields.name')}
                value={value ?? ''}
                variant='bordered'
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { value, ...field } }) => (
              <Input
                {...field}
                isDisabled
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
                label={t('fields.email')}
                type='email'
                value={value ?? ''}
                variant='bordered'
              />
            )}
          />
        </div>
      </CardBody>
      <CardFooter className='gap-2'>
        <Button isDisabled={isPending} variant='faded' onPress={onClose}>
          {t('buttons.cancel')}
        </Button>
        <Button
          className='text-secondary'
          color='primary'
          isDisabled={isPending || !isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          {isPending ? t('buttons.saving') : t('buttons.save')}
        </Button>
      </CardFooter>
    </Card>
  )
}
