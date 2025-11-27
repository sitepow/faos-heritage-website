'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal'
import { NumberInput } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { VariantInput } from '../../schema/variant'

import { createVariant, getVariant, updateVariant } from '../../action/variant'
import { variantSchema } from '../../schema/variant'
import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'

const DEFAULT_VALUES: VariantInput = {
  name: '',
  sku: '',
  price: 0,
  stockQuantity: 0,
  isActive: true,
}

const VariantForm = () => {
  const {
    isVariantOpen,
    onOpenVariantChange,
    onOpenVariantManagerChange,
    productId,
    variantId,
    setState,
  } = useProductStore()
  const queryClient = useQueryClient()
  const QUERY_KEY = ['dashboard', 'modal', 'variant', variantId]

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
    queryKey: QUERY_KEY,
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
          queryKey: ['dashboard', 'modal', 'variants'],
        })
        onClose()
      },
    })

  const { mutate: mutateUpdateVariant, isPending: isPendingUpdateVariant } =
    useMutation({
      mutationFn: updateVariant,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'modal', 'variants'],
        })
        onClose()
      },
    })

  const isPending =
    isPendingCreateVariant || isLoadingVariant || isPendingUpdateVariant
  const headerLable = variantId ? 'แก้ไขตัวเลือกสินค้า' : 'เพิ่มตัวเลือกสินค้า'

  const onSubmit = (data: VariantInput) => {
    if (!variantId) {
      mutateCreateVariant({ ...data, productId })
    } else {
      mutateUpdateVariant({ ...data, productId })
    }
  }

  const onClose = () => {
    queryClient.removeQueries({
      queryKey: QUERY_KEY,
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
      scrollBehavior='inside'
      onOpenChange={onOpenVariantChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{headerLable}</ModalHeader>

        {isPending && <Spinner label='กำลังโหลด...' />}

        {!isPending && (
          <ModalBody>
            <SubHeader title='สถานะตัวเลือก' />
            <Controller
              control={control}
              name='isActive'
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} isSelected={value} onValueChange={onChange}>
                  เปิดใช้งานตัวเลือกนี้
                </Switch>
              )}
            />
            <SubHeader title='ข้อมูลพื้นฐาน' />
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label='ชื่อตัวเลือก'
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
                  label='SKU (ถ้ามี)'
                  value={value ?? ''}
                />
              )}
            />
            <SubHeader title='ราคาและสต็อกสินค้า' />
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
                  label='จำนวนในสต็อก'
                  minValue={0}
                  onValueChange={(val) => onChange(val || 0)}
                />
              )}
            />
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

export { VariantForm }
