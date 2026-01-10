'use client'

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Input,
  Textarea,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  createProductLocalization,
  getProductLocalization,
  updateProductLocalization,
} from '../../action/product-localization'
import {
  productLocalizationSchema,
  type ProductLocalizationInput,
} from '../../schema/product-localization'
import { useProductStore } from '../../store'

import { COUNTRY } from '@/utils/constants/country'

const DEFAULT_VALUES: ProductLocalizationInput = {
  productId: '',
  languageCode: '',
  name: '',
  shortDescription: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
}

export const ProductLocalizationForm = () => {
  const {
    productId,
    productLocalizationId,
    isProductLocalizationOpen,
    onOpenProductLocalizationChange,
    onOpenProductLocalizationManagerChange,
    setState,
  } = useProductStore()

  const queryClient = useQueryClient()

  const QUERY_KEY = {
    PRODUCT_LOCALIZATION: ['product-localization', productLocalizationId],
    PRODUCT_LOCALIZATIONS: ['product-localizations', productId],
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProductLocalizationInput>({
    resolver: zodResolver(productLocalizationSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.PRODUCT_LOCALIZATION,
    queryFn: () => getProductLocalization(productLocalizationId!),
    enabled: !!productLocalizationId && isProductLocalizationOpen,
  })

  useEffect(() => {
    if (!isProductLocalizationOpen) return

    if (productLocalizationId && data) {
      reset(data)
    } else {
      reset({
        ...DEFAULT_VALUES,
        productId: productId!,
      })
    }
  }, [data, productLocalizationId, productId, isProductLocalizationOpen, reset])

  const onRefetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEY.PRODUCT_LOCALIZATIONS,
    })
  }

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createProductLocalization,
    onSuccess: () => {
      onRefetch()
      onClose()
    },
  })

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateProductLocalization,
    onSuccess: () => {
      onRefetch()
      onClose()
    },
  })

  const isPending = isLoading || isCreating || isUpdating

  const onSubmit = (form: ProductLocalizationInput) => {
    if (productLocalizationId) {
      updateMutate(form)
    } else {
      createMutate(form)
    }
  }

  const onClose = async () => {
    reset(DEFAULT_VALUES)
    setState({ productLocalizationId: null })
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEY.PRODUCT_LOCALIZATION,
    })
    onOpenProductLocalizationChange()
    onOpenProductLocalizationManagerChange()
  }

  return (
    <Modal
      isOpen={isProductLocalizationOpen}
      onOpenChange={onOpenProductLocalizationChange}
      size='xl'
      scrollBehavior='inside'
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>
          {productLocalizationId
            ? 'แก้ไขชื่อสินค้าภาษา'
            : 'เพิ่มชื่อสินค้าภาษาใหม่'}
        </ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody className='gap-4'>
            <Controller
              control={control}
              name='languageCode'
              render={({ field }) => (
                <Select
                  label='ประเทศ'
                  variant='bordered'
                  selectedKeys={field.value ? [field.value] : []}
                  onSelectionChange={(keys) =>
                    field.onChange(Array.from(keys)[0])
                  }
                >
                  {COUNTRY.map((c) => (
                    <SelectItem key={c.code}>{c.name}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input {...field} variant='bordered' label='ชื่อสินค้า' />
              )}
            />

            <Controller
              control={control}
              name='shortDescription'
              render={({ field: { value, ...field } }) => (
                <Textarea
                  {...field}
                  variant='bordered'
                  value={value ?? ''}
                  label='รายละเอียดสินค้า (สั้นๆ)'
                />
              )}
            />

            <Controller
              control={control}
              name='description'
              render={({ field: { value, ...field } }) => (
                <Textarea
                  {...field}
                  value={value ?? ''}
                  variant='bordered'
                  label='รายละเอียดสินค้า (ฉบับเต็ม)'
                />
              )}
            />

            {/* <Controller
              control={control}
              name='metaTitle'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  value={value ?? ''}
                  variant='bordered'
                  label='Meta Title'
                />
              )}
            />

            <Controller
              control={control}
              name='metaDescription'
              render={({ field: { value, ...field } }) => (
                <Textarea
                  {...field}
                  value={value ?? ''}
                  variant='bordered'
                  label='Meta Description'
                />
              )}
            /> */}
          </ModalBody>
        )}

        <ModalFooter>
          <Button variant='faded' onPress={onClose}>
            Cancel
          </Button>
          <Button
            color='primary'
            className='text-secondary'
            isDisabled={!isDirty || isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
