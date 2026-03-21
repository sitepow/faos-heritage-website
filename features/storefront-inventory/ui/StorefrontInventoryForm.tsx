/* eslint-disable no-nested-ternary */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  RadioGroup,
  Radio,
  User,
  Select,
  SelectItem,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { useStorefrontInventoryMutation } from '../mutation'
import {
  storefrontInventorySchema,
  type StorefrontInventoryInput,
} from '../schema'
import { useStorefrontInventoryStore } from '../store'

import { useProductsAdmin } from '@/features/product/hook'

const StorefrontInventoryForm = ({
  storefrontId,
}: {
  storefrontId: string
}) => {
  const { isOpen, onClose, data: editingData } = useStorefrontInventoryStore()
  const { transferStock, isPending } = useStorefrontInventoryMutation()
  const { data: productsData } = useProductsAdmin(1, 100)

  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')

  const productList = useMemo(() => {
    return productsData && 'items' in productsData ? productsData.items : []
  }, [productsData])

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<StorefrontInventoryInput>({
    resolver: zodResolver(storefrontInventorySchema),
    defaultValues: {
      storefrontId,
      direction: 'IN',
      stockQuantity: 1,
      retailPrice: 0,
      netPrice: 0,
    },
  })

  const selectedProduct = useMemo(() => {
    return productList.find((p) => {
      return p.id === selectedProductId
    })
  }, [selectedProductId, productList])

  useEffect(() => {
    if (!editingData && selectedProduct) {
      let price = 0

      if (selectedVariantId) {
        const variant = selectedProduct.variants.find((v) => {
          return v.id === selectedVariantId
        })
        price = Number(variant?.price || 0)
      } else {
        price = Number(selectedProduct.price || 0)
      }

      if (price > 0) {
        setValue('retailPrice', price)
        return setValue('netPrice', price)
      }
    }
  }, [selectedProduct, selectedVariantId, setValue, editingData])

  useEffect(() => {
    if (editingData) {
      setSelectedProductId(editingData.productId)
      if (editingData.variantId) {
        setSelectedVariantId(editingData.variantId)
      }

      return reset({
        ...editingData,
        stockQuantity: 1,
      })
    }
  }, [editingData, reset])

  const handleSave = async (values: StorefrontInventoryInput) => {
    const result = await transferStock({
      ...values,
      mode: editingData?.mode,
    })

    if (result.success) {
      reset()
      setSelectedProductId('')
      setSelectedVariantId('')
      return onClose()
    }
  }

  const mainStock = useMemo(() => {
    if (!selectedProduct) {
      return 0
    }

    if (selectedVariantId) {
      return (
        selectedProduct.variants.find((v) => v.id === selectedVariantId)
          ?.stockQuantity || 0
      )
    }

    return selectedProduct.stockQuantity || 0
  }, [selectedProduct, selectedVariantId])

  const isStockMode = !editingData || editingData.mode === 'stock'
  const isPriceMode = !editingData || editingData.mode === 'price'

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      size='xl'
      onClose={onClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader className='flex flex-col gap-1 text-left font-bold'>
            {!editingData
              ? 'เพิ่มสินค้าเข้าสาขา'
              : editingData.mode === 'stock'
                ? 'จัดการสต็อกสินค้า'
                : 'แก้ไขราคาขาย'}
          </ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <Controller
              control={control}
              name='productId'
              render={({ field }) => {
                return (
                  <Autocomplete
                    defaultItems={productList}
                    errorMessage={errors.productId?.message}
                    isDisabled={!!editingData}
                    isInvalid={!!errors.productId}
                    label='เลือกสินค้า'
                    placeholder='ค้นหาชื่อสินค้า...'
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      const id = key as string
                      field.onChange(id)
                      setSelectedProductId(id)
                      setSelectedVariantId('')
                      return setValue('variantId', null)
                    }}
                  >
                    {(item) => {
                      return (
                        <AutocompleteItem key={item.id} textValue={item.name}>
                          <User
                            avatarProps={{
                              src: item.images?.[0]?.url,
                              radius: 'sm',
                              size: 'sm',
                            }}
                            description={`สต็อกคลังหลัก: ${item.stockQuantity} | ราคา: ฿${item.price}`}
                            name={item.name}
                          />
                        </AutocompleteItem>
                      )
                    }}
                  </Autocomplete>
                )
              }}
            />

            {selectedProduct && selectedProduct.variants.length > 0 && (
              <Controller
                control={control}
                name='variantId'
                render={({ field }) => {
                  return (
                    <Select
                      isDisabled={!!editingData}
                      label='เลือกตัวเลือกสินค้า (Variant)'
                      placeholder='ระบุตัวเลือก...'
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const id = Array.from(keys)[0] as string
                        field.onChange(id)
                        return setSelectedVariantId(id)
                      }}
                    >
                      {selectedProduct.variants.map((v) => {
                        return (
                          <SelectItem key={v.id} textValue={v.name}>
                            {v.name} (คงเหลือ: {v.stockQuantity} | ราคา: ฿
                            {v.price})
                          </SelectItem>
                        )
                      })}
                    </Select>
                  )
                }}
              />
            )}

            {isStockMode && (
              <div className='flex flex-col gap-4'>
                {selectedProduct && (
                  <div className='bg-default-100 flex items-center justify-between rounded-xl p-3'>
                    <span className='text-small text-default-600 font-medium'>
                      สต็อกคลังหลักคงเหลือ:
                    </span>
                    <span className='text-primary font-bold'>
                      {mainStock.toLocaleString()} ชิ้น
                    </span>
                  </div>
                )}

                <Controller
                  control={control}
                  name='direction'
                  render={({ field }) => {
                    return (
                      <RadioGroup
                        label='ทิศทางการโอนสินค้า'
                        orientation='horizontal'
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Radio color='success' value='IN'>
                          <div className='flex items-center gap-2'>
                            <ArrowDownIcon size={16} /> โอนเข้าสาขา
                          </div>
                        </Radio>
                        <Radio color='danger' value='OUT'>
                          <div className='flex items-center gap-2'>
                            <ArrowUpIcon size={16} /> โอนคืนคลังหลัก
                          </div>
                        </Radio>
                      </RadioGroup>
                    )
                  }}
                />

                <Controller
                  control={control}
                  name='stockQuantity'
                  render={({ field }) => {
                    return (
                      <Input
                        errorMessage={errors.stockQuantity?.message}
                        isInvalid={!!errors.stockQuantity}
                        label='จำนวนสินค้า'
                        min={1}
                        type='number'
                        value={field.value?.toString()}
                        variant='bordered'
                        onValueChange={(val) => {
                          return field.onChange(Number(val))
                        }}
                      />
                    )
                  }}
                />
              </div>
            )}

            {isPriceMode && (
              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  control={control}
                  name='retailPrice'
                  render={({ field }) => {
                    return (
                      <Input
                        errorMessage={errors.retailPrice?.message}
                        isInvalid={!!errors.retailPrice}
                        label='ราคาขายหน้าร้าน (Retail)'
                        min={0}
                        placeholder='0.00'
                        startContent={
                          <span className='text-default-400 text-small'>฿</span>
                        }
                        type='number'
                        value={field.value?.toString()}
                        variant='bordered'
                        onValueChange={(val) => {
                          return field.onChange(Number(val))
                        }}
                      />
                    )
                  }}
                />
                <Controller
                  control={control}
                  name='netPrice'
                  render={({ field }) => {
                    return (
                      <Input
                        className='bg-primary-50 rounded-xl'
                        errorMessage={errors.netPrice?.message}
                        isInvalid={!!errors.netPrice}
                        label='ราคาที่คุณได้รับจริง (Net Price)'
                        min={0}
                        placeholder='0.00'
                        startContent={
                          <span className='text-default-400 text-small'>฿</span>
                        }
                        type='number'
                        value={field.value?.toString()}
                        variant='bordered'
                        onValueChange={(val) => {
                          return field.onChange(Number(val))
                        }}
                      />
                    )
                  }}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={onClose}>
              ยกเลิก
            </Button>
            <Button
              className='text-secondary font-bold'
              color='primary'
              isLoading={isPending}
              type='submit'
            >
              ยืนยันการทำรายการ
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { StorefrontInventoryForm }
