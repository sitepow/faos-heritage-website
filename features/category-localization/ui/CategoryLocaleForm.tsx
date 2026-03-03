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

import type { CategoryLocalizationInput } from '../category-localization.schema'
import type { Resolver } from 'react-hook-form'

import { useCategoryLocales } from '../category-localization.hook'
import { useCategoryLocaleMutation } from '../category-localization.mutation'
import { categoryLocalizationSchema } from '../category-localization.schema'

import { useCategoryUIStore } from '@/features/category/category.store'
import localeTh from '@/messages/th/ui/common.json'

interface Props {
  categoryId: string
}

const DEFAULT_VALUES: Partial<CategoryLocalizationInput> = {
  name: '',
  languageCode: '',
}

const CategoryLocaleForm = ({ categoryId }: Props) => {
  const countries = localeTh.global.country
  const {
    selectedCategoryId: selectedLocaleId,
    isFormOpen,
    closeForm,
  } = useCategoryUIStore()
  const { upsert, isUpserting } = useCategoryLocaleMutation(categoryId)
  const { data: localizations, isLoading: isLoadingLocales } =
    useCategoryLocales(categoryId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CategoryLocalizationInput>({
    resolver: zodResolver(
      categoryLocalizationSchema,
    ) as Resolver<CategoryLocalizationInput>,
    defaultValues: {
      ...DEFAULT_VALUES,
      categoryId,
    } as CategoryLocalizationInput,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedLocaleId && localizations) {
        const target = localizations.find((l) => l.id === selectedLocaleId)
        if (target) {
          reset({
            id: target.id,
            categoryId: target.categoryId,
            name: target.name,
            languageCode: target.languageCode,
          })
        }
      } else {
        reset({ ...DEFAULT_VALUES, categoryId } as CategoryLocalizationInput)
      }
    }
  }, [isFormOpen, selectedLocaleId, localizations, reset, categoryId])

  const onSubmit = async (data: CategoryLocalizationInput) => {
    await upsert(data)
    closeForm()
  }

  return (
    <Modal isOpen={isFormOpen} size='md' onOpenChange={closeForm}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedLocaleId
              ? 'แก้ไขการแปลภาษาหมวดหมู่'
              : 'เพิ่มการแปลภาษาใหม่'}
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
                      isDisabled={!!selectedLocaleId}
                      label='เลือกภาษา/ประเทศ'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0] as string)
                      }
                    >
                      {Object.entries(countries).map(([code, name]) => (
                        <SelectItem key={code} textValue={name}>
                          {name} ({code})
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
                      label='ชื่อหมวดหมู่ (ภาษาที่เลือก)'
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
              className='text-secondary'
              color='primary'
              isDisabled={!isDirty}
              isLoading={isUpserting}
              type='submit'
            >
              {selectedLocaleId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { CategoryLocaleForm }
