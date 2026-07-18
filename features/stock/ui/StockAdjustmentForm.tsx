/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  Textarea,
  Spinner,
  Alert,
  Autocomplete,
  AutocompleteItem,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { StockMovementType } from '@prisma/client'
import { InfoIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { Resolver } from 'react-hook-form'

import { useStockMutation } from '../mutation'
import { stockAdjustmentSchema, type StockAdjustmentInput } from '../schema'
import { useStockStore } from '../store'

import { SectionLabel } from '@/components/ui/SectionHeader'
import { IMAGE_FALLBACK } from '@/constants'
import { useProductsAdmin } from '@/features/product/hook'
import { useProductVariants } from '@/features/product-variant/hook'
import { STOCK_MOVEMENT_LABELS } from '@/features/stock-history/constant'
import { useAuth } from '@/hooks/useAuth'

const DEFAULT_VALUES: StockAdjustmentInput = {
  productId: '',
  variantId: undefined,
  quantity: 1,
  type: StockMovementType.WITHDRAWAL,
  location: '',
  note: '',
}

const StockAdjustmentForm = () => {
  const { isStockEditor, isAdmin } = useAuth()
  const {
    isAdjustmentOpen,
    closeAdjustment,
    selectedProductId,
    selectedVariantId,
  } = useStockStore()
  const { adjustStock, isPending: isMutating } = useStockMutation()

  const { data: productsResult, isLoading: isLoadingProducts } =
    useProductsAdmin(1, 100)

  const products = useMemo(() => {
    return productsResult && 'items' in productsResult
      ? productsResult.items
      : []
  }, [productsResult])

  const {
    control,
    handleSubmit,
    reset: resetForm,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StockAdjustmentInput>({
    resolver: zodResolver(
      stockAdjustmentSchema,
    ) as Resolver<StockAdjustmentInput>,
    defaultValues: DEFAULT_VALUES,
  })

  const currentProductId = watch('productId')
  const currentVariantId = watch('variantId')

  const { data: variants, isLoading: isLoadingVariants } = useProductVariants(
    currentProductId || '',
  )

  const hasVariants = useMemo(() => {
    return Array.isArray(variants) && variants.length > 0
  }, [variants])

  const isMissingRequiredVariant = useMemo(() => {
    return hasVariants && !currentVariantId
  }, [hasVariants, currentVariantId])

  useEffect(() => {
    if (isAdjustmentOpen) {
      resetForm({
        ...DEFAULT_VALUES,
        productId: selectedProductId || '',
        variantId: selectedVariantId || undefined,
      })
    }
  }, [isAdjustmentOpen, selectedProductId, selectedVariantId, resetForm])

  useEffect(() => {
    if (currentProductId && currentProductId !== selectedProductId) {
      return setValue('variantId', undefined)
    }
  }, [currentProductId, selectedProductId, setValue])

  const onSubmit = async (values: StockAdjustmentInput) => {
    return await adjustStock(
      {
        ...values,
        note: values.note ?? '',
        reference: values.reference ?? undefined,
        variantId: values.variantId || undefined,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            resetForm(DEFAULT_VALUES)
            return closeAdjustment()
          }
        },
      },
    )
  }

  const isPending = isMutating || isLoadingProducts

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isAdjustmentOpen}
      scrollBehavior='inside'
      size='2xl'
      onOpenChange={() => {
        return closeAdjustment()
      }}
    >
      <ModalContent>
        <ModalHeader className='text-xl font-bold'>
          ทำรายการเบิก/คืนสินค้า
        </ModalHeader>
        <ModalBody>
          {isLoadingProducts && !selectedProductId ? (
            <div className='flex justify-center p-8'>
              <Spinner label='กำลังโหลดข้อมูลสินค้า...' />
            </div>
          ) : (
            <div className='space-y-6 text-left'>
              <Alert
                description={
                  <div className='text-default-600 mt-1 flex flex-col gap-2 text-sm'>
                    <p>
                      • <strong>การเบิกสินค้า:</strong> เลือกประเภท{' '}
                      <span className='underline'>เบิกออก</span> หรือ{' '}
                      <span className='underline'>ปรับปรุง</span> (กรณีลดลง)
                      ระบบจะหักยอดออกจากสต็อกปัจจุบันทันที
                    </p>
                    <p>
                      • <strong>การเติม/คืนสินค้า:</strong> เลือกประเภท{' '}
                      <span className='underline'>เติมสต็อก</span> หรือ{' '}
                      <span className='underline'>คืนสินค้า</span>{' '}
                      ยอดสต็อกจะเพิ่มขึ้นตามจำนวนที่ระบุ
                    </p>
                    <p>
                      • <strong>ตรวจสอบตัวเลือก:</strong> หากสินค้ามี{' '}
                      <span className='underline'>ขนาดหรือสี</span>{' '}
                      ต้องระบุตัวเลือกให้ถูกต้องเพื่อความแม่นยำของสต็อกรายชิ้น
                    </p>
                  </div>
                }
                icon={<InfoIcon />}
                title='คู่มือการจัดการสต็อกสินค้า (Inventory Control Guide)'
                variant='bordered'
              />

              <SectionLabel>ข้อมูลสินค้า</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='productId'
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        defaultItems={products}
                        errorMessage={errors.productId?.message?.toString()}
                        isInvalid={!!errors.productId}
                        label='เลือกสินค้า'
                        placeholder='พิมพ์ค้นหาชื่อสินค้า...'
                        selectedKey={field.value}
                        variant='bordered'
                        onSelectionChange={(key) => {
                          const id = key as string
                          field.onChange(id)
                          return setValue('variantId', undefined)
                        }}
                      >
                        {(item) => {
                          return (
                            <AutocompleteItem
                              key={item.id}
                              className='py-2'
                              textValue={item.name}
                            >
                              <div className='flex w-full items-center gap-3'>
                                <div className='flex-shrink-0'>
                                  <img
                                    alt={item.name}
                                    className='size-12 rounded-md object-cover'
                                    src={
                                      item.images?.[0]?.url ||
                                      IMAGE_FALLBACK.EMPTY
                                    }
                                  />
                                </div>
                                <div className='flex min-w-0 flex-1 flex-col'>
                                  <span className='text-small leading-tight font-bold break-words whitespace-normal'>
                                    {item.name}
                                  </span>
                                  <span className='text-tiny text-default-400'>
                                    คงเหลือรวม: {item.stockQuantity}
                                  </span>
                                </div>
                              </div>
                            </AutocompleteItem>
                          )
                        }}
                      </Autocomplete>
                    )
                  }}
                />

                <Controller
                  control={control}
                  name='variantId'
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Select
                        {...field}
                        errorMessage={
                          isMissingRequiredVariant
                            ? 'กรุณาเลือกตัวเลือกสินค้าก่อนทำรายการ'
                            : undefined
                        }
                        isDisabled={!hasVariants}
                        isInvalid={isMissingRequiredVariant}
                        label={
                          hasVariants
                            ? 'ตัวเลือกสินค้า (บังคับเลือก)'
                            : 'ไม่มีตัวเลือกสำหรับสินค้านี้'
                        }
                        placeholder={
                          isLoadingVariants ? 'กำลังโหลด...' : 'เลือกขนาด/สี'
                        }
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          return onChange(Array.from(keys)[0] as string)
                        }}
                      >
                        {(variants || []).map((v) => {
                          return (
                            <SelectItem key={v.id} textValue={v.name}>
                              {v.name} (คงเหลือ: {v.stockQuantity})
                            </SelectItem>
                          )
                        })}
                      </Select>
                    )
                  }}
                />
              </div>

              <SectionLabel>รายละเอียดรายการ</SectionLabel>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Controller
                  control={control}
                  name='type'
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Select
                        {...field}
                        errorMessage={errors.type?.message?.toString()}
                        isInvalid={!!errors.type}
                        label='ประเภทรายการ'
                        selectedKeys={value ? [value] : []}
                        variant='bordered'
                        onSelectionChange={(keys) => {
                          return onChange(
                            Array.from(keys)[0] as StockMovementType,
                          )
                        }}
                      >
                        <SelectItem
                          key={StockMovementType.WITHDRAWAL}
                          className='text-danger'
                          textValue={`${STOCK_MOVEMENT_LABELS[StockMovementType.WITHDRAWAL]} (-)`}
                        >
                          {STOCK_MOVEMENT_LABELS[StockMovementType.WITHDRAWAL]}{' '}
                          (-)
                        </SelectItem>

                        <SelectItem
                          key={StockMovementType.RESTOCK}
                          className='text-success'
                          textValue={`${STOCK_MOVEMENT_LABELS[StockMovementType.RESTOCK]} (+)`}
                        >
                          {STOCK_MOVEMENT_LABELS[StockMovementType.RESTOCK]} (+)
                        </SelectItem>

                        <SelectItem
                          key={StockMovementType.RETURN}
                          textValue={`${STOCK_MOVEMENT_LABELS[StockMovementType.RETURN]} (+)`}
                        >
                          {STOCK_MOVEMENT_LABELS[StockMovementType.RETURN]} (+)
                        </SelectItem>

                        <SelectItem
                          key={StockMovementType.ADJUSTMENT}
                          textValue={
                            STOCK_MOVEMENT_LABELS[StockMovementType.ADJUSTMENT]
                          }
                        >
                          {STOCK_MOVEMENT_LABELS[StockMovementType.ADJUSTMENT]}
                        </SelectItem>
                      </Select>
                    )
                  }}
                />

                <Controller
                  control={control}
                  name='quantity'
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Input
                        {...field}
                        errorMessage={errors.quantity?.message?.toString()}
                        isInvalid={!!errors.quantity}
                        label='จำนวนสินค้า'
                        type='number'
                        value={value?.toString()}
                        variant='bordered'
                        onValueChange={(v) => {
                          return onChange(Number(v))
                        }}
                      />
                    )
                  }}
                />
              </div>

              <SectionLabel>สถานที่และหมายเหตุ</SectionLabel>
              <Controller
                control={control}
                name='location'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      errorMessage={errors.location?.message?.toString()}
                      isInvalid={!!errors.location}
                      label='เบิกไปที่ไหน / แผนกที่รับ'
                      placeholder='เช่น สาขา A, งานอีเวนต์, คลังสินค้า B'
                      variant='bordered'
                    />
                  )
                }}
              />

              <Controller
                control={control}
                name='note'
                render={({ field: { value, ...field } }) => {
                  return (
                    <Textarea
                      {...field}
                      label='หมายเหตุเพิ่มเติม'
                      value={value ?? ''}
                      variant='bordered'
                    />
                  )
                }}
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant='flat'
            onPress={() => {
              return closeAdjustment()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            className='text-secondary font-bold'
            color='primary'
            isDisabled={
              !isDirty ||
              isPending ||
              isMissingRequiredVariant ||
              (!isStockEditor && !isAdmin)
            }
            isLoading={isPending}
            onPress={() => {
              return handleSubmit(onSubmit)()
            }}
          >
            ยืนยันการทำรายการ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { StockAdjustmentForm }
