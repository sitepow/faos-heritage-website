/* eslint-disable react/no-array-index-key */
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
  Textarea,
  Spinner,
  Alert,
  Chip,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { KeyboardEvent } from 'react'
import type { Resolver } from 'react-hook-form'

import { useProductUIStore } from '../../product/store'
import { useProductLocale } from '../hook'
import { useProductLocaleMutation } from '../mutation'
import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from '../schema'
import { useProductLocaleUIStore } from '../store'

import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { SectionLabel } from '@/components/ui/SectionHeader'
import localeTh from '@/messages/th/ui/common.json'

const DEFAULT_VALUES: ProductLocalizationInput = {
  productId: '',
  languageCode: '',
  name: '',
  summary: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  keywords: [],
}

const ProductLocalizationForm = () => {
  const countries = localeTh.global.country
  const { selectedLocalizationId, isFormOpen, closeForm } =
    useProductLocaleUIStore()
  const { selectedProductId } = useProductUIStore()
  const { create, update, isCreating, isUpdating } = useProductLocaleMutation()

  const [inputValue, setInputValue] = useState('')

  const { data: localization, isLoading } = useProductLocale(
    selectedLocalizationId,
  )

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductLocalizationInput>({
    resolver: zodResolver(
      productLocalizationSchema,
    ) as Resolver<ProductLocalizationInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const keywords = watch('keywords') || []

  useEffect(() => {
    if (isFormOpen) {
      if (selectedLocalizationId && localization) {
        return reset({
          id: localization.id,
          productId: localization.productId,
          languageCode: localization.languageCode || '',
          name: localization.name || '',
          summary: localization.summary || '',
          description: localization.description || '',
          metaTitle: localization.metaTitle || '',
          metaDescription: localization.metaDescription || '',
          keywords: Array.isArray(localization.keywords)
            ? localization.keywords
            : [],
        })
      }

      return reset({ ...DEFAULT_VALUES, productId: selectedProductId || '' })
    }
  }, [
    isFormOpen,
    selectedLocalizationId,
    localization,
    reset,
    selectedProductId,
  ])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      const value = inputValue.trim()
      if (value && !keywords.includes(value)) {
        setValue('keywords', [...keywords, value], { shouldDirty: true })
        return setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      const newKeywords = [...keywords]
      newKeywords.pop()
      return setValue('keywords', newKeywords, { shouldDirty: true })
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    return setValue(
      'keywords',
      keywords.filter((_, i) => i !== indexToRemove),
      { shouldDirty: true },
    )
  }

  const onSubmit = async (data: ProductLocalizationInput) => {
    if (selectedLocalizationId) {
      await update({ ...data, id: selectedLocalizationId })
    } else {
      await create(data)
    }
    closeForm()
  }

  const isPending = isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedLocalizationId ? 'แก้ไขการแปลภาษา' : 'เพิ่มการแปลภาษาใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูล...' />
            </div>
          ) : (
            <div className='space-y-6'>
              <SectionLabel>ข้อมูลภาษาและชื่อสินค้า</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='languageCode'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
                      errorMessage={errors.languageCode?.message}
                      isDisabled={!!selectedLocalizationId}
                      isInvalid={!!errors.languageCode}
                      label='เลือกภาษา/ประเทศ'
                      placeholder='เลือกภาษาที่ต้องการแปล'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) => {
                        return onChange(Array.from(keys)[0] as string)
                      }}
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
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อสินค้า (ภาษาที่เลือก)'
                      variant='bordered'
                    />
                  )}
                />
              </div>

              <SectionLabel>รายละเอียดโดยย่อ</SectionLabel>
              <Controller
                control={control}
                name='summary'
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    label='คำอธิบายสั้น (Short Description)'
                    value={value || ''}
                    variant='bordered'
                  />
                )}
              />

              <SectionLabel>SEO และ Keywords (ภาษาที่เลือก)</SectionLabel>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    label='คีย์เวิร์ด (กด , หรือ Enter เพื่อเพิ่ม)'
                    placeholder='เช่น มะกอก, ออร์แกนิก'
                    value={inputValue}
                    variant='bordered'
                    onChange={(e) => {
                      return setInputValue(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <div className='flex flex-wrap gap-2 px-1'>
                    {keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        color='primary'
                        variant='flat'
                        onClose={() => {
                          return removeKeyword(index)
                        }}
                      >
                        {keyword}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <Controller
                    control={control}
                    name='metaTitle'
                    render={({ field: { value, ...field } }) => (
                      <Input
                        {...field}
                        label='Meta Title'
                        value={value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='metaDescription'
                    render={({ field: { value, ...field } }) => (
                      <Input
                        {...field}
                        label='Meta Description'
                        value={value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                </div>
              </div>

              <Alert>
                * สำหรับรายละเอียดเนื้อหา (Description) แบบเต็ม
                คุณสามารถจัดการได้ผ่านปุ่ม "แก้ไขรายละเอียดเนื้อหา"
                ในหน้าตารางหลังจากบันทึกข้อมูลส่วนนี้แล้ว
              </Alert>
              <AlertSeoBestPractice />
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
            onPress={() => {
              return handleSubmit(onSubmit)()
            }}
          >
            {selectedLocalizationId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductLocalizationForm }
