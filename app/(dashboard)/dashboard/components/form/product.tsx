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
import { useForm } from 'react-hook-form'

import type { Product } from '@prisma/client'
import type { FC } from 'react'

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ProductForm: FC<Props> = ({ isOpen, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>()

  const onSubmit = (data: ProductInput) => {
    console.log(data)
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='outside'
      size='3xl'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className='flex flex-col gap-1'>
              เพิ่มสินค้าใหม่
            </ModalHeader>
            <ModalBody className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label='ชื่อสินค้า'
                  placeholder='เช่น เสื้อยืดลายแมว'
                  {...register('name', {
                    required: 'กรุณากรอกชื่อสินค้า',
                    minLength: {
                      value: 2,
                      message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
                    },
                  })}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                />
                <Input
                  label='Slug'
                  placeholder='เช่น cat-tshirt'
                  {...register('slug', {
                    required: 'กรุณากรอก slug',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        'Slug ต้องเป็นตัวพิมพ์เล็กและใช้ - คั่นคำเท่านั้น',
                    },
                  })}
                  errorMessage={errors.slug?.message}
                  isInvalid={!!errors.slug}
                />
                <Input
                  label='SKU'
                  placeholder='เช่น CAT-001'
                  {...register('sku')}
                />
                <Input
                  label='บาร์โค้ด'
                  placeholder='เช่น 123456789'
                  {...register('barcode')}
                />
                <Input
                  label='ราคา (บาท)'
                  placeholder='0.00'
                  type='number'
                  {...register('price', {
                    required: 'กรุณากรอกราคา',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'ราคาต้องไม่ติดลบ',
                    },
                  })}
                  errorMessage={errors.price?.message}
                  isInvalid={!!errors.price}
                />
                <Input
                  label='ราคาก่อนลด (ถ้ามี)'
                  placeholder='0.00'
                  type='number'
                  {...register('compareAtPrice', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'ราคาต้องไม่ติดลบ',
                    },
                  })}
                  errorMessage={errors.compareAtPrice?.message}
                  isInvalid={!!errors.compareAtPrice}
                />
                <Input
                  label='ราคาทุน (ภายใน)'
                  placeholder='0.00'
                  type='number'
                  {...register('costPrice', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'ราคาทุนต้องไม่ติดลบ',
                    },
                  })}
                  errorMessage={errors.costPrice?.message}
                  isInvalid={!!errors.costPrice}
                />
                <Input
                  label='จำนวนในสต็อก'
                  placeholder='0'
                  type='number'
                  {...register('stockQuantity', {
                    required: 'กรุณากรอกจำนวนสินค้า',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'จำนวนสินค้าอย่างน้อย 0 ชิ้น',
                    },
                  })}
                  errorMessage={errors.stockQuantity?.message}
                  isInvalid={!!errors.stockQuantity}
                />
                <Input
                  label='แจ้งเตือนเมื่อสต็อกต่ำกว่า'
                  placeholder='10'
                  type='number'
                  {...register('lowStockAlert', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'ค่าต้องไม่น้อยกว่า 0',
                    },
                  })}
                  errorMessage={errors.lowStockAlert?.message}
                  isInvalid={!!errors.lowStockAlert}
                />
                <Input
                  label='น้ำหนัก (กรัม)'
                  placeholder='0'
                  type='number'
                  {...register('weight', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'น้ำหนักต้องไม่น้อยกว่า 0',
                    },
                  })}
                  errorMessage={errors.weight?.message}
                  isInvalid={!!errors.weight}
                />
              </div>
              <Select
                label='หมวดหมู่สินค้า'
                placeholder='เลือกหมวดหมู่'
                {...register('categoryId', {
                  required: 'กรุณาเลือกหมวดหมู่สินค้า',
                })}
                errorMessage={errors.categoryId?.message}
                isInvalid={!!errors.categoryId}
              >
                <SelectItem key='clothing'>เสื้อผ้า</SelectItem>
                <SelectItem key='accessory'>เครื่องประดับ</SelectItem>
                <SelectItem key='electronics'>อุปกรณ์อิเล็กทรอนิกส์</SelectItem>
              </Select>
              <Textarea
                label='รายละเอียดสินค้า'
                minRows={3}
                placeholder='อธิบายคุณสมบัติ จุดเด่น หรือวัสดุที่ใช้...'
                {...register('description')}
              />
              <Input
                label='Meta Title'
                placeholder='ใช้สำหรับ SEO'
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
                label='Meta Description'
                minRows={3}
                placeholder='รายละเอียด SEO สั้น ๆ...'
                {...register('metaDescription', {
                  maxLength: {
                    value: 160,
                    message: 'Meta description ควรมีไม่เกิน 160 ตัวอักษร',
                  },
                })}
                errorMessage={errors.metaDescription?.message}
                isInvalid={!!errors.metaDescription}
              />
              <div className='flex items-center gap-6'>
                <Switch {...register('isActive')}>เปิดการขาย</Switch>
                <Switch {...register('isFeatured')}>แนะนำสินค้า</Switch>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                ยกเลิก
              </Button>
              <Button color='primary' type='submit'>
                บันทึกสินค้า
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export { ProductForm }
