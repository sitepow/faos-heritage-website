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
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductUnit } from '@prisma/client'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { useProductAdmin } from '../product.hook'
import { useProductMutation } from '../product.mutation'
import { productSchema, type ProductInput } from '../product.schema'
import { useProductUIStore } from '../product.store'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { useCategories } from '@/features/category/category.hook'
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
  const { create, update, isCreating, isUpdating } = useProductMutation()

  const { data: categories } = useCategories({ locale: undefined })

  const { data: product, isLoading: isLoadingProduct } = useProductAdmin(
    selectedProductId || '',
    isFormOpen,
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedProductId && product) {
        reset(product as ProductInput)
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isFormOpen, selectedProductId, product, reset])

  const onSubmit = async (data: ProductInput) => {
    if (selectedProductId) {
      await update({ ...data, id: selectedProductId })
    } else {
      await create(data)
    }
    closeForm()
  }

  const isPending = isLoadingProduct || isCreating || isUpdating

  return (
    <Modal
      isOpen={isFormOpen}
      scrollBehavior='inside'
      size='4xl'
      onOpenChange={closeForm}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedProductId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
        </ModalHeader>
        <ModalBody>
          {!isLoadingProduct && (
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <SectionLabel>สถานะและการแสดงผล</SectionLabel>
              <div className='flex flex-wrap gap-6'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Switch
                      {...field}
                      isSelected={!!value}
                      onValueChange={onChange}
                    >
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
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label='ชื่อสินค้า'
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='slug'
                  render={({ field: { value, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.slug?.message}
                      isInvalid={!!errors.slug}
                      label='URL Slug (เช่น organic-honey)'
                      placeholder='ระบุ slug ภาษาอังกฤษ'
                      value={value?.toString()}
                      variant='bordered'
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='categoryId'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
                      errorMessage={errors.categoryId?.message}
                      isInvalid={!!errors.categoryId}
                      label='หมวดหมู่สินค้า'
                      selectedKeys={value ? [value] : []}
                      variant='bordered'
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys)[0] as string)
                      }
                    >
                      {(categories ?? []).map((cat) => (
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
                      label='จำนวนสต็อก'
                      type='number'
                      value={value?.toString()}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
              </div>

              <SectionLabel>หน่วยและน้ำหนัก</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='unit'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Select
                      {...field}
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
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    label='คำอธิบายสั้น (Summary)'
                    value={value || ''}
                    variant='bordered'
                  />
                )}
              />

              <SectionLabel>SEO และ Metadata</SectionLabel>
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
            {selectedProductId ? 'บันทึกการแก้ไข' : 'บันทึกและเพิ่มสินค้า'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductForm }
