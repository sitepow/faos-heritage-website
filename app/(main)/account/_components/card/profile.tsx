import { deleteFile, uploadFiles } from '@/app/(dashboard)/dashboard/product/actions/file'
import { getUser, updateUser } from '@/app/(dashboard)/dashboard/user/actions/user'
import {
  userUpdateSchema,
  type UserUpdateInput,
} from '@/app/(dashboard)/dashboard/user/schema/user'
import { SubHeader } from '@/app/(main)/_components/section/header'
import type { ImageWithPreview } from '@/components/dropzone/image'
import { ImageDropzone } from '@/components/dropzone/image'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const DEFAULT_VALUES: UserUpdateInput = {
  name: '',
  email: '',
  password: '',
  isActive: true,
  role: Role.CUSTOMER,
}

const ProfileCard = () => {
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = ['account', 'user', userId]

  const [filePaths, setFilePaths] = useState<string[]>([])
  const [oldUrl, setOldUrl] = useState<string | null>(null)
  const [dropzoneKey, setDropzoneKey] = useState(0)

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
    queryKey: QUERY_KEY,
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })

  useEffect(() => {
    if (userId && !isLoadingUser && user) {
      reset(user)
      setOldUrl(user.image)
    } else if (!userId) {
      reset(DEFAULT_VALUES)
    }
  }, [isLoadingUser, reset, user, userId])

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })

  const onSubmit = async (data: UserUpdateInput) => {
    if (oldUrl && data.image !== oldUrl) {
      await deleteFile(oldUrl)
    }

    mutateUpdateUser(data)
  }

  const isPending = isPendingUpdateUser || isLoadingUser
  const onClose = async () => {
    if (filePaths.length > 0) {
      await Promise.all(filePaths.map((path) => deleteFile(path)))
    }

    setFilePaths([])

    setDropzoneKey((prev) => prev + 1)

    queryClient.removeQueries({
      queryKey: QUERY_KEY,
    })
    reset(DEFAULT_VALUES)
  }

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

  return (
    <Card fullWidth>
      <CardHeader>
        <span>แก้ไขข้อมูลส่วนตัว</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <div className='mx-auto max-w-2xl'>
          <ImageDropzone key={dropzoneKey} onFilesChange={onFilesChange} />
        </div>

        <SubHeader title='ข้อมูลพื้นฐาน' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                label='ชื่อ'
                type='email'
                value={value ?? ''}
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
                label='เปลี่ยนรหัสผ่าน'
                type='password'
                value={value ?? ''}
              />
            )}
          />
        </div>
      </CardBody>
      <CardFooter className='gap-2'>
        <Button isDisabled={isPending} variant='faded' onPress={onClose}>
          ยกเลิก
        </Button>
        <Button isDisabled={isPending || !isDirty} variant='faded' onClick={handleSubmit(onSubmit)}>
          {isPending ? 'กำลังดำเนินการ' : 'บันทึกข้อมูล'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ProfileCard }
