'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from '@heroui/react'
import { useForm } from 'react-hook-form'

import type { ProductVariant } from '@prisma/client'
import type { FC } from 'react'

type ProductVariantInput = Omit<
  ProductVariant,
  'id' | 'productId' | 'createdAt' | 'updatedAt'
>

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ProductVariantForm: FC<Props> = ({ isOpen, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductVariantInput>()

  const onSubmit = (data: ProductVariantInput) => {
    console.log(data)
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='outside'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className='flex flex-col gap-1'>
              เพิ่มตัวเลือกสินค้า
            </ModalHeader>
            <ModalBody className='space-y-4'>
              <Input
                label='ชื่อตัวเลือก'
                placeholder='เช่น สีดำ / ไซซ์ L'
                {...register('name', {
                  required: 'กรุณากรอกชื่อตัวเลือก',
                  minLength: {
                    value: 1,
                    message: 'ต้องมีอย่างน้อย 1 ตัวอักษร',
                  },
                })}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
              />
              <Input
                label='SKU (ถ้ามี)'
                placeholder='เช่น CAT-BLACK-L'
                {...register('sku')}
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
                label='จำนวนในสต็อก'
                placeholder='0'
                type='number'
                {...register('stockQuantity', {
                  required: 'กรุณากรอกจำนวนในสต็อก',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'จำนวนต้องไม่น้อยกว่า 0',
                  },
                })}
                errorMessage={errors.stockQuantity?.message}
                isInvalid={!!errors.stockQuantity}
              />
              <Switch {...register('isActive')}>เปิดใช้งานตัวเลือกนี้</Switch>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                ยกเลิก
              </Button>
              <Button color='primary' type='submit'>
                บันทึกตัวเลือก
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export { ProductVariantForm }
