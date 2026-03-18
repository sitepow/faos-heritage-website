import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import type { ImageWithPreview } from '@/components/ui/ImageDropzone'
import type { Resolver } from 'react-hook-form'

import { userQueryKeys } from './query-key'

import { updateUser } from '@/features/user/action'
import { useUser } from '@/features/user/hook'
import {
  userUpdateAdminSchema,
  type UserUpdateInput,
} from '@/features/user/schema'
import { useResolveImageUpload } from '@/hooks/useResolveImageUpload'

const useProfileForm = (userId: string | undefined) => {
  const t = useTranslations('messages')
  const queryClient = useQueryClient()
  const [previewFiles, setPreviewFiles] = useState<ImageWithPreview[]>([])
  const [oldImage, setOldImage] = useState<string | null>(null)

  const { data: user, isLoading: isLoadingUser } = useUser(userId!)
  const { resolveImagePath, isUploading } = useResolveImageUpload({
    oldImage,
    previewFiles,
  })

  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateAdminSchema) as Resolver<UserUpdateInput>,
    defaultValues: {
      id: userId || '',
      name: '',
      email: '',
      image: '',
      isActive: true,
      roles: [Role.CUSTOMER],
    },
  })

  useEffect(() => {
    if (user && userId) {
      form.reset({
        id: userId,
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
        isActive: user.isActive ?? true,
        roles: user.roles || [Role.CUSTOMER],
      })
      setOldImage(user.image ?? null)
    }
  }, [user, form, userId])

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
      toast.success(t('update_success'))
    },
  })

  const onSubmit = async (data: UserUpdateInput) => {
    const finalImagePath = await resolveImagePath()
    mutation.mutate({ ...data, image: finalImagePath })
  }

  const handleFilesChange = useCallback(
    (files: ImageWithPreview[]) => {
      setPreviewFiles(files)
      if (files.length > 0) {
        const newCuid = crypto.randomUUID()
        form.setValue('image', newCuid, {
          shouldDirty: true,
          shouldTouch: true,
        })
      }
    },
    [form],
  )

  const handleReset = () => {
    setPreviewFiles([])
    if (user && userId) {
      form.reset({
        id: userId,
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
        isActive: user.isActive ?? true,
        roles: user.roles || [Role.CUSTOMER],
      })
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleFilesChange,
    handleReset,
    isLoading: isLoadingUser || mutation.isPending || isUploading,
    isDirty: form.formState.isDirty,
    errors: {
      name: form.formState.errors.name?.message?.toString(),
      email: form.formState.errors.email?.message?.toString(),
    },
  }
}

export { useProfileForm }
