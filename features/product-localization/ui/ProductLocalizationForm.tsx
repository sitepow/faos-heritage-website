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
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { useProductUIStore } from '../../product/product.store'
import { useProductLocale } from '../product-localization.hook'
import { useProductLocaleMutation } from '../product-localization.mutation'
import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from '../product-localization.schema'
import { useProductLocaleUIStore } from '../product-localization.store'

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
}

const ProductLocalizationForm = () => {
  const countries = localeTh.global.country
  const { selectedLocalizationId, isFormOpen, closeForm } =
    useProductLocaleUIStore()
  const { selectedProductId } = useProductUIStore()
  const { create, update, isCreating, isUpdating } = useProductLocaleMutation()

  const { data: localization, isLoading } = useProductLocale(
    selectedLocalizationId,
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductLocalizationInput>({
    resolver: zodResolver(
      productLocalizationSchema,
    ) as Resolver<ProductLocalizationInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedLocalizationId && localization) {
        reset(localization as ProductLocalizationInput)
      } else {
        reset({ ...DEFAULT_VALUES, productId: selectedProductId || '' })
      }
    }
  }, [
    isFormOpen,
    selectedLocalizationId,
    localization,
    reset,
    selectedProductId,
  ])

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
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <SectionLabel>ข้อมูลภาษาและชื่อสินค้า</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='languageCode'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
                      errorMessage={errors.languageCode?.message}
                      isInvalid={!!errors.languageCode}
                      label='เลือกภาษา/ประเทศ'
                      placeholder='เลือกภาษาที่ต้องการแปล'
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

              <SectionLabel>SEO และ Metadata (ภาษาที่เลือก)</SectionLabel>
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

              <Alert>
                * สำหรับรายละเอียดเนื้อหา (Description) แบบเต็ม
                คุณสามารถจัดการได้ผ่านปุ่ม "แก้ไขรายละเอียดเนื้อหา"
                ในหน้าตารางหลังจากบันทึกข้อมูลส่วนนี้แล้ว
              </Alert>
            </form>
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
            onPress={() => handleSubmit(onSubmit)()}
          >
            {selectedLocalizationId ? 'บันทึกการแก้ไข' : 'เพิ่มการแปลภาษา'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductLocalizationForm }
