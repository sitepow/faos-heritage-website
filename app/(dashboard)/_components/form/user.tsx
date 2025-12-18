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
import { Select, SelectItem } from '@heroui/select'
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { UserCreateInput, UserUpdateInput } from '../../schema/user'
import type { ImageWithPreview } from '@/components/dropzone/image'

import { createUser, getUser, updateUser } from '../../actions/user'
import { userCreateSchema, userUpdateSchema } from '../../schema/user'
import { useUserStore } from '../../store/user'

import { DropzoneImage } from '@/components/dropzone/image'
import { SubHeading } from '@/components/heading'
import { useImageUpload } from '@/hooks/useImageUpload'

const DEFAULT_VALUES = {
  email: '',
  password: '',
  name: '',
  image: '',
  isActive: true,
  role: Role.CUSTOMER,
}

const UserForm = () => {
  const queryClient = useQueryClient()
  const { isUserOpen, onOpenUserChange, userId, setState } = useUserStore()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)
  const { resolveImagePath, isUploading } = useImageUpload({
    oldImage,
    previewFiles,
  })

  const QUERY = {
    DASHBOARD: ['dashboard', 'users', 'card'],
    USER: ['dashboard', 'user', userId],
    USERS: ['dashboard', 'users', 'pagination'],
  }

  type UserInput = UserCreateInput | UserUpdateInput
  const userSchema = userId ? userUpdateSchema : userCreateSchema

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY.USER,
    queryFn: () => getUser(userId!),
    enabled: !!userId && isUserOpen,
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

  const onRefetch = async () => {
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: QUERY.DASHBOARD,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY.USER,
      }),
      queryClient.invalidateQueries({
        queryKey: QUERY.USERS,
      }),
    ])

    onClose()
  }

  const { mutate: mutateCreateUser, isPending: isPendingCreateUser } =
    useMutation({
      mutationFn: createUser,
      onSuccess: onRefetch,
    })

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: onRefetch,
    })

  const isPending =
    isPendingCreateUser || isLoadingUser || isPendingUpdateUser || isUploading
  const headerLable = userId ? 'Edit User' : 'Add users'

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

  const onSubmit = async (data: UserInput) => {
    const imagePath = await resolveImagePath()

    const payload = {
      ...data,
      image: imagePath,
    }

    if (userId) {
      mutateUpdateUser(payload as UserUpdateInput)
    } else {
      mutateCreateUser(payload as UserCreateInput)
    }
  }

  const onClose = () => {
    setPreviewFiles([])
    setOldImage(null)

    queryClient.removeQueries({
      queryKey: QUERY.USER,
    })
    reset(DEFAULT_VALUES)
    setState({ userId: null })
    onOpenUserChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isUserOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenUserChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <DropzoneImage onFilesChange={onFilesChange} />

            <SubHeading title='License' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Activate account
                </Switch>
              )}
            />
            <Controller
              control={control}
              name='role'
              render={({ field: { value, onChange, ...field } }) => (
                <Select
                  {...field}
                  errorMessage={errors.role?.message}
                  isInvalid={!!errors.role}
                  label='Account status'
                  selectedKeys={value ? [value] : []}
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as Role

                    onChange(selected)
                  }}
                >
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role}>
                      {role === 'ADMIN' ? 'System administrator' : 'Customer'}
                    </SelectItem>
                  ))}
                </Select>
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
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                  label='Email'
                  value={value ?? ''}
                  variant='bordered'
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.password?.message}
                  isInvalid={!!errors.password}
                  label={userId ? 'Change password' : 'Password'}
                  type='password'
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
            className='text-white'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'In progress' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { UserForm }
