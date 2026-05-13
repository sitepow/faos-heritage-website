/* eslint-disable no-nested-ternary */
'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Divider,
  Spinner,
  Input,
} from '@heroui/react'
import { DeliveryType } from '@prisma/client'
import {
  ShoppingCartIcon,
  Trash2Icon,
  UserIcon,
  MapPinIcon,
  StoreIcon,
  PlusIcon,
  MinusIcon,
  SearchIcon,
  PercentIcon,
  ReceiptIcon,
  FileWarningIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { CreateOrderInput } from '@/features/order/action'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useAffiliateProfile, useAffiliates } from '@/features/affiliate/hook'
import { useActiveContract } from '@/features/contract/hook'
import { useAdminOrderMutation } from '@/features/order/mutation'
import { useActiveStorefronts } from '@/features/storefront/hook'
import { useStorefrontInventories } from '@/features/storefront-inventory/hook'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils'

interface POSProductItem {
  productId: string
  variantId: string | null
  cartKey: string
  displayName: string
  effectivePrice: number
  stock: number
  image: string
}

interface CartItem {
  cartKey: string
  productId: string
  variantId: string | null
  name: string
  price: number
  quantity: number
  maxStock: number
  image: string
}

const OrderPOSModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { isAdmin } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAffiliateCode, setSelectedAffiliateCode] = useState<string>('')
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [discountValue, setDiscountValue] = useState<number>(0)
  const [taxPercentage, setTaxPercentage] = useState<number>(0)

  const { data: affiliates } = useAffiliates()
  const { data: storefronts, isLoading: isLoadingStores } =
    useActiveStorefronts()

  const { data: affiliateProfile } = useAffiliateProfile()

  const filteredAffiliates = useMemo(() => {
    if (isAdmin) {
      return affiliates || []
    }

    if (!selectedStorefrontId || !storefronts || !affiliates) {
      return []
    }

    const currentStore = storefronts.find((s) => s.id === selectedStorefrontId)
    if (!currentStore || !currentStore.managers) {
      return []
    }

    const managerIds = currentStore.managers.map((m) => m.id)

    return (affiliates || []).filter((aff) => managerIds.includes(aff.userId))
  }, [isAdmin, selectedStorefrontId, storefronts, affiliates])

  useEffect(() => {
    if (storefronts?.length === 1 && !selectedStorefrontId) {
      setSelectedStorefrontId(storefronts[0].id)
    }
  }, [storefronts, selectedStorefrontId])

  useEffect(() => {
    if (selectedStorefrontId && storefronts && affiliateProfile) {
      const currentStore = storefronts.find(
        (s) => s.id === selectedStorefrontId,
      )

      const isManagerInStore = currentStore?.managers?.some(
        (m) => m.id === affiliateProfile.userId,
      )

      if (isManagerInStore && affiliateProfile.affiliateCode) {
        setSelectedAffiliateCode(affiliateProfile.affiliateCode)
      } else if (!isAdmin) {
        setSelectedAffiliateCode('')
      }
    }
  }, [selectedStorefrontId, storefronts, affiliateProfile, isAdmin])

  const { createAdminOrder, isCreating } = useAdminOrderMutation()

  const { data: activeContract, isLoading: isLoadingContract } =
    useActiveContract(selectedStorefrontId)

  const { data: storeInventory, isLoading: isLoadingInventory } =
    useStorefrontInventories({
      storefrontId: selectedStorefrontId,
    })

  useEffect(() => {
    if (storefronts?.length === 1 && !selectedStorefrontId) {
      setSelectedStorefrontId(storefronts[0].id)
    }
  }, [storefronts, selectedStorefrontId])

  const productList = useMemo<POSProductItem[]>(() => {
    if (!selectedStorefrontId || !storeInventory || !activeContract) {
      return []
    }

    const filtered = storeInventory.filter((item) => {
      const name = item.product?.name || ''
      return name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return filtered.map((item) => {
      const productName = item.product?.name || 'Unknown Product'
      const variantName = item.variant?.name ? ` (${item.variant.name})` : ''

      const productImage =
        item.variant?.image ||
        item.product?.images?.find((img) => {
          return img.isPrimary
        })?.url ||
        item.product?.images?.[0]?.url ||
        IMAGE_FALLBACK.EMPTY

      return {
        productId: item.productId,
        variantId: item.variantId,
        cartKey: item.variantId
          ? `var-${item.variantId}`
          : `main-${item.productId}`,
        displayName: `${productName}${variantName}`,
        effectivePrice: Number(item.netPrice),
        stock: item.stockQuantity || 0,
        image: productImage,
      }
    })
  }, [selectedStorefrontId, storeInventory, searchQuery, activeContract])

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)
    const discount = discountValue
    const beforeTax = Math.max(0, subtotal - discount)
    const tax = (beforeTax * taxPercentage) / 100
    const total = beforeTax + tax

    return { subtotal, discount, tax, total }
  }, [cartItems, discountValue, taxPercentage])

  const handleAddToCart = (item: POSProductItem): void => {
    return setCartItems((prev: CartItem[]) => {
      const isExist = prev.find((i: CartItem) => {
        return i.cartKey === item.cartKey
      })

      if (item.stock === 0) {
        toast.warn('สินค้าในสต็อกไม่พอ')
        return prev
      }

      if (isExist) {
        if (isExist.quantity >= item.stock) {
          toast.warn('สินค้าในสต็อกไม่พอ')
          return prev
        }
        return prev.map((i: CartItem) => {
          return i.cartKey === item.cartKey
            ? { ...i, quantity: i.quantity + 1 }
            : i
        })
      }

      return [
        ...prev,
        {
          cartKey: item.cartKey,
          productId: item.productId,
          variantId: item.variantId,
          name: item.displayName,
          price: item.effectivePrice,
          quantity: 1,
          maxStock: item.stock,
          image: item.image,
        },
      ]
    })
  }

  const handleUpdateQuantity = (cartKey: string, amount: number): void => {
    return setCartItems((prev: CartItem[]) => {
      return prev
        .map((item: CartItem) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + amount
            if (amount > 0 && newQty > item.maxStock) {
              toast.warn('สินค้าในสต็อกไม่พอ')
              return item
            }
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter((item: CartItem) => {
          return item.quantity > 0
        })
    })
  }

  const handleRemoveFromCart = (cartKey: string): void => {
    return setCartItems((prev: CartItem[]) => {
      return prev.filter((item: CartItem) => {
        return item.cartKey !== cartKey
      })
    })
  }

  const handleCreateOrder = async (): Promise<void> => {
    if (cartItems.length === 0) {
      toast.error('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ')
      return
    }

    if (!selectedStorefrontId) {
      toast.error('กรุณาเลือกสาขาที่ทำรายการ')
      return
    }

    if (!activeContract) {
      toast.error(
        'ไม่สามารถทำรายการได้เนื่องจากสัญญายังไม่เปิดใช้งานหรือหมดอายุ',
      )
      return
    }

    const payload: CreateOrderInput = {
      items: cartItems.map((item: CartItem) => {
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        }
      }),
      deliveryType: DeliveryType.PICKUP,
      storefrontId: selectedStorefrontId,
      pickupDate: new Date(),
      currency: 'THB',
      exchangeRate: 1,
      exchangeLocale: 'th-TH',
      referrerId: selectedAffiliateCode || undefined,
      discount: totals?.discount || 0,
      tax: totals?.tax || 0,
      isPos: true,
    }

    try {
      const result = await createAdminOrder(payload)
      if (result.success) {
        toast.success('สร้างคำสั่งซื้อสำเร็จ')
        setCartItems([])
        setSelectedAffiliateCode('')
        setSelectedStorefrontId('')
        setSearchQuery('')
        setDiscountValue(0)
        setTaxPercentage(0)
        return onClose()
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ')
    }
  }

  return (
    <Modal
      hideCloseButton
      className='max-h-[95vh]'
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior='inside'
      size='5xl'
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className='border-default-100 flex flex-wrap items-center justify-between gap-2 border-b px-6 py-4'>
          <span className='font-bold'>สร้างรายการสั่งซื้อใหม่ (POS)</span>
          {selectedStorefrontId && activeContract && (
            <div className='w-72'>
              <Input
                isClearable
                placeholder='ค้นหาชื่อสินค้า...'
                size='sm'
                startContent={
                  <SearchIcon className='text-default-400' size={18} />
                }
                value={searchQuery}
                onClear={() => {
                  return setSearchQuery('')
                }}
                onValueChange={setSearchQuery}
              />
            </div>
          )}
        </ModalHeader>

        <ModalBody className='overflow-y-auto p-0'>
          <div className='flex h-full flex-col lg:flex-row lg:overflow-hidden'>
            <div className='border-default-100 flex-1 p-4 lg:overflow-y-auto lg:border-r lg:p-6'>
              {!selectedStorefrontId ? (
                <div className='flex h-full flex-col items-center justify-center gap-4 py-20 text-center'>
                  <div className='bg-primary/10 text-primary rounded-full p-6'>
                    <StoreIcon size={48} />
                  </div>
                  <div>
                    <h4 className='text-lg font-bold'>ยังไม่ได้เลือกสาขา</h4>
                    <p className='text-default-500'>
                      กรุณาเลือกสาขาที่ด้านขวา เพื่อแสดงสินค้าที่มีจำหน่าย
                    </p>
                  </div>
                </div>
              ) : isLoadingContract || isLoadingInventory ? (
                <div className='flex h-full items-center justify-center py-20'>
                  <Spinner label='กำลังตรวจสอบสถานะสัญญาและข้อมูลสต็อก...' />
                </div>
              ) : !activeContract ? (
                <div className='flex h-full flex-col items-center justify-center gap-4 py-20 text-center'>
                  <div className='bg-danger/10 text-danger rounded-full p-6'>
                    <FileWarningIcon size={48} />
                  </div>
                  <div>
                    <h4 className='text-danger text-lg font-bold'>
                      ไม่พบสัญญาที่ใช้งานได้
                    </h4>
                    <p className='text-default-500 max-w-md'>
                      สาขานี้ยังไม่มีสัญญาที่ผ่านการอนุมัติ
                      หรือสัญญาสิ้นสุดระยะเวลาแล้ว
                      กรุณาตรวจสอบสถานะสัญญาในระบบก่อนทำรายการ
                    </p>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {productList.map((item: POSProductItem) => {
                    return (
                      <div
                        key={item.cartKey}
                        className='hover:bg-default-50 border-default-100 flex cursor-pointer flex-col gap-3 rounded-md border p-3 transition-colors'
                        onClick={() => {
                          return handleAddToCart(item)
                        }}
                      >
                        <div className='flex gap-3'>
                          <div className='bg-default-100 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md'>
                            <ProductImage image={item.image} />
                          </div>
                          <div className='flex-1 overflow-hidden'>
                            <p className='text-sm font-bold'>
                              {item.displayName}
                            </p>
                            <p className='text-primary text-sm font-bold'>
                              {formatCurrency(item.effectivePrice)}
                            </p>
                            <p
                              className={`text-xs ${item.stock <= 5 ? 'text-danger font-bold' : 'text-default-400'}`}
                            >
                              คงเหลือ: {item.stock}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {productList.length === 0 && searchQuery && (
                    <div className='text-default-400 col-span-full py-20 text-center'>
                      ไม่พบสินค้าที่ตรงกับ &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='bg-default-50/50 flex w-full flex-col gap-4 p-4 lg:w-[380px] lg:overflow-y-auto lg:p-6 xl:w-[420px]'>
              <h3 className='flex items-center gap-2 text-lg font-bold'>
                <ShoppingCartIcon size={20} />
                รายการในตะกร้า ({cartItems.length})
              </h3>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <MapPinIcon size={16} />
                  สาขาที่ทำรายการ
                </h3>
                <Select
                  label='สาขาหน้าร้าน'
                  placeholder={isLoadingStores ? 'กำลังโหลด...' : 'ระบุสาขา'}
                  selectedKeys={
                    selectedStorefrontId ? [selectedStorefrontId] : []
                  }
                  size='sm'
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    const newId = Array.from(keys)[0] as string
                    if (newId !== selectedStorefrontId) {
                      setCartItems([])
                      setSearchQuery('')
                      return setSelectedStorefrontId(newId)
                    }
                  }}
                >
                  {(Array.isArray(storefronts) ? storefronts : []).map(
                    (store) => {
                      return (
                        <SelectItem key={store.id} textValue={store.name}>
                          {store.name}
                        </SelectItem>
                      )
                    },
                  )}
                </Select>
              </div>

              <Divider className='bg-default-200' />

              <div className='flex min-h-[300px] flex-col gap-3 overflow-y-auto'>
                {cartItems.map((item: CartItem) => {
                  return (
                    <div
                      key={item.cartKey}
                      className='border-default-100 bg-default-50 flex flex-col gap-2 rounded-lg border p-3'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='bg-default-100 size-12 shrink-0 overflow-hidden rounded-md'>
                          <ProductImage image={item.image} />
                        </div>
                        <div className='flex flex-1 flex-col overflow-hidden'>
                          <div className='flex items-start justify-between gap-2'>
                            <span className='text-sm font-bold'>
                              {item.name}
                            </span>
                            <Button
                              isIconOnly
                              color='danger'
                              size='sm'
                              variant='light'
                              onPress={() => {
                                return handleRemoveFromCart(item.cartKey)
                              }}
                            >
                              <Trash2Icon size={14} />
                            </Button>
                          </div>
                          <span className='text-primary text-xs font-semibold'>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='bg-default-100 flex items-center rounded-md'>
                          <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            onPress={() => {
                              return handleUpdateQuantity(item.cartKey, -1)
                            }}
                          >
                            <MinusIcon size={14} />
                          </Button>
                          <span className='w-8 text-center text-sm font-bold'>
                            {item.quantity}
                          </span>
                          <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            onPress={() => {
                              return handleUpdateQuantity(item.cartKey, 1)
                            }}
                          >
                            <PlusIcon size={14} />
                          </Button>
                        </div>
                        <span className='text-sm font-bold'>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {cartItems.length === 0 && (
                  <div className='text-default-400 flex flex-col items-center justify-center gap-2 py-8'>
                    <ShoppingCartIcon className='opacity-20' size={32} />
                    ยังไม่มีสินค้าในตะกร้า
                  </div>
                )}
              </div>

              <Divider className='bg-default-200' />

              <div className='grid grid-cols-2 gap-3'>
                <Input
                  label='ส่วนลด (บาท)'
                  placeholder='0'
                  size='sm'
                  startContent={
                    <PercentIcon className='text-default-400' size={14} />
                  }
                  type='number'
                  value={discountValue.toString()}
                  variant='bordered'
                  onValueChange={(val) => {
                    return setDiscountValue(Number(val) || 0)
                  }}
                />
                <Input
                  label='ภาษี (%)'
                  placeholder='0'
                  size='sm'
                  startContent={
                    <ReceiptIcon className='text-default-400' size={14} />
                  }
                  type='number'
                  value={taxPercentage.toString()}
                  variant='bordered'
                  onValueChange={(val) => {
                    return setTaxPercentage(Number(val) || 0)
                  }}
                />
              </div>

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <UserIcon size={16} />
                  ระบุตัวแทนจำหน่าย
                </h3>

                {!isAdmin && filteredAffiliates.length === 0 ? (
                  <div className='border-warning/50 bg-warning/10 text-tiny text-warning-600 flex items-center gap-2 rounded-md border p-3'>
                    <FileWarningIcon size={14} />
                    ไม่พบข้อมูลตัวแทนจำหน่ายในสาขานี้
                  </div>
                ) : (
                  <Select
                    isDisabled={!isAdmin && !!affiliateProfile?.affiliateCode}
                    label='เลือก Affiliate (ถ้ามี)'
                    placeholder='ค้นหาชื่อ Affiliate'
                    selectedKeys={
                      selectedAffiliateCode ? [selectedAffiliateCode] : []
                    }
                    size='sm'
                    variant='bordered'
                    onSelectionChange={(keys) => {
                      return setSelectedAffiliateCode(
                        Array.from(keys)[0] as string,
                      )
                    }}
                  >
                    {filteredAffiliates.map((affiliate) => (
                      <SelectItem
                        key={affiliate.affiliateCode}
                        textValue={`${affiliate.user?.name} (${affiliate.affiliateCode})`}
                      >
                        <div className='flex flex-col'>
                          <span className='text-small'>
                            {affiliate.user?.name}
                          </span>
                          <span className='text-tiny text-default-400'>
                            Code: {affiliate.affiliateCode}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>

              <div className='bg-primary/5 border-primary/10 mt-auto flex flex-col gap-2 rounded-lg border p-4'>
                <div className='text-default-600 flex items-center justify-between text-sm'>
                  <span>ยอดรวมสินค้า:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className='text-danger flex items-center justify-between text-sm'>
                    <span>ส่วนลด:</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                {totals.tax > 0 && (
                  <div className='text-default-600 flex items-center justify-between text-sm'>
                    <span>ภาษี ({taxPercentage}%):</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                )}
                <Divider className='my-1 opacity-50' />
                <div className='flex items-center justify-between text-lg font-bold'>
                  <span>ยอดสุทธิ:</span>
                  <span className='text-primary'>
                    {formatCurrency(totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='border-default-100 flex items-center border-t p-4'>
          <Button
            variant='flat'
            onPress={() => {
              setCartItems([])
              setSelectedStorefrontId('')
              setSearchQuery('')
              setDiscountValue(0)
              setTaxPercentage(0)
              return onClose()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            className='text-secondary flex-1 font-bold sm:px-8'
            color='primary'
            isDisabled={
              cartItems.length === 0 || !selectedStorefrontId || !activeContract
            }
            isLoading={isCreating}
            size='lg'
            onPress={() => {
              return handleCreateOrder()
            }}
          >
            ยืนยันการทำรายการ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { OrderPOSModal }
