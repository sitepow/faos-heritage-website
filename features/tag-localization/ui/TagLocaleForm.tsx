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

import type { TagLocalizationInput } from '@/features/tag-localization/tag-localization.schema'
import type { Resolver } from 'react-hook-form'

import { useTagLocale } from '../tag-localization.hook'
import { useTagLocaleMutation } from '../tag-localization.mutation'

import { useTagUIStore } from '@/features/tag/tag.store'
import { tagLocalizationSchema } from '@/features/tag-localization/tag-localization.schema'
import localeTh from '@/messages/th/ui/common.json'

interface Props {
  tagId: string
}

const DEFAULT_VALUES: Partial<TagLocalizationInput> = {
  name: '',
  languageCode: '',
}

const TagLocaleForm = ({ tagId }: Props) => {
  const countries = localeTh.global.country

  const {
    selectedTagId: selectedLocaleId,
    isFormOpen,
    closeForm,
  } = useTagUIStore()

  const { upsert, isUpserting } = useTagLocaleMutation()

  const { data: localeData, isLoading: isLoadingLocale } = useTagLocale(
    selectedLocaleId!,
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TagLocalizationInput>({
    resolver: zodResolver(
      tagLocalizationSchema,
    ) as Resolver<TagLocalizationInput>,
    defaultValues: {
      ...DEFAULT_VALUES,
      tagId,
    } as TagLocalizationInput,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedLocaleId && localeData) {
        reset({
          id: localeData.id,
          tagId: localeData.tagId,
          name: localeData.name,
          languageCode: localeData.languageCode,
        })
      } else if (!selectedLocaleId) {
        reset({
          ...DEFAULT_VALUES,
          tagId,
        } as TagLocalizationInput)
      }
    }
  }, [isFormOpen, selectedLocaleId, localeData, reset, tagId])

  const onSubmit = async (data: TagLocalizationInput) => {
    await upsert(data)
    closeForm()
  }

  const isPending = isLoadingLocale || isUpserting

  return (
    <Modal isOpen={isFormOpen} size='md' onOpenChange={closeForm}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className='text-xl font-bold'>
            {selectedLocaleId ? 'แก้ไขการแปลภาษาแท็ก' : 'เพิ่มการแปลภาษาใหม่'}
          </ModalHeader>
          <ModalBody>
            {isLoadingLocale && selectedLocaleId ? (
              <div className='flex justify-center p-8'>
                <Spinner label='กำลังโหลดข้อมูลการแปล...' />
              </div>
            ) : (
              <div className='space-y-4'>
                <Controller
                  control={control}
                  name='languageCode'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
                      errorMessage={errors.languageCode?.message}
                      isDisabled={!!selectedLocaleId}
                      isInvalid={!!errors.languageCode}
                      label='เลือกภาษา/ประเทศ'
                      placeholder='เลือกภาษาที่ต้องการแปล'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) => {
                        onChange(Array.from(keys)[0] as string)
                      }}
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
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อแท็ก (ภาษาที่เลือก)'
                      placeholder='ระบุชื่อแท็กในภาษานั้นๆ'
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
              {selectedLocaleId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { TagLocaleForm }
