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
import { useForm } from 'react-hook-form'

import { useStorefrontInventoryMutation } from '../storefront-inventory.mutation'
import {
  storefrontInventorySchema,
  type StorefrontInventoryInput,
} from '../storefront-inventory.schema'
import { useStorefrontInventoryStore } from '../storefront-inventory.store'

import { useProductsAdmin } from '@/features/product/product.hook'

const StorefrontInventoryForm = ({
  storefrontId,
}: {
  storefrontId: string
}) => {
  const { isOpen, onClose, data: editingData } = useStorefrontInventoryStore()
  const { transferStock, isPending } = useStorefrontInventoryMutation()
  const { data: productsData } = useProductsAdmin(1, 100)

  const [selectedProductId, setSelectedProductId] = useState<string>('')

  const productList = useMemo(() => {
    return productsData && 'items' in productsData ? productsData.items : []
  }, [productsData])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StorefrontInventoryInput>({
    resolver: zodResolver(storefrontInventorySchema),
    defaultValues: {
      storefrontId,
      direction: 'IN',
      stockQuantity: 1,
    },
  })

  const currentDirection = watch('direction')

  const selectedProduct = useMemo(() => {
    return productList.find((p) => {
      return p.id === selectedProductId
    })
  }, [selectedProductId, productList])

  useEffect(() => {
    if (editingData) {
      setSelectedProductId(editingData.productId)
      return reset(editingData)
    }
  }, [editingData, reset])

  const handleSave = async (values: StorefrontInventoryInput) => {
    const result = await transferStock(values)
    if (result.success) {
      reset()
      return onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} scrollBehavior='inside' size='xl' onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit(handleSave)}>
          <ModalHeader className='flex flex-col gap-1'>
            {editingData
              ? 'แก้ไขข้อมูลสต็อก/ราคา'
              : 'เพิ่มสินค้าและโอนสต็อกเข้าสาขา'}
          </ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <RadioGroup
              label='ทิศทางการโอนสินค้า'
              orientation='horizontal'
              value={currentDirection}
              onValueChange={(val) => {
                return setValue('direction', val as 'IN' | 'OUT')
              }}
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

            <Autocomplete
              defaultItems={productList}
              label='เลือกสินค้า'
              placeholder='ค้นหาชื่อสินค้า...'
              selectedKey={selectedProductId}
              onSelectionChange={(key) => {
                const id = key as string
                setSelectedProductId(id)
                return setValue('productId', id)
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
                      description={`สต็อกคลังหลัก: ${item.stockQuantity}`}
                      name={item.name}
                    />
                  </AutocompleteItem>
                )
              }}
            </Autocomplete>

            {selectedProduct && selectedProduct.variants.length > 0 && (
              <Select
                label='เลือกตัวเลือกสินค้า (Variant)'
                placeholder='ระบุตัวเลือก...'
                onSelectionChange={(keys) => {
                  return setValue('variantId', Array.from(keys)[0] as string)
                }}
              >
                {selectedProduct.variants.map((v: any) => {
                  return (
                    <SelectItem key={v.id} textValue={v.name}>
                      {v.name} (คงเหลือ: {v.stockQuantity})
                    </SelectItem>
                  )
                })}
              </Select>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <Input
                {...register('stockQuantity', { valueAsNumber: true })}
                errorMessage={errors.stockQuantity?.message}
                isInvalid={!!errors.stockQuantity}
                label='จำนวนสินค้า'
                type='number'
              />
              <Input
                {...register('retailPrice', { valueAsNumber: true })}
                errorMessage={errors.retailPrice?.message}
                isInvalid={!!errors.retailPrice}
                label='ราคาขายหน้าร้าน (Retail)'
                placeholder='0.00'
                startContent={
                  <span className='text-default-400 text-small'>฿</span>
                }
              />
            </div>

            <Input
              {...register('netPrice', { valueAsNumber: true })}
              className='bg-primary-50 rounded-xl'
              errorMessage={errors.netPrice?.message}
              isInvalid={!!errors.netPrice}
              label='ราคาที่คุณได้รับจริง (Net Price)'
              placeholder='ราคา 90 บาท'
              startContent={<span className='text-primary text-small'>฿</span>}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={onClose}>
              ยกเลิก
            </Button>
            <Button color='primary' isLoading={isPending} type='submit'>
              ยืนยันการทำรายการ
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export { StorefrontInventoryForm }
