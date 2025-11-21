'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import type { ProductInput } from '../../schema/product'
import type { FC } from 'react'

import { createProduct } from '../../action'
import { productSchema } from '../../schema/product'

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ProductForm: FC<Props> = ({ isOpen, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
  })

  const onSubmit = (data: ProductInput) => {
    mutate(data)
  }

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      scrollBehavior='inside'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          เพิ่มสินค้าใหม่
        </ModalHeader>
        <ModalBody>
          <div className='flex items-center gap-6'>
            <Switch {...register('isActive')}>เปิดการขายสินค้า</Switch>
            <Switch {...register('isFeatured')}>แนะนำสินค้า</Switch>
          </div>

          <Input
            label='ชื่อสินค้า'
            {...register('name')}
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
          />
          <Input
            label='Slug (SEO)'
            {...register('slug')}
            errorMessage={errors.slug?.message}
            isInvalid={!!errors.slug}
          />
          <Input label='SKU' {...register('sku')} />
          <Input label='บาร์โค้ด' {...register('barcode')} />
          <Input
            label='ราคา (บาท)'
            type='number'
            {...register('price', { valueAsNumber: true })}
            errorMessage={errors.price?.message}
            isInvalid={!!errors.price}
          />
          <Input
            label='ราคาก่อนลด (ถ้ามี)'
            type='number'
            {...register('compareAtPrice', { valueAsNumber: true })}
            errorMessage={errors.compareAtPrice?.message}
            isInvalid={!!errors.compareAtPrice}
          />
          <Input
            label='ราคาทุน (ภายใน)'
            type='number'
            {...register('costPrice', { valueAsNumber: true })}
            errorMessage={errors.costPrice?.message}
            isInvalid={!!errors.costPrice}
          />
          <Input
            label='จำนวนในสต็อก'
            type='number'
            {...register('stockQuantity', { valueAsNumber: true })}
            errorMessage={errors.stockQuantity?.message}
            isInvalid={!!errors.stockQuantity}
          />
          <Input
            label='แจ้งเตือนเมื่อสต็อกต่ำกว่า'
            type='number'
            {...register('lowStockAlert', { valueAsNumber: true })}
            errorMessage={errors.lowStockAlert?.message}
            isInvalid={!!errors.lowStockAlert}
          />
          <Input
            label='น้ำหนัก (กรัม)'
            type='number'
            {...register('weight', { valueAsNumber: true })}
            errorMessage={errors.weight?.message}
            isInvalid={!!errors.weight}
          />
          <Select
            label='หมวดหมู่สินค้า'
            {...register('categoryId')}
            errorMessage={errors.categoryId?.message}
            isInvalid={!!errors.categoryId}
          >
            <SelectItem key='clothing'>เสื้อผ้า</SelectItem>
            <SelectItem key='accessory'>เครื่องประดับ</SelectItem>
            <SelectItem key='electronics'>อุปกรณ์อิเล็กทรอนิกส์</SelectItem>
          </Select>
          <Input
            label='Meta Title (SEO)'
            {...register('metaTitle', {
              maxLength: {
                value: 60,
                message: 'Meta title ควรมีไม่เกิน 60 ตัวอักษร',
              },
            })}
            errorMessage={errors.metaTitle?.message}
            isInvalid={!!errors.metaTitle}
          />
          <Textarea
            label='รายละเอียดสินค้า'
            minRows={3}
            {...register('description')}
          />
          <Textarea
            label='Meta Description (SEO)'
            minRows={3}
            {...register('metaDescription')}
            errorMessage={errors.metaDescription?.message}
            isInvalid={!!errors.metaDescription}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={isPending}
            variant='faded'
            onPress={() => {
              onOpenChange()
              reset()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            disabled={isPending}
            isLoading={isPending}
            variant='faded'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'กำลังดำเนินการ' : 'บันทึกสินค้า'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductForm }
