'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { BlogCategoryLocalizationInput } from '../blog-category-localization.schema'
import type { Resolver } from 'react-hook-form'

import { useBlogCategoryLocales } from '../blog-category-localization.hook'
import { useBlogCategoryLocaleMutation } from '../blog-category-localization.mutation'
import { blogCategoryLocalizationSchema } from '../blog-category-localization.schema'

import { useBlogCategoryUIStore } from '@/features/blog-category/blog-category.store'
import localeTh from '@/messages/th/ui/common.json'

interface Props {
  blogCategoryId: string
}

const DEFAULT_VALUES: Partial<BlogCategoryLocalizationInput> = {
  name: '',
  languageCode: '',
}

const BlogCategoryLocaleForm = ({ blogCategoryId }: Props) => {
  const countries = localeTh.global.country
  const {
    selectedCategoryId: selectedLocaleId,
    isFormOpen,
    closeForm,
  } = useBlogCategoryUIStore()

  const { upsert, isUpserting } = useBlogCategoryLocaleMutation()
  const { data: localizations, isLoading: isLoadingLocales } =
    useBlogCategoryLocales(blogCategoryId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BlogCategoryLocalizationInput>({
    resolver: zodResolver(
      blogCategoryLocalizationSchema,
    ) as Resolver<BlogCategoryLocalizationInput>,
    defaultValues: {
      ...DEFAULT_VALUES,
      blogCategoryId,
    } as BlogCategoryLocalizationInput,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedLocaleId && localizations) {
        const target = localizations.find((l) => l.id === selectedLocaleId)
        if (target) {
          reset({
            id: target.id,
            blogCategoryId: target.blogCategoryId,
            name: target.name,
            languageCode: target.languageCode,
          })
        }
      } else {
        reset({
          ...DEFAULT_VALUES,
          blogCategoryId,
        } as BlogCategoryLocalizationInput)
      }
    }
  }, [isFormOpen, selectedLocaleId, localizations, reset, blogCategoryId])

  const onSubmit = async (data: BlogCategoryLocalizationInput) => {
    await upsert(data)
    closeForm()
  }

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      size='md'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedLocaleId
            ? 'แก้ไขการแปลภาษา (Blog)'
            : 'เพิ่มการแปลภาษาใหม่ (Blog)'}
        </ModalHeader>
        <ModalBody>
          {isLoadingLocales && selectedLocaleId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลด...' />
            </div>
          ) : (
            <div className='space-y-4'>
              <Controller
                control={control}
                name='languageCode'
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    {...field}
                    errorMessage={errors.languageCode?.message?.toString()}
                    isDisabled={!!selectedLocaleId}
                    isInvalid={!!errors.languageCode}
                    label='เลือกภาษา/ประเทศ'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) =>
                      onChange(Array.from(keys)[0] as string)
                    }
                  >
                    {Object.entries(countries).map(([code, name]) => (
                      <SelectItem key={code} textValue={name as string}>
                        {name as string} ({code})
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name?.message?.toString()}
                    isInvalid={!!errors.name}
                    label='ชื่อหมวดหมู่ที่แปลแล้ว'
                    placeholder='ระบุชื่อในภาษานั้นๆ'
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
            isLoading={isUpserting}
            onClick={handleSubmit(onSubmit)}
          >
            {selectedLocaleId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { BlogCategoryLocaleForm }
