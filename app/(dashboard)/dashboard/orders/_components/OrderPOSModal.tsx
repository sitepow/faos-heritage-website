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
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { CreateOrderInput } from '@/features/order/action'

import { useAffiliates } from '@/features/affiliate/hook'
import { useAdminOrderMutation } from '@/features/order/mutation'
import { useActiveStorefronts } from '@/features/storefront/hook'
import { useStorefrontInventories } from '@/features/storefront-inventory/hook'
import { formatCurrency } from '@/utils'

interface POSProductItem {
  productId: string
  variantId: string | null
  cartKey: string
  displayName: string
  effectivePrice: number
  stock: number
}

interface CartItem {
  cartKey: string
  productId: string
  variantId: string | null
  name: string
  price: number
  quantity: number
  maxStock: number
}

const OrderPOSModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAffiliateCode, setSelectedAffiliateCode] = useState<string>('')
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>('')

  const { data: affiliates } = useAffiliates()
  const { data: storefronts, isLoading: isLoadingStores } =
    useActiveStorefronts()
  const { createAdminOrder, isCreating } = useAdminOrderMutation()

  const { data: storeInventory, isLoading: isLoadingInventory } =
    useStorefrontInventories({
      storefrontId: selectedStorefrontId,
    })

  const productList = useMemo<POSProductItem[]>(() => {
    if (!selectedStorefrontId || !storeInventory) {
      return []
    }

    return storeInventory.map((item) => {
      const productName = item.product?.name || 'Unknown Product'
      const variantName = item.variant?.name ? ` (${item.variant.name})` : ''

      return {
        productId: item.productId,
        variantId: item.variantId,
        cartKey: item.variantId
          ? `var-${item.variantId}`
          : `main-${item.productId}`,
        displayName: `${productName}${variantName}`,
        effectivePrice: Number(item.netPrice),
        stock: item.stockQuantity || 0,
      }
    })
  }, [selectedStorefrontId, storeInventory])

  const handleAddToCart = (item: POSProductItem): void => {
    return setCartItems((prev: CartItem[]) => {
      const isExist = prev.find((i: CartItem) => {
        return i.cartKey === item.cartKey
      })

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
    }

    try {
      const result = await createAdminOrder(payload)
      if (result.success) {
        toast.success('สร้างคำสั่งซื้อสำเร็จ')
        setCartItems([])
        setSelectedAffiliateCode('')
        setSelectedStorefrontId('')
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
        <ModalHeader className='border-default-100 flex items-center gap-2 border-b'>
          สร้างรายการสั่งซื้อใหม่ (POS)
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
              ) : isLoadingInventory ? (
                <div className='flex h-full items-center justify-center py-20'>
                  <Spinner label='กำลังโหลดสินค้าในสาขา...' />
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {productList.map((item: POSProductItem) => {
                    return (
                      <div
                        key={item.cartKey}
                        className='hover:bg-default-50 border-default-100 flex flex-col justify-between gap-3 rounded-md border p-3 transition-colors'
                      >
                        <div>
                          <p className='min-h-[40px] text-sm font-bold'>
                            {item.displayName}
                          </p>
                          <div className='mt-1 flex items-center justify-between'>
                            <p className='text-primary font-bold'>
                              {formatCurrency(item.effectivePrice)}
                            </p>
                            <p
                              className={`text-xs ${item.stock <= 5 ? 'text-danger font-bold' : 'text-default-400'}`}
                            >
                              คงเหลือ: {item.stock}
                            </p>
                          </div>
                        </div>
                        <Button
                          fullWidth
                          color='primary'
                          isDisabled={item.stock <= 0}
                          size='sm'
                          variant='flat'
                          onPress={() => {
                            return handleAddToCart(item)
                          }}
                        >
                          {item.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
                        </Button>
                      </div>
                    )
                  })}
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
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold'>{item.name}</span>
                          <span className='text-primary text-xs font-semibold'>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
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

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <UserIcon size={16} />
                  ระบุตัวแทนจำหน่าย
                </h3>
                <Select
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
                  {(Array.isArray(affiliates) ? affiliates : []).map(
                    (affiliate) => {
                      return (
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
                      )
                    },
                  )}
                </Select>
              </div>

              <div className='bg-primary/5 border-primary/10 mt-auto rounded-lg border p-4'>
                <div className='flex items-center justify-between text-lg font-bold'>
                  <span>ยอดรวม:</span>
                  <span className='text-primary'>
                    {formatCurrency(
                      cartItems.reduce((acc: number, item: CartItem) => {
                        return acc + item.price * item.quantity
                      }, 0),
                    )}
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
              return onClose()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            className='text-secondary flex-1 font-bold sm:px-8'
            color='primary'
            isDisabled={cartItems.length === 0 || !selectedStorefrontId}
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
