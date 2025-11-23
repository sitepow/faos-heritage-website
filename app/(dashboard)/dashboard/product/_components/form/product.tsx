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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ProductInput } from '../../schema/product'

import { createProduct, getProduct, updateProduct } from '../../action'
import { productSchema } from '../../schema/product'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'

const DEFAULT_VALUES: ProductInput = {
  isActive: true,
  isFeatured: false,
  name: '',
  categoryId: '',
  sku: '',
  barcode: '',
  price: 0,
  compareAtPrice: 0,
  costPrice: 0,
  stockQuantity: 0,
  lowStockAlert: 0,
  weight: 0,
  slug: '',
  metaTitle: '',
  metaDescription: '',
  description: '',
}

interface Props {
  isOpen: boolean
  onOpenChange: () => void
}

const ProductForm: FC<Props> = ({ isOpen, onOpenChange }) => {
  const { productId, setProductState } = useProductStore()
  const queryClient = useQueryClient()

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['dashboard', 'product', productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId && isOpen,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isOpen) {
      if (productId && !isLoadingProduct && product) {
        reset(product)
      } else if (!productId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isOpen, productId, product, isLoadingProduct, reset])

  const { mutate: mutateCreateProduct, isPending: isPendingCreateProduct } =
    useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'products'] })
        onClose()
      },
    })

  const { mutate: mutateUpdateProduct, isPending: isPendingUpdateProduct } =
    useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'products'] })
        onClose()
      },
    })

  const isPending =
    isLoadingProduct || isPendingCreateProduct || isPendingUpdateProduct
  const headerLable = productId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'

  const onSubmit = (data: ProductInput) => {
    if (!productId) {
      mutateCreateProduct(data)
    } else {
      mutateUpdateProduct(data)
    }
  }

  const onClose = () => {
    queryClient.removeQueries({ queryKey: ['dashboard', 'product', productId] })
    setProductState({ productId: null })
    reset(DEFAULT_VALUES)
    onOpenChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>
        <ModalBody>
          <SubHeader title='สถานะสินค้า' />
          <div className='flex gap-6'>
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  เปิดการขายสินค้า
                </Switch>
              )}
            />
            <Controller
              control={control}
              name='isFeatured'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  แนะนำสินค้า
                </Switch>
              )}
            />
          </div>

          <SubHeader title='ข้อมูลพื้นฐาน' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='ชื่อสินค้า'
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
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0]

                    onChange(selected)
                  }}
                >
                  <SelectItem key='clothing'>เสื้อผ้า</SelectItem>
                  <SelectItem key='accessory'>เครื่องประดับ</SelectItem>
                  <SelectItem key='electronics'>
                    อุปกรณ์อิเล็กทรอนิกส์
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              control={control}
              name='sku'
              render={({ field: { value, ...field } }) => (
                <Input {...field} label='SKU' value={value ?? ''} />
              )}
            />
            <Controller
              control={control}
              name='barcode'
              render={({ field: { value, ...field } }) => (
                <Input {...field} label='บาร์โค้ด' value={value ?? ''} />
              )}
            />
            <Controller
              control={control}
              name='description'
              render={({ field: { value, ...field } }) => (
                <Textarea
                  {...field}
                  label='รายละเอียดสินค้า'
                  minRows={3}
                  value={value ?? ''}
                />
              )}
            />
          </div>

          <SubHeader title='ราคาสินค้า' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Controller
              control={control}
              name='price'
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.price?.message}
                  isInvalid={!!errors.price}
                  label='ราคา (บาท)'
                  type='number'
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseFloat(val) : 0)}
                />
              )}
            />
            <Controller
              control={control}
              name='compareAtPrice'
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.compareAtPrice?.message}
                  isInvalid={!!errors.compareAtPrice}
                  label='ราคาก่อนลด'
                  type='number'
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseFloat(val) : 0)}
                />
              )}
            />
            <Controller
              control={control}
              name='costPrice'
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.costPrice?.message}
                  isInvalid={!!errors.costPrice}
                  label='ราคาทุน (ภายใน)'
                  type='number'
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseFloat(val) : 0)}
                />
              )}
            />
          </div>

          <SubHeader title='สต็อกสินค้า' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Controller
              control={control}
              name='stockQuantity'
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.stockQuantity?.message}
                  isInvalid={!!errors.stockQuantity}
                  label='จำนวนในสต็อก'
                  type='number'
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseInt(val) : 0)}
                />
              )}
            />
            <Controller
              control={control}
              name='lowStockAlert'
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.lowStockAlert?.message}
                  isInvalid={!!errors.lowStockAlert}
                  label='แจ้งเตือนเมื่อสต็อกต่ำกว่า'
                  type='number'
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseInt(val) : 0)}
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
                  value={value?.toString() ?? ''}
                  onValueChange={(val) => onChange(val ? parseFloat(val) : 0)}
                />
              )}
            />
          </div>

          <SubHeader title='การตั้งค่าสำหรับ SEO' />
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Controller
              control={control}
              name='slug'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.slug?.message}
                  isInvalid={!!errors.slug}
                  label='Slug'
                  value={value ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name='metaTitle'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.metaTitle?.message}
                  isInvalid={!!errors.metaTitle}
                  label='Meta Title'
                  value={value ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name='metaDescription'
              render={({ field: { value, ...field } }) => (
                <Textarea
                  {...field}
                  errorMessage={errors.metaDescription?.message}
                  isInvalid={!!errors.metaDescription}
                  label='Meta Description'
                  minRows={3}
                  value={value ?? ''}
                />
              )}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button disabled={isPending} variant='faded' onPress={onClose}>
            ยกเลิก
          </Button>
          <Button
            disabled={isPending}
            isLoading={isPending}
            variant='faded'
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'กำลังดำเนินการ' : 'บันทึกข้อมูล'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ProductForm }
