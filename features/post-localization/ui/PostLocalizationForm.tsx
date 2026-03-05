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
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

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
  const { data: localization, isLoading: isLoadingLocale } = usePostLocale(
    selectedId!,
  )
  const { upsert, isUpserting } = usePostLocaleMutation()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PostLocalizationInput>({
    resolver: zodResolver(postLocalizationSchema),
    defaultValues: {
      postId,
      languageCode: '',
      title: '',
      summary: '',
      content: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (selectedId && localization) {
        reset({
          id: localization.id,
          postId: localization.postId,
          languageCode: localization?.languageCode?.toUpperCase(),
          title: localization.title,
          summary: localization.summary || '',
          content: localization.content || '',
        })
      } else if (!selectedId) {
        reset({
          postId,
          languageCode: '',
          title: '',
          summary: '',
          content: '',
        })
      }
    }
  }, [isOpen, selectedId, localization, reset, postId])

  const onSubmit = async (data: PostLocalizationInput) => {
    await upsert(data, {
      onSuccess: () => closeForm(),
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
                    onSelectionChange={(keys) =>
                      onChange(Array.from(keys)[0] as string)
                    }
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
