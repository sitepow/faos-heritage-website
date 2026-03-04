'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Switch,
  Input,
  ModalFooter,
  Button,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { BlogCategoryInput } from '../blog-category.schema'
import type { Resolver } from 'react-hook-form'

import { useBlogCategory } from '../blog-category.hook'
import { useBlogCategoryMutation } from '../blog-category.mutation'
import { blogCategorySchema } from '../blog-category.schema'
import { useBlogCategoryUIStore } from '../blog-category.store'

import { SectionLabel } from '@/components/ui/SectionHeader'

const DEFAULT_VALUES: BlogCategoryInput = {
  name: '',
  slug: '',
  image: '',
  isActive: true,
}

const BlogCategoryForm = () => {
  const { selectedCategoryId, isFormOpen, closeForm } = useBlogCategoryUIStore()
  const { create, update, isCreating, isUpdating } = useBlogCategoryMutation()

  const { data: response, isLoading: isLoadingCategory } = useBlogCategory({
    id: selectedCategoryId || '',
  })
  const category = response?.data

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BlogCategoryInput>({
    resolver: zodResolver(blogCategorySchema) as Resolver<BlogCategoryInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedCategoryId && category) {
        reset({
          id: category.id,
          name: category.name,
          slug: category.slug || '',
          image: category.image || '',
          isActive: category.isActive,
        })
      } else if (!selectedCategoryId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedCategoryId, category, reset])

  const onSubmit = async (data: BlogCategoryInput) => {
    if (selectedCategoryId) {
      await update({ ...data, id: selectedCategoryId })
    } else {
      await create(data)
    }
    closeForm()
  }

  const isPending = isLoadingCategory || isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedCategoryId
              ? 'แก้ไขหมวดหมู่บทความ'
              : 'เพิ่มหมวดหมู่บทความใหม่'}
          </ModalHeader>
          <ModalBody>
            {isLoadingCategory && selectedCategoryId ? (
              <div className='flex justify-center p-8'>
                <Spinner label='กำลังโหลดข้อมูล...' />
              </div>
            ) : (
              <div className='space-y-6'>
                <SectionLabel>สถานะการแสดงผล</SectionLabel>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange } }) => (
                    <Switch isSelected={!!value} onValueChange={onChange}>
                      เปิดใช้งานหมวดหมู่บทความ (Active)
                    </Switch>
                  )}
                />

                <SectionLabel>ข้อมูลพื้นฐานบทความ</SectionLabel>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.name?.message?.toString()}
                        isInvalid={!!errors.name}
                        label='ชื่อหมวดหมู่บทความ'
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='slug'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.slug?.message?.toString()}
                        isInvalid={!!errors.slug}
                        label='URL Slug'
                        placeholder='เช่น news-and-updates'
                        value={field.value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name='image'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.image?.message?.toString()}
                      isInvalid={!!errors.image}
                      label='รูปภาพหน้าปกหมวดหมู่ (URL)'
                      placeholder='https://example.com/blog-category.jpg'
                      value={field.value || ''}
                      variant='bordered'
                    />
                  )}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={closeForm}>
              ยกเลิก
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              isDisabled={!isDirty}
              isLoading={isPending}
              type='submit'
            >
              {selectedCategoryId ? 'บันทึกการแก้ไข' : 'สร้างหมวดหมู่บทความ'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { BlogCategoryForm }
