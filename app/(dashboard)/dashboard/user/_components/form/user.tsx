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

import { deleteFile, uploadFiles } from '../../../product/actions/file'
import { createUser, getUser, updateUser } from '../../actions/user'
import { userCreateSchema, userUpdateSchema } from '../../schema/user'
import { useUserStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import { ImageDropzone } from '@/components/dropzone/image'

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
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [oldUrl, setOldUrl] = useState<string | null>(null)

  const QUERY = {
    DASHBOARD: ['dashboard', 'users', 'card'],
    USER: ['dashboard', 'user', userId],
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
    if (isUserOpen) {
      if (userId && !isLoadingUser && user) {
        reset(user)
        setOldUrl(user.image)
      } else if (!userId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isLoadingUser, isUserOpen, reset, user, userId])

  const { mutate: mutateCreateUser, isPending: isPendingCreateUser } =
    useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.DASHBOARD,
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY.DASHBOARD,
        })
        onClose()
      },
    })

  const isPending = isPendingCreateUser || isLoadingUser || isPendingUpdateUser
  const headerLable = userId ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'

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

  const onSubmit = async (data: UserInput) => {
    const isUpdate = !!userId

    if (isUpdate && oldUrl && data.image !== oldUrl) {
      await deleteFile(oldUrl)
    }

    if (!isUpdate) {
      mutateCreateUser(data as UserCreateInput)
    } else {
      mutateUpdateUser(data as UserUpdateInput)
    }

    setFilePaths([])
  }

  const onClose = async () => {
    if (filePaths.length > 0) {
      await Promise.all(filePaths.map((path) => deleteFile(path)))
    }

    setFilePaths([])

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
      size='xl'
      onOpenChange={onOpenUserChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <ImageDropzone onFilesChange={onFilesChange} />

            <SubHeader title='สิทธิ์การใช้งาน' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  เปิดใช้งานบัญชี
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
                  label='สถานะบัญชี'
                  selectedKeys={value ? [value] : []}
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as Role

                    onChange(selected)
                  }}
                >
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role}>
                      {role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}
                    </SelectItem>
                  ))}
                </Select>
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
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='ชื่อ'
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
                  label='อีเมล'
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
                  label={userId ? 'เปลี่ยนรหัสผ่าน' : 'รหัสผ่าน'}
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

export { UserForm }
