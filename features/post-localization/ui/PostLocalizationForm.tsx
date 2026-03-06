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
  Alert,
  Spinner,
  Chip,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { KeyboardEvent } from 'react'
import type { Resolver } from 'react-hook-form'

import { usePostLocale } from '../post-localization.hook'
import { usePostLocaleMutation } from '../post-localization.mutation'
import {
  postLocalizationSchema,
  type PostLocalizationInput,
} from '../post-localization.schema'
import { usePostLocaleUIStore } from '../post-localization.store'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { COUNTRY_CONFIG } from '@/constants'

interface Props {
  postId: string
}

const PostLocalizationForm = ({ postId }: Props) => {
  const { isOpen, selectedId, closeForm } = usePostLocaleUIStore()
  const [inputValue, setInputValue] = useState('')

  const { data: localization, isLoading: isLoadingLocale } = usePostLocale(
    selectedId!,
  )
  const { upsert, isUpserting } = usePostLocaleMutation()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<PostLocalizationInput>({
    resolver: zodResolver(
      postLocalizationSchema,
    ) as Resolver<PostLocalizationInput>,
    defaultValues: {
      postId,
      languageCode: '',
      title: '',
      summary: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
  })

  const keywords = watch('keywords') || []

  useEffect(() => {
    if (isOpen) {
      if (selectedId && localization) {
        return reset({
          id: localization.id,
          postId: localization.postId,
          languageCode: localization.languageCode?.toUpperCase() || '',
          title: localization.title,
          summary: localization.summary || '',
          content: localization.content || '',
          metaTitle: localization.metaTitle || '',
          metaDescription: localization.metaDescription || '',
          keywords: Array.isArray(localization.keywords)
            ? localization.keywords
            : [],
        })
      }

      return reset({
        postId,
        languageCode: '',
        title: '',
        summary: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      })
    }
  }, [isOpen, selectedId, localization, reset, postId])

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

  const onSubmit = async (data: PostLocalizationInput) => {
    return await upsert(data, {
      onSuccess: () => {
        return closeForm()
      },
    })
  }

  const languages = Object.entries(COUNTRY_CONFIG).map(([code, config]) => ({
    label: `${config.name} (${code})`,
    value: code,
  }))

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedId ? 'แก้ไขข้อมูลการแปลบทความ' : 'เพิ่มการแปลภาษาใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoadingLocale && selectedId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูลภาษา...' />
            </div>
          ) : (
            <div className='space-y-6'>
              <SectionLabel>ตั้งค่าภาษา</SectionLabel>
              <Controller
                control={control}
                name='languageCode'
                render={({ field: { value, onChange } }) => (
                  <Select
                    errorMessage={errors.languageCode?.message}
                    isDisabled={!!selectedId}
                    isInvalid={!!errors.languageCode}
                    label='ภาษาที่ต้องการแปล'
                    placeholder='เลือกภาษา'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      return onChange(Array.from(keys)[0] as string)
                    }}
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              <SectionLabel>เนื้อหาบทความ (ภาษาท้องถิ่น)</SectionLabel>
              <div className='grid grid-cols-1 gap-4'>
                <Controller
                  control={control}
                  name='title'
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.title?.message}
                      isInvalid={!!errors.title}
                      label='หัวข้อบทความ (แปล)'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='summary'
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label='สรุปเนื้อหาเบื้องต้น (แปล)'
                      value={field.value || ''}
                      variant='bordered'
                    />
                  )}
                />
              </div>

              <SectionLabel>SEO และ Keywords (ภาษาท้องถิ่น)</SectionLabel>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    label='คีย์เวิร์ด (กด , หรือ Enter เพื่อเพิ่ม)'
                    placeholder='เช่น สุขภาพ, อาหาร'
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
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Meta Title'
                        value={field.value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name='metaDescription'
                    render={({ field }) => (
                      <Input
                        {...field}
                        label='Meta Description'
                        value={field.value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                </div>
              </div>

              <Alert>
                สำหรับการแปลเนื้อหาบทความแบบละเอียด (Content)
                คุณสามารถจัดการได้ผ่านเมนู &quot;แก้ไขเนื้อหาบทความ&quot;
                ในหน้าตารางจัดการภาษาหลังจากบันทึกส่วนหัวข้อนี้แล้ว
              </Alert>
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
            {selectedId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { PostLocalizationForm }
