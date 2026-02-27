'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Spinner,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useProductUIStore } from '../../product/product.store'
import { useProductVariant } from '../product-variant.hook'
import { useProductVariantMutation } from '../product-variant.mutation'
import { variantSchema, type VariantInput } from '../product-variant.schema'
import { useProductVariantUIStore } from '../product-variant.store'

import { SectionLabel } from '@/components/ui/SectionHeader'

const DEFAULT_VALUES: VariantInput = {
  productId: '',
  name: '',
  price: 0,
  weight: 0,
  stockQuantity: 0,
  isActive: true,
  image: null,
}

const ProductVariantForm = () => {
  const { selectedVariantId, isFormOpen, closeForm } =
    useProductVariantUIStore()
  const { selectedProductId } = useProductUIStore()
  const { create, update } = useProductVariantMutation()
  const { data: variant, isLoading } = useProductVariant(selectedVariantId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<VariantInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isFormOpen) {
      if (selectedVariantId && variant) reset(variant as VariantInput)
      else reset({ ...DEFAULT_VALUES, productId: selectedProductId || '' })
    }
  }, [isFormOpen, selectedVariantId, variant, reset, selectedProductId])

  const onSubmit = async (data: VariantInput) => {
    selectedVariantId
      ? await update({ ...data, id: selectedVariantId })
      : await create(data)
    closeForm()
  }

  return (
    <Modal isOpen={isFormOpen} size='2xl' onOpenChange={closeForm}>
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          {selectedVariantId
            ? 'แก้ไขตัวเลือกสินค้า'
            : 'เพิ่มตัวเลือกสินค้าใหม่'}
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูลตัวเลือก...' />
            </div>
          ) : (
            <form
              className='space-y-6'
              id='variant-form'
              onSubmit={handleSubmit(onSubmit)}
            >
              <SectionLabel>สถานะการแสดงผล</SectionLabel>
              <div className='flex items-center gap-4'>
                <Controller
                  control={control}
                  name='isActive'
                  render={({ field: { value, onChange } }) => (
                    <Switch isSelected={!!value} onValueChange={onChange}>
                      เปิดใช้งานตัวเลือกนี้
                    </Switch>
                  )}
                />
              </div>

              <SectionLabel>ข้อมูลตัวเลือกสินค้า</SectionLabel>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    label='ชื่อตัวเลือก (เช่น ขนาด L, สีแดง, หรือปริมาณ 500ml)'
                    variant='bordered'
                  />
                )}
              />

              <SectionLabel>ราคาและน้ำหนัก</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='price'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.price?.message}
                      isInvalid={!!errors.price}
                      label='ราคาของตัวเลือกนี้'
                      type='number'
                      value={value?.toString()}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='weight'
                  render={({ field: { value, onChange, ...field } }) => (
                    <Input
                      {...field}
                      errorMessage={errors.weight?.message}
                      isInvalid={!!errors.weight}
                      label='น้ำหนัก (กรัม)'
                      type='number'
                      value={value?.toString()}
                      variant='bordered'
                      onValueChange={(v) => onChange(Number(v))}
                    />
                  )}
                />
              </div>

              <SectionLabel>การจัดการสต็อก</SectionLabel>
              <Controller
                control={control}
                name='stockQuantity'
                render={({ field: { value, onChange, ...field } }) => (
                  <Input
                    {...field}
                    errorMessage={errors.stockQuantity?.message}
                    isInvalid={!!errors.stockQuantity}
                    label='จำนวนสต็อกคงเหลือ'
                    type='number'
                    value={value?.toString()}
                    variant='bordered'
                    onValueChange={(v) => onChange(Number(v))}
                  />
                )}
              />
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
            form='variant-form'
            isDisabled={!isDirty}
            type='submit'
          >
            {selectedVariantId ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มตัวเลือก'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductVariantForm }
