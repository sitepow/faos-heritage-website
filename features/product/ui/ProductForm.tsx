/* eslint-disable react/no-array-index-key */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Switch,
  Input,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  Textarea,
  Alert,
  Chip,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductUnit } from '@prisma/client'
import { useEffect, useState, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { KeyboardEvent } from 'react'
import type { Resolver } from 'react-hook-form'

import { useProductAdmin } from '../hook'
import { useProductMutation } from '../mutation'
import { productSchema, type ProductInput } from '../schema'
import { useProductUIStore, useProductDetailStore } from '../store'

import { AlertSeoBestPractice } from '@/components/ui/AlertSeoBestPractice'
import { SectionLabel } from '@/components/ui/SectionHeader'
import { useCategories } from '@/features/category/hook'
import localeTh from '@/messages/th/ui/common.json'

const DEFAULT_VALUES: ProductInput = {
  name: '',
  slug: '',
  price: 0,
  salePrice: null,
  stockQuantity: 0,
  weight: null,
  unit: ProductUnit.UNIT,
  isActive: true,
  categoryId: '',
  summary: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  keywords: [],
}

const ProductForm = () => {
  const unitTranslations = localeTh.global.productUnit
  const { selectedProductId, isFormOpen, closeForm } = useProductUIStore()
  const { reset: resetDetailStore } = useProductDetailStore()
  const { create, update, isCreating, isUpdating } = useProductMutation()

  const [keywordInput, setKeywordInput] = useState('')

  const { data: categoriesRes } = useCategories({ locale: undefined })
  const categories = categoriesRes || []

  const { data: product, isLoading: isLoadingProduct } = useProductAdmin(
    selectedProductId || '',
    isFormOpen,
  )

  const {
    control,
    handleSubmit,
    reset: resetForm,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const keywords = watch('keywords') || []

  const handleClose = useCallback(() => {
    closeForm()
    resetDetailStore()
    resetForm(DEFAULT_VALUES)
    setKeywordInput('')
  }, [closeForm, resetDetailStore, resetForm])

  useEffect(() => {
    if (isFormOpen) {
      if (selectedProductId && product) {
        resetForm({
          ...product,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          weight: product.weight ? Number(product.weight) : null,
          keywords: product.keywords ?? [],
        } as ProductInput)
      } else {
        resetForm(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedProductId, product, resetForm])

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      const value = keywordInput.trim()
      if (value && !keywords.includes(value)) {
        const newKeywords = [...keywords, value]
        setValue('keywords', newKeywords, { shouldDirty: true })
        setKeywordInput('')
      }
    } else if (e.key === 'Backspace' && !keywordInput && keywords.length > 0) {
      const newKeywords = [...keywords]
      newKeywords.pop()
      setValue('keywords', newKeywords, { shouldDirty: true })
    }
  }

  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove)
    setValue('keywords', newKeywords, { shouldDirty: true })
  }

  const onSubmit = async (data: ProductInput) => {
    if (selectedProductId) {
      await update({ ...data, id: selectedProductId })
    } else {
      await create(data)
    }
    handleClose()
  }

  const isPending = isLoadingProduct || isCreating || isUpdating

  return (
    <Modal
      hideCloseButton
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='4xl'
      onOpenChange={handleClose}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedProductId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoadingProduct && selectedProductId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูลสินค้า...' />
            </div>
          ) : (
            <div className='space-y-6'>
              <SectionLabel>สถานะและการแสดงผล</SectionLabel>
              <div className='flex flex-wrap gap-6'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange } }) => (
                    <Switch isSelected={!!value} onValueChange={onChange}>
                      เปิดใช้งานสินค้า (Active)
                    </Switch>
                  )}
                />
              </div>

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
                      label='ชื่อสินค้า'
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
                      value={field.value ?? ''}
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='categoryId'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      errorMessage={errors.categoryId?.message?.toString()}
                      isInvalid={!!errors.categoryId}
                      label='หมวดหมู่สินค้า'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0] as string)
                      }
                    >
                      {(categories || []).map((cat) => (
                        <SelectItem key={cat?.id!}>{cat?.name!}</SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              <SectionLabel>ราคาและสต็อก</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <Controller
                  control={control}
                  name='price'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.price?.message?.toString()}
                      isInvalid={!!errors.price}
                      label='ราคาปกติ'
                      type='number'
                      value={value?.toString()}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='salePrice'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.salePrice?.message?.toString()}
                      isInvalid={!!errors.salePrice}
                      label='ราคาลด (ถ้ามี)'
                      type='number'
                      value={value?.toString() || ''}
                      variant='bordered'
                      onValueChange={(v) => onChange(v ? Number(v) : null)}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='stockQuantity'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.stockQuantity?.message?.toString()}
                      isInvalid={!!errors.stockQuantity}
                      label='จำนวนสต็อก'
                      type='number'
                      value={value?.toString()}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
              </div>

              <Alert>
                หากไม่มีตัวเลือกสินค้า ให้ระบุราคาและสต็อกที่นี่
                หากมีตัวเลือกสินค้า (Variants) ให้ไประบุที่เมนู
                จัดการตัวเลือกสินค้า
              </Alert>

              <SectionLabel>หน่วยและน้ำหนัก</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='unit'
                  render={({ field: { value, onChange } }) => (
                    <Select
                      errorMessage={errors.unit?.message?.toString()}
                      isInvalid={!!errors.unit}
                      label='หน่วยสินค้า'
                      selectedKeys={[value]}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0] as ProductUnit)
                      }
                    >
                      {Object.values(ProductUnit).map((unit) => (
                        <SelectItem key={unit}>
                          {unitTranslations[
                            unit as keyof typeof unitTranslations
                          ] || unit}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name='weight'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.weight?.message?.toString()}
                      isInvalid={!!errors.weight}
                      label='น้ำหนัก (กรัม)'
                      type='number'
                      value={value?.toString() || ''}
                      variant='bordered'
                      onValueChange={(v) => onChange(v ? Number(v) : null)}
                    />
                  )}
                />
              </div>

              <SectionLabel>สรุปเนื้อหาเบื้องต้น</SectionLabel>
              <Controller
                control={control}
                name='summary'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    errorMessage={errors.summary?.message?.toString()}
                    isInvalid={!!errors.summary}
                    label='คำอธิบายสั้น (Summary)'
                    value={field.value || ''}
                    variant='bordered'
                  />
                )}
              />

              <SectionLabel>SEO และ Keywords</SectionLabel>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    label='คีย์เวิร์ดสินค้า (กด , หรือ Enter เพื่อเพิ่ม)'
                    placeholder='เช่น น้ำผึ้งแท้, ออร์แกนิค'
                    value={keywordInput}
                    variant='bordered'
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                  />
                  <div className='flex flex-wrap gap-2 px-1'>
                    {keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        color='primary'
                        variant='flat'
                        onClose={() => removeKeyword(index)}
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
                        errorMessage={errors.metaTitle?.message?.toString()}
                        isInvalid={!!errors.metaTitle}
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
                        errorMessage={errors.metaDescription?.message?.toString()}
                        isInvalid={!!errors.metaDescription}
                        label='Meta Description'
                        value={field.value || ''}
                        variant='bordered'
                      />
                    )}
                  />
                </div>
              </div>
              <Alert>
                * สำหรับรายละเอียดเนื้อหา (Description) แบบเต็ม
                คุณสามารถจัดการได้ผ่านปุ่ม &quot;แก้ไขรายละเอียดเนื้อหา&quot;
                หลังบันทึกข้อมูลส่วนนี้แล้ว
              </Alert>
              <AlertSeoBestPractice />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='flat' onPress={handleClose}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            isDisabled={!isDirty}
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {selectedProductId ? 'บันทึกการแก้ไข' : 'บันทึกและเพิ่มสินค้า'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductForm }
