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
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  createCategory,
  getCategory,
  updateCategory,
} from '../../actions/category'
import { categorySchema, type CategoryInput } from '../../schema/category'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
}

const CategoryForm = () => {
  const {
    isCategoryOpen,
    onOpenCategoryChange,
    onOpenCategoryManagerChange,
    categoryId,
    setState,
  } = useProductStore()
  const queryClient = useQueryClient()
  const QUERY_KEY = ['dashboard', 'modal', 'categories', categoryId]

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => getCategory(categoryId!),
    enabled: !!categoryId && isCategoryOpen,
  })

  useEffect(() => {
    if (isCategoryOpen) {
      if (categoryId && !isLoadingCategory && category) {
        reset(category)
      } else if (!categoryId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isCategoryOpen, categoryId, category, isLoadingCategory, reset])

  const { mutate: mutateCreateCategory, isPending: isPendingCreateCategory } =
    useMutation({
      mutationFn: createCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'modal', 'categories'],
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateCategory, isPending: isPendingUpdateCategory } =
    useMutation({
      mutationFn: updateCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'modal', 'categories'],
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateCategory || isLoadingCategory || isPendingUpdateCategory
  const headerLable = categoryId ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'

  const onSubmit = (data: CategoryInput) => {
    if (!categoryId) {
      mutateCreateCategory(data)
    } else {
      mutateUpdateCategory(data)
    }
  }

  const onClose = () => {
    queryClient.removeQueries({
      queryKey: QUERY_KEY,
    })
    reset(DEFAULT_VALUES)
    setState({ categoryId: null })
    onOpenCategoryChange()
    onOpenCategoryManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isCategoryOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenCategoryChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <SubHeader title='สถานะตัวเลือก' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  เปิดใช้งานหมวดหมู่นี้
                </Switch>
              )}
            />
            <SubHeader title='ข้อมูลพื้นฐาน' />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='ชื่อหมวดหมู่'
                />
              )}
            />
            <Controller
              control={control}
              name='slug'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.slug?.message}
                  isInvalid={!!errors.slug}
                  label='Slug'
                  value={value ?? ''}
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

export { CategoryForm }
