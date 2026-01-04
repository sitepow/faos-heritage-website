'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Switch,
  Input,
  Select,
  SelectItem,
  Textarea,
  NumberInput,
  ModalFooter,
  Button,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductUnit } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  createProduct,
  getCategories,
  getProduct,
  updateProduct,
} from '../../action'
import { productSchema, type ProductInput } from '../../schema'
import { useProductStore } from '../../store'

import { SubHeading } from '@/components/common/heading'
import { DEFAULT_CURRENCY } from '@/utils/constants/currency'
import { PRODUCT_UNITS } from '@/utils/features'

const DEFAULT_VALUES: ProductInput = {
  isAuthentic: true,
  isPremiumProduct: true,
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

export const ProductForm = () => {
  const { productId, setState, isProductOpen, onOpenProductChange } =
    useProductStore()
  const queryClient = useQueryClient()

  const QUERY_KEY = {
    CATEGORIES: ['dashboard', 'categories', 'modal'],
    PRODUCT: ['dashboard', 'product', productId],
    PRODUCTS: ['dashboard', 'products'],
    HOMEPAGE: ['products', 'homepage'],
    CAROUSEL: ['carousel', 'products'],
  }

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY_KEY.CATEGORIES,
    queryFn: () => getCategories(),
    enabled: isProductOpen,
  })

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: QUERY_KEY.PRODUCT,
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
    if (!isProductOpen) return

    if (productId && !isLoadingProduct && product) {
      reset(product)
    } else if (!productId) {
      reset(DEFAULT_VALUES)
    }
  }, [isProductOpen, productId, product, isLoadingProduct, reset])

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.PRODUCTS }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.HOMEPAGE }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.CAROUSEL }),
    ])

    onClose()
  }

  const { mutate: mutateCreateProduct, isPending: isPendingCreateProduct } =
    useMutation({
      mutationFn: createProduct,
      onSuccess: onRefetch,
    })

  const { mutate: mutateUpdateProduct, isPending: isPendingUpdateProduct } =
    useMutation({
      mutationFn: updateProduct,
      onSuccess: onRefetch,
    })

  const isPending =
    isLoadingProduct ||
    isPendingCreateProduct ||
    isPendingUpdateProduct ||
    isLoadingCategories
  const headerLable = productId ? 'Edit product' : 'Add product'

  const onSubmit = (data: ProductInput) => {
    if (!productId) {
      mutateCreateProduct(data)
    } else {
      mutateUpdateProduct(data)
    }
  }

  const onClose = () => {
    queryClient.removeQueries({ queryKey: QUERY_KEY.PRODUCT })
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
      size='xl'
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
            <Spinner label='Loading...' />
          </ModalBody>
        )}

        {!isPending && (
          <ModalBody>
            <SubHeading title='Product status' />
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
                    Available for sale
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
                    Featured product
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name='isPremiumProduct'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    Premium Product
                  </Switch>
                )}
              />
              <Controller
                control={control}
                name='isAuthentic'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    Authentic 100%
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
                    Digital Product
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
                    Demo Version
                  </Switch>
                )}
              />
            </div>

            <SubHeading title='Basic information' />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    label='Product Name'
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
                    label='Product Categories'
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
                    label='Unit of measurement'
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0]

                      onChange(selected)
                    }}
                  >
                    {(PRODUCT_UNITS ?? []).map(([key, label]) => (
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
                    label='Barcode'
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
                    className='sm:col-span-2'
                    label='Product details (short version)'
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
                    className='sm:col-span-2'
                    label='Product details (full version)'
                    minRows={10}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              />
            </div>

            <SubHeading title='Product price' />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='price'
                render={({ field: { onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.price?.message}
                    isInvalid={!!errors.price}
                    label={`Price (${DEFAULT_CURRENCY})`}
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
                    label='Price before discount'
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
                    label='Cost price (internal)'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
            </div>

            <SubHeading title='Stock' />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='stockQuantity'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.stockQuantity?.message}
                    isInvalid={!!errors.stockQuantity}
                    label='Quantity in stock'
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
                    label='Receive alerts when stock is low'
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
                    label='Weight (grams)'
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
            </div>

            <div className='flex flex-wrap gap-4'>
              <SubHeading title='Settings for SEO' />
              <Controller
                control={control}
                name='useSeoFromBasicData'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    Auto-generate SEO from basic data
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
            Cancel
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
