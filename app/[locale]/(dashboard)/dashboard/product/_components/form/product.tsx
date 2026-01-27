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
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { ProductInput } from '../../schema/product'

import { getCategories } from '../../action/category'
import { getProduct, createProduct, updateProduct } from '../../action/product'
import { productSchema } from '../../schema/product'
import { useProductStore } from '../../store'

import { useAppStore } from '@/app/store'
import { MdEditorCustomize } from '@/components/ui/MdxEditor'
import { SubHeading } from '@/components/ui/SectionHeader'
import { PRODUCT_UNITS } from '@/constants/product'

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
  const t = useTranslations('Dashboard.ProductForm')
  const tc = useTranslations('Common')
  const { country } = useAppStore()

  const [editorShortDescKey, setEditorShortDescKey] = useState(0)
  const [editorFullDescKey, setEditorFullDescKey] = useState(0)

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

    setEditorShortDescKey((k) => k + 1)
    setEditorFullDescKey((k) => k + 1)
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

  const headerLabel = productId ? t('editTitle') : t('addTitle')

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
      size='4xl'
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLabel}</ModalHeader>
        {isPending && (
          <ModalBody>
            <Spinner label={tc('loading')} />
          </ModalBody>
        )}

        {!isPending && (
          <ModalBody>
            <SubHeading title={t('statusSection')} />
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
                    {t('fields.isActive')}
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
                    {t('fields.isFeatured')}
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
                    {t('fields.isPremium')}
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
                    {t('fields.isAuthentic')}
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
                    {t('fields.isDigital')}
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
                    {t('fields.isDemo')}
                  </Switch>
                )}
              />
            </div>

            <SubHeading title={t('basicSection')} />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    label={t('fields.name')}
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
                    label={t('fields.category')}
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
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
                    label={t('fields.unit')}
                    selectedKeys={value ? [value] : []}
                    variant='bordered'
                    onSelectionChange={(keys) => onChange(Array.from(keys)[0])}
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
                    label={t('fields.sku')}
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
                    label={t('fields.barcode')}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              />
              {/* <Controller
                control={control}
                name='shortDescription'
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    className='sm:col-span-2'
                    label={t('fields.shortDesc')}
                    minRows={3}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              /> */}
              <Controller
                control={control}
                name='shortDescription'
                render={({ field: { value, ...field } }) => (
                  <MdEditorCustomize
                    key={editorShortDescKey}
                    placeholder={t('fields.shortDesc')}
                    className='col-span-1 sm:col-span-2'
                    {...field}
                    value={value ?? ''}
                  />
                )}
              />

              {/* <Controller
                control={control}
                name='description'
                render={({ field: { value, ...field } }) => (
                  <Textarea
                    {...field}
                    className='sm:col-span-2'
                    label={t('fields.fullDesc')}
                    minRows={6}
                    value={value ?? ''}
                    variant='bordered'
                  />
                )}
              /> */}
              <Controller
                control={control}
                name='description'
                render={({ field: { value, ...field } }) => (
                  <MdEditorCustomize
                    key={editorFullDescKey}
                    placeholder={t('fields.fullDesc')}
                    className='col-span-1 sm:col-span-2'
                    {...field}
                    value={value ?? ''}
                  />
                )}
              />
            </div>

            <SubHeading title={t('priceSection')} />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='price'
                render={({ field: { onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.price?.message}
                    isInvalid={!!errors.price}
                    label={`${t('fields.price')} (${country?.currency || 'USD'})`}
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
                    label={t('fields.comparePrice')}
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
                    label={t('fields.costPrice')}
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
            </div>

            <SubHeading title={t('stockSection')} />
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Controller
                control={control}
                name='stockQuantity'
                render={({ field: { value, onChange, ...field } }) => (
                  <NumberInput
                    {...field}
                    errorMessage={errors.stockQuantity?.message}
                    isInvalid={!!errors.stockQuantity}
                    label={t('fields.stock')}
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
                    label={t('fields.lowStock')}
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
                    label={t('fields.weight')}
                    minValue={0}
                    value={value ?? 0}
                    variant='bordered'
                    onValueChange={(val) => onChange(val || 0)}
                  />
                )}
              />
            </div>

            <div className='flex flex-wrap gap-4'>
              <SubHeading title={t('seoSection')} />
              <Controller
                control={control}
                name='useSeoFromBasicData'
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    {...field}
                    isSelected={value}
                    onValueChange={onChange}
                  >
                    {t('fields.autoSeo')}
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
                      label={t('fields.slug')}
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
                      label={t('fields.metaTitle')}
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
                      className='sm:col-span-2'
                      errorMessage={errors.metaDescription?.message}
                      isInvalid={!!errors.metaDescription}
                      label={t('fields.metaDesc')}
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
            {tc('cancel')}
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            isDisabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? tc('saving') : tc('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
