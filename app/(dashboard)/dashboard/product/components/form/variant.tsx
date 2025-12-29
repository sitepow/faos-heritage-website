'use client'

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Spinner,
  Switch,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createVariant, getVariant, updateVariant } from '../../action'
import { variantSchema, type VariantInput } from '../../schema'
import { useProductStore } from '../../store'

import { SubHeading } from '@/components/common/heading'
import { DEFAULT_CURRENCY } from '@/utils/constants'

const DEFAULT_VALUES: VariantInput = {
  name: '',
  sku: '',
  price: 0,
  stockQuantity: 0,
  weight: 0,
  isActive: true,
}

export const VariantForm = () => {
  const {
    isVariantOpen,
    onOpenVariantChange,
    onOpenVariantManagerChange,
    productId,
    variantId,
    setState,
  } = useProductStore()
  const queryClient = useQueryClient()

  const QUERY_KEY = {
    VARIANT: ['dashboard', 'variant', 'modal', variantId],
    VARIANTS: ['dashboard', 'variants', 'modal'],
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<VariantInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { data: variant, isLoading: isLoadingVariant } = useQuery({
    queryKey: QUERY_KEY.VARIANT,
    queryFn: () => getVariant(variantId!),
    enabled: !!variantId && isVariantOpen,
  })

  useEffect(() => {
    if (isVariantOpen) {
      if (variantId && !isLoadingVariant && variant) {
        reset(variant)
      } else if (!variantId) {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isVariantOpen, variantId, variant, isLoadingVariant, reset])

  const { mutate: mutateCreateVariant, isPending: isPendingCreateVariant } =
    useMutation({
      mutationFn: createVariant,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.VARIANTS,
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateVariant, isPending: isPendingUpdateVariant } =
    useMutation({
      mutationFn: updateVariant,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.VARIANTS,
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateVariant || isLoadingVariant || isPendingUpdateVariant
  const headerLable = variantId ? 'Edit product options' : 'Add product options'

  const onSubmit = (data: VariantInput) => {
    if (!variantId) {
      mutateCreateVariant({ ...data, productId })
    } else {
      mutateUpdateVariant({ ...data, productId })
    }
  }

  const onClose = () => {
    queryClient.removeQueries({
      queryKey: QUERY_KEY.VARIANT,
    })
    reset(DEFAULT_VALUES)
    setState({ variantId: null })
    onOpenVariantChange()
    onOpenVariantManagerChange()
  }

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isVariantOpen}
      size='xl'
      scrollBehavior='inside'
      onOpenChange={onOpenVariantChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='Loading...' />}

        {!isPending && (
          <ModalBody>
            <SubHeading title='Option status' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  Enable this option
                </Switch>
              )}
            />

            <SubHeading title='Basic information' />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='Option name'
                  variant='bordered'
                />
              )}
            />

            <Controller
              control={control}
              name='sku'
              render={({ field: { value, ...field } }) => (
                <Input
                  {...field}
                  errorMessage={errors.sku?.message}
                  isInvalid={!!errors.sku}
                  label='SKU'
                  value={value ?? ''}
                  variant='bordered'
                />
              )}
            />

            <SubHeading title='Prices and stock availability' />
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
              name='stockQuantity'
              render={({ field: { onChange, ...field } }) => (
                <NumberInput
                  {...field}
                  errorMessage={errors.stockQuantity?.message}
                  isInvalid={!!errors.stockQuantity}
                  label='Quantity in stock'
                  minValue={0}
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
