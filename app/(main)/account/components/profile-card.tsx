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
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ImageWithPreview } from '@/components'

import { getUser, updateUser } from '@/app/(dashboard)/dashboard/user/action'
import {
  userUpdateSchema,
  type UserUpdateInput,
} from '@/app/(dashboard)/dashboard/user/schema'
import { SubHeading } from '@/components/common/heading'
import { ImageDropzone } from '@/components/features/dropzone/image'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES: UserUpdateInput = {
  name: '',
  email: '',
  password: '',
  isActive: true,
  role: Role.CUSTOMER,
}

export const ProfileCard = () => {
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
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
    queryKey: QUERY.USER,
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
        queryClient.invalidateQueries({ queryKey: QUERY.USER })
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
    <Card fullWidth>
      <CardHeader>
        <span>Edit personal information</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <div className='mx-auto max-w-2xl'>
          <ImageDropzone onFilesChange={onFilesChange} />
        </div>

        <SubHeading title='Basic information' />
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
                label='Image URL'
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
                label='Name'
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
                label='Email'
                type='email'
                value={value ?? ''}
                variant='bordered'
              />
            )}
          />

          {/* <Controller
            control={control}
            name='password'
            render={({ field: { value, ...field } }) => (
              <Input
                {...field}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
                label='Password'
                type='password'
                value={value ?? ''}
                variant='bordered'
              />
            )}
          /> */}
        </div>
      </CardBody>
      <CardFooter className='gap-2'>
        <Button isDisabled={isPending} variant='faded' onPress={onClose}>
          Cancel
        </Button>
        <Button
          className='text-secondary'
          color='primary'
          isDisabled={isPending || !isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          {isPending ? 'In progress' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  )
}
