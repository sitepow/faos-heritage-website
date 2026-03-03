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

import type { CategoryInput } from '../category.schema'
import type { Resolver } from 'react-hook-form'

import { useCategoryAdmin } from '../category.hook'
import { useCategoryMutation } from '../category.mutation'
import { categorySchema } from '../category.schema'
import { useCategoryUIStore } from '../category.store'

import { SectionLabel } from '@/components/ui/SectionHeader'

const DEFAULT_VALUES: CategoryInput = {
  name: '',
  slug: '',
  image: '',
  isActive: true,
}

const CategoryForm = () => {
  const { selectedCategoryId, isFormOpen, closeForm } = useCategoryUIStore()
  const { create, update, isCreating, isUpdating } = useCategoryMutation()

  const { data: category, isLoading: isLoadingCategory } = useCategoryAdmin(
    selectedCategoryId || '',
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryInput>,
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

  const onSubmit = async (data: CategoryInput) => {
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
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedCategoryId ? 'แก้ไขหมวดหมู่สินค้า' : 'เพิ่มหมวดหมู่ใหม่'}
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
                      เปิดใช้งานหมวดหมู่ (Active)
                    </Switch>
                  )}
                />

                <SectionLabel>ข้อมูลพื้นฐาน</SectionLabel>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.name?.message?.toString()}
                        isInvalid={!!errors.name}
                        label='ชื่อหมวดหมู่'
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
                        placeholder='เช่น organic-honey'
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
                      label='รูปภาพหมวดหมู่ (URL)'
                      placeholder='https://example.com/image.jpg'
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
              {selectedCategoryId ? 'บันทึกการแก้ไข' : 'สร้างหมวดหมู่'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { CategoryForm }
