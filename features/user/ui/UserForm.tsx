/* eslint-disable no-unused-vars */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useEffect, useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'

import { useUser } from '../user.hook'
import { useUserMutation } from '../user.mutation'
import {
  userCreateAdminSchema,
  userUpdateAdminSchema,
  type UserUpdateInput,
  type UserCreateInput,
} from '../user.schema'
import { useAuthStore } from '../user.store'

import {
  ImageDropzone,
  type ImageWithPreview,
} from '@/app/(dashboard)/_components/ImageDropzone'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

type UserFormInput = UserCreateInput & UserUpdateInput

const DEFAULT_VALUES: UserFormInput = {
  id: '',
  name: '',
  email: '',
  password: '',
  role: Role.CUSTOMER,
  isActive: true,
  image: '',
}

const UserForm = () => {
  const { userId, isUserOpen, onOpenUserChange, setState } = useAuthStore()
  const { data: user, isLoading } = useUser(userId || '')
  const { create, update, isCreating, isUpdating } = useUserMutation()

  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)
  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserFormInput>({
    resolver: zodResolver(
      userId ? userUpdateAdminSchema : userCreateAdminSchema,
    ) as Resolver<UserFormInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isUserOpen) {
      if (userId && user) {
        reset({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
          isActive: user.isActive,
          image: user.image ?? undefined,
          password: '',
        } as UserFormInput)
        setOldImage(user.image || null)
      } else {
        reset(DEFAULT_VALUES)
        setPreviewFiles([])
        setOldImage(null)
      }
    }
  }, [isUserOpen, userId, user, reset])

  const onFilesChange = (files: ImageWithPreview[]) => {
    setPreviewFiles(files)
    if (files.length > 0) {
      setValue('image', 'IMAGE_CHANGED', { shouldDirty: true })
    }
  }

  const onSubmit = async (values: UserFormInput) => {
    const imagePath = await resolveImagePath()

    const payload = {
      ...values,
      image: imagePath,
    }

    if (userId) {
      const { password, ...updatePayload } = payload
      await update({ ...updatePayload, id: userId } as UserUpdateInput)
    } else {
      await create(payload as UserCreateInput)
    }

    handleClose()
  }

  const handleClose = () => {
    onOpenUserChange(false)
    setState({ userId: null })
    setPreviewFiles([])
    setOldImage(null)
    reset(DEFAULT_VALUES)
  }

  const isPending = isCreating || isUpdating || isUploading

  return (
    <Modal
      isDismissable={!isPending}
      isOpen={isUserOpen}
      scrollBehavior='inside'
      size='xl'
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalHeader className='text-left text-xl font-bold'>
          {userId ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
        </ModalHeader>
        <ModalBody className='text-left'>
          {isLoading && userId ? (
            <div className='flex h-40 items-center justify-center'>
              <Spinner label='กำลังโหลดข้อมูลผู้ใช้...' />
            </div>
          ) : (
            <form
              className='space-y-6'
              id='user-form'
              onSubmit={handleSubmit(onSubmit)}
            >
              <SectionLabel>รูปโปรไฟล์</SectionLabel>
              <ImageDropzone onFilesChange={onFilesChange} />

              <SectionLabel>สถานะและบทบาท</SectionLabel>
              <div className='border-default-100 flex items-center justify-between rounded-lg border p-3'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      color='success'
                      isSelected={!!value}
                      onValueChange={onChange}
                    >
                      สถานะการใช้งานบัญชี
                    </Switch>
                  )}
                />
                <Controller
                  control={control}
                  name='role'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      className='max-w-[200px]'
                      label='บทบาท'
                      selectedKeys={value ? [value] : [Role.CUSTOMER]}
                      size='sm'
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0] as Role)
                      }
                    >
                      {Object.values(Role).map((r) => (
                        <SelectItem key={r} textValue={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              <SectionLabel>ข้อมูลส่วนตัว</SectionLabel>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    label='ชื่อ-นามสกุล'
                    placeholder='กรอกชื่อและนามสกุลจริง'
                    variant='bordered'
                  />
                )}
              />

              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.email?.message}
                    isDisabled={!!userId}
                    isInvalid={!!errors.email}
                    label='อีเมล (Username)'
                    placeholder='example@faos.com'
                    variant='bordered'
                  />
                )}
              />

              {!userId && (
                <>
                  <SectionLabel>ความปลอดภัย</SectionLabel>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.password?.message}
                        isInvalid={!!errors.password}
                        label='รหัสผ่าน'
                        placeholder='กำหนดรหัสผ่านอย่างน้อย 6 ตัวอักษร'
                        type='password'
                        variant='bordered'
                      />
                    )}
                  />
                </>
              )}
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isPending} variant='flat' onPress={handleClose}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            form='user-form'
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            type='submit'
          >
            {userId ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { UserForm }
