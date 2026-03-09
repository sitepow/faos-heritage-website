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
} from '@heroui/react'
import { DeliveryType } from '@prisma/client'
import {
  ShoppingCartIcon,
  Trash2Icon,
  UserIcon,
  MapPinIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { CreateOrderInput } from '@/features/order/order.action'

import { useAffiliates } from '@/features/affiliate/affiliate.hook'
import { useAdminOrderMutation } from '@/features/order/order.mutation'
import { useProductsAdmin } from '@/features/product/product.hook'
import { useActiveStorefronts } from '@/features/storefront/storefront.hook'
import { formatCurrency } from '@/utils'

interface ProductVariant {
  id: string
  name: string
  price: number
  salePrice: number | null
  stockQuantity: number
}

interface Product {
  id: string
  name: string
  price: number
  salePrice: number | null
  stockQuantity: number
  variants: ProductVariant[]
}

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

  const { data: products } = useProductsAdmin(1, 100)
  const { data: affiliates } = useAffiliates()
  const { data: storefronts, isLoading: isLoadingStores } =
    useActiveStorefronts()
  const { createAdminOrder, isCreating } = useAdminOrderMutation()

  const productList = useMemo<POSProductItem[]>(() => {
    if (!products || !('items' in products)) {
      return []
    }

    const items = products.items as Product[]

    return items.flatMap<POSProductItem>((product: Product) => {
      if (!product.variants || product.variants.length === 0) {
        return [
          {
            productId: product.id,
            variantId: null,
            cartKey: `main-${product.id}`,
            displayName: product.name,
            effectivePrice:
              product.salePrice && product.salePrice > 0
                ? product.salePrice
                : product.price,
            stock: product.stockQuantity || 0,
          },
        ]
      }

      return product.variants.map((variant: ProductVariant) => {
        return {
          productId: product.id,
          variantId: variant.id,
          cartKey: `var-${variant.id}`,
          displayName: `${product.name} (${variant.name})`,
          effectivePrice:
            variant.salePrice && variant.salePrice > 0
              ? variant.salePrice
              : variant.price,
          stock: variant.stockQuantity || 0,
        }
      })
    })
  }, [products])

  const handleAddToCart = (item: POSProductItem): void => {
    return setCartItems((prev: CartItem[]) => {
      const isExist = prev.find((i: CartItem) => {
        return i.cartKey === item.cartKey
      })

      if (isExist) {
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
        },
      ]
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
                          <p className='text-default-400 text-xs'>
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
            </div>

            <div className='bg-default-50/50 flex w-full flex-col gap-4 p-4 lg:w-[380px] lg:overflow-y-auto lg:p-6 xl:w-[420px]'>
              <h3 className='flex items-center gap-2 text-lg font-bold'>
                รายการในตะกร้า ({cartItems.length})
              </h3>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                {cartItems.map((item: CartItem) => {
                  return (
                    <div
                      key={item.cartKey}
                      className='border-default-100 bg-default-50 flex items-center justify-between gap-3 rounded-lg border p-2'
                    >
                      <div className='flex flex-1 flex-col'>
                        <span className='text-sm font-medium'>{item.name}</span>
                        <span className='text-default-500 text-xs'>
                          {formatCurrency(item.price)} x {item.quantity}
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm font-bold whitespace-nowrap'>
                          {formatCurrency(item.price * item.quantity)}
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
                          <Trash2Icon size={16} />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {cartItems.length === 0 && (
                  <div className='text-default-400 flex flex-col items-center justify-center gap-2 py-8 italic'>
                    <ShoppingCartIcon className='opacity-20' size={32} />
                    ยังไม่มีสินค้าในตะกร้า
                  </div>
                )}
              </div>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <MapPinIcon size={16} />
                  เลือกสาขาที่ทำรายการ
                </h3>
                <Select
                  label='เลือกสาขา'
                  placeholder={
                    isLoadingStores ? 'กำลังโหลด...' : 'เลือกสาขาหน้าร้าน'
                  }
                  selectedKeys={
                    selectedStorefrontId ? [selectedStorefrontId] : []
                  }
                  size='sm'
                  variant='bordered'
                  onSelectionChange={(keys) => {
                    return setSelectedStorefrontId(
                      Array.from(keys)[0] as string,
                    )
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

              <div className='bg-default-50 mt-4 rounded-lg p-4 shadow-sm'>
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
            variant='light'
            onPress={() => {
              return onClose()
            }}
          >
            ยกเลิก
          </Button>
          <Button
            className='text-secondary flex-1 font-bold sm:px-8'
            color='primary'
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
