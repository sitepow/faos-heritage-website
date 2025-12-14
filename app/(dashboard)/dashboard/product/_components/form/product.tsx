'use client'

import { Button } from '@heroui/button'
import { Input, Textarea } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { NumberInput } from '@heroui/react'
import { Select, SelectItem } from '@heroui/select'
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductUnit } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ProductInput } from '../../schema/product'

import { getCategories } from '../../actions/category'
import { createProduct, getProduct, updateProduct } from '../../actions/product'
import { productSchema } from '../../schema/product'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'
import { PRODUCT_UNIT_ALL } from '@/utils/const'

const DEFAULT_VALUES: ProductInput = {
  isActive: true,
  isDigitalProduct: false,
  isDemoProduct: false,
  useSeoFromBasicData: true,
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
  shortDescription: '',
  description: '',
  unit: ProductUnit?.UNIT,
}

const ProductForm = () => {
  const { productId, setState, isProductOpen, onOpenProductChange } =
    useProductStore()
  const queryClient = useQueryClient()

  const QUERY = {
    CATEGORIES: ['dashboard', 'categories', 'modal'],
    PRODUCT: ['dashboard', 'product', productId],
    PRODUCTS: ['dashboard', 'products'],
  }

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY.CATEGORIES,
    queryFn: () => getCategories(),
    enabled: isProductOpen,
  })

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: QUERY.PRODUCT,
    queryFn: () => getProduct(productId!),
    enabled: !!productId && isProductOpen,
  })

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isProductOpen) {
      if (productId && !isLoadingProduct && product) {
        reset(product)
      } else if (!productId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isProductOpen, productId, product, isLoadingProduct, reset])

  const { mutate: mutateCreateProduct, isPending: isPendingCreateProduct } =
    useMutation({
      mutationFn: createProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.PRODUCTS })
        onClose()
      },
    })

  const { mutate: mutateUpdateProduct, isPending: isPendingUpdateProduct } =
    useMutation({
      mutationFn: updateProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.PRODUCTS })
        onClose()
      },
    })

  const isPending =
    isLoadingProduct ||
    isPendingCreateProduct ||
    isPendingUpdateProduct ||
    isLoadingCategories
  const headerLable = productId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'

  const onSubmit = (data: ProductInput) => {
    if (!productId) {
      mutateCreateProduct(data)
    } else {
      mutateUpdateProduct(data)
    }
  }

  const onClose = () => {
    queryClient.removeQueries({ queryKey: QUERY.PRODUCT })
    setState({ productId: null })
    reset(DEFAULT_VALUES)
    onOpenProductChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isProductOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>
        {isPending && (
          <ModalBody>
            <Spinner label='กำลังโหลด...' />
          </ModalBody>
        )}

        {!isPending && (
          <ModalBody>
            <SubHeader title='สถานะสินค้า' />
            <div className='flex flex-wrap gap-6'>
              <Controller
                control={control}
                name='isActive'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    เปิดการขายสินค้า
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name='isFeatured'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    ปักหมุดสินค้าแนะนำ
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name='isDigitalProduct'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    สินค้าไฟล์ดิจิทัล
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name='isDemoProduct'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    สินค้าตัวอย่าง
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
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0]

                      onChange(selected)
                    }}
                  >
                    {(categories ?? []).map((category) => (
                      <SelectItem key={category.id}>{category.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name='unit'
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    {...field}
                    disallowEmptySelection
                    errorMessage={errors.unit?.message}
                    isInvalid={!!errors.unit}
                    label='หน่วยนับสินค้า'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0]

                      onChange(selected)
                    }}
                  >
                    {(PRODUCT_UNIT_ALL ?? []).map(([key, label]) => (
                      <SelectItem key={key}>{label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name='sku'
                render={({ field: { value, ...field } }) => (
                  <Input
                    variant='bordered'
                    {...field}
                    label='SKU'
                    value={value ?? ''}
                  />
                )}
              />
              <Controller
                control={control}
                name='barcode'
                render={({ field: { value, ...field } }) => (
                  <Input
                    {...field}
                    className='sm:col-span-2'
                    label='บาร์โค้ด'
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              />
              <Controller
                control={control}
                name='shortDescription'
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    label='รายละเอียดสินค้า (ฉบับย่อ)'
                    minRows={10}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              />
              <Controller
                control={control}
                name='description'
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    label='รายละเอียดสินค้า (ฉบับเต็ม)'
                    minRows={10}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              />
            </div>

            <SubHeader title='ราคาสินค้า' />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='price'
                render={({ field: { onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.price?.message}
                    isInvalid={!!errors.price}
                    label='ราคา (บาท)'
                    minValue={0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
              <Controller
                control={control}
                name='compareAtPrice'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.compareAtPrice?.message}
                    isInvalid={!!errors.compareAtPrice}
                    label='ราคาก่อนลด'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
              <Controller
                control={control}
                name='costPrice'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.costPrice?.message}
                    isInvalid={!!errors.costPrice}
                    label='ราคาทุน (ภายใน)'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
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
                  <NumberInput
                    {...field}
                    errorMessage={errors.stockQuantity?.message}
                    isInvalid={!!errors.stockQuantity}
                    label='จำนวนในสต็อก'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
              <Controller
                control={control}
                name='lowStockAlert'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.lowStockAlert?.message}
                    isInvalid={!!errors.lowStockAlert}
                    label='แจ้งเตือนเมื่อสต็อกต่ำกว่า'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
              <Controller
                control={control}
                name='weight'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.weight?.message}
                    isInvalid={!!errors.weight}
                    label='น้ำหนัก (กรัม)'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
            </div>

            <div className='flex flex-wrap gap-4'>
              <SubHeader title='การตั้งค่าสำหรับ SEO' />
              <Controller
                control={control}
                name='useSeoFromBasicData'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    ใช้ตามข้อมูลพื้นฐาน
                  </Switch>
                )}
              />
            </div>
            {!watch('useSeoFromBasicData') && (
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
                      variant='bordered'
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
                      variant='bordered'
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
                      variant='bordered'
                    />
                  )}
                />
              </div>
            )}
          </ModalBody>
        )}

        <ModalFooter>
          <Button isDisabled={isPending} variant='faded' onPress={onClose}>
            ยกเลิก
          </Button>
          <Button
            isDisabled={isPending || !isDirty}
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
