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
  Tabs,
  Tab,
  DatePicker,
} from '@heroui/react'
import { getLocalTimeZone, parseDate } from '@internationalized/date'
import { ContractStatus } from '@prisma/client'
import {
  FileSignatureIcon,
  Trash2Icon,
  StoreIcon,
  SearchIcon,
  ReceiptIcon,
  PercentIcon,
  CalendarIcon,
  PackageSearchIcon,
  WarehouseIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import type { ProductWithPayload } from '@/features/product/action'
import type { getStorefrontInventory } from '@/features/storefront/action'
import type { CalendarDate } from '@internationalized/date'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useContractMutation } from '@/features/contract/mutation'
import { type ContractInput } from '@/features/contract/schema'
import { useProductsAdmin } from '@/features/product/hook'
import {
  useActiveStorefronts,
  useStorefrontInventory,
} from '@/features/storefront/hook'
import { formatCurrency } from '@/utils'

type StoreInventoryItem = NonNullable<
  Awaited<ReturnType<typeof getStorefrontInventory>>
>[number]

interface POSContractProduct {
  productId: string
  variantId: string | null
  cartKey: string
  displayName: string
  basePrice: number
  stock: number
  warehouseStock?: number
  image: string
  existingAgreedPrice?: number
}

interface SelectedItem {
  cartKey: string
  productId: string
  variantId: string | null
  name: string
  retailPrice: number
  agreedPrice: number
  quantity: number
  maxStock: number
  image: string
}

const CONTRACT_SOURCE = {
  WAREHOUSE: 'WAREHOUSE',
  STOREFRONT: 'STOREFRONT',
} as const

type ContractSourceMode = keyof typeof CONTRACT_SOURCE

const ContractPOSModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const router = useRouter()
  const { create, isCreating } = useContractMutation()

  const [sourceMode, setSourceMode] = useState<ContractSourceMode>(
    CONTRACT_SOURCE.WAREHOUSE,
  )

  const [startDate, setStartDate] = useState<CalendarDate | null>(
    parseDate(new Date().toISOString().split('T')[0]),
  )
  const [endDate, setEndDate] = useState<CalendarDate | null>(null)

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [profitPercentage, setProfitPercentage] = useState<number>(0)

  const { data: storefronts, isLoading: isLoadingStores } =
    useActiveStorefronts()
  const { data: productsData, isLoading: isLoadingProd } = useProductsAdmin(
    1,
    100,
  )
  const { data: storeInventory, isLoading: isLoadingInventory } =
    useStorefrontInventory(selectedStorefrontId)

  const warehouseItems = useMemo(() => {
    return productsData && 'items' in productsData
      ? (productsData.items as ProductWithPayload[])
      : []
  }, [productsData])

  const productList = useMemo(() => {
    if (sourceMode === CONTRACT_SOURCE.STOREFRONT) {
      if (!selectedStorefrontId) {
        return []
      }

      const items = (storeInventory as StoreInventoryItem[]) || []
      return items
        .filter((inv) =>
          inv.product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((inv) => {
          const warehouseProd = warehouseItems.find(
            (p) => p?.id === inv.productId,
          )
          const warehouseStock = inv.variantId
            ? (warehouseProd?.variants.find((v) => v.id === inv.variantId)
                ?.stockQuantity ?? 0)
            : (warehouseProd?.stockQuantity ?? 0)

          return {
            productId: inv.productId,
            variantId: inv.variantId || null,
            cartKey: inv.variantId
              ? `store-var-${inv.variantId}`
              : `store-main-${inv.productId}`,
            displayName:
              inv.variantId && inv.variant
                ? `${inv.product.name} (${inv.variant.name})`
                : inv.product.name,
            basePrice: Number(inv.retailPrice),
            stock: inv.stockQuantity,
            warehouseStock: warehouseStock,
            image:
              inv.product.images?.find((img) => img.isPrimary)?.url ||
              inv.product.images?.[0]?.url ||
              IMAGE_FALLBACK.EMPTY,
            existingAgreedPrice: Number(inv.netPrice),
          }
        })
    }

    const filtered = warehouseItems.filter((p) =>
      p?.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const flatList: POSContractProduct[] = []
    filtered.forEach((p) => {
      const productImage =
        p?.images?.find((img) => img.isPrimary)?.url ||
        p?.images?.[0]?.url ||
        IMAGE_FALLBACK.EMPTY

      if (p?.variants && p.variants.length > 0) {
        p.variants.forEach((v) => {
          flatList.push({
            productId: p.id,
            variantId: v.id,
            cartKey: `var-${v.id}`,
            displayName: `${p.name} (${v.name})`,
            basePrice: Number(v.price),
            stock: v.stockQuantity || 0,
            image: productImage,
          })
        })
      } else if (p) {
        flatList.push({
          productId: p.id,
          variantId: null,
          cartKey: `main-${p.id}`,
          displayName: p.name,
          basePrice: Number(p.price),
          stock: p.stockQuantity || 0,
          image: productImage,
        })
      }
    })
    return flatList
  }, [
    warehouseItems,
    storeInventory,
    searchQuery,
    sourceMode,
    selectedStorefrontId,
  ])

  const totals = useMemo(() => {
    const retailTotal = selectedItems.reduce(
      (acc, item) => acc + item.retailPrice * (item.quantity || 1),
      0,
    )
    const agreedTotal = selectedItems.reduce(
      (acc, item) => acc + item.agreedPrice * (item.quantity || 1),
      0,
    )
    return {
      retailTotal: Number(retailTotal.toFixed(2)),
      agreedTotal: Number(agreedTotal.toFixed(2)),
      potentialProfit: Number((retailTotal - agreedTotal).toFixed(2)),
    }
  }, [selectedItems])

  const applyProfitPercentage = (percentage: number) => {
    setProfitPercentage(percentage)
    setSelectedItems((prev) =>
      prev.map((item) => ({
        ...item,
        agreedPrice:
          Math.ceil(item.retailPrice * (1 - percentage / 100) * 100) / 100,
      })),
    )
  }

  const handleAddItem = (product: POSContractProduct): void => {
    return setSelectedItems((prev: SelectedItem[]) => {
      const isExist = prev.find(
        (i: SelectedItem) =>
          i.productId === product.productId &&
          i.variantId === product.variantId,
      )

      if (isExist) {
        toast.warn('สินค้านี้อยู่ในรายการแล้ว')
        return prev
      }

      let initialPrice = product.existingAgreedPrice ?? product.basePrice

      if (profitPercentage > 0) {
        const calculated = product.basePrice * (1 - profitPercentage / 100)
        initialPrice = Math.ceil(calculated * 100) / 100
      }

      return [
        ...prev,
        {
          cartKey: product.cartKey,
          productId: product.productId,
          variantId: product.variantId,
          name: product.displayName,
          retailPrice: product.basePrice,
          agreedPrice: initialPrice,
          quantity: sourceMode === CONTRACT_SOURCE.STOREFRONT ? 0 : 1,
          maxStock:
            sourceMode === CONTRACT_SOURCE.STOREFRONT
              ? (product.warehouseStock ?? 0)
              : product.stock,
          image: product.image,
        },
      ]
    })
  }

  const handleUpdatePrice = (cartKey: string, val: string): void => {
    const cleanValue = val.replace(/[^0-9.]/g, '')
    const price = parseFloat(cleanValue) || 0
    return setSelectedItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, agreedPrice: price } : item,
      ),
    )
  }

  const handleRemoveFromCart = (cartKey: string): void => {
    return setSelectedItems((prev: SelectedItem[]) =>
      prev.filter((item: SelectedItem) => item.cartKey !== cartKey),
    )
  }

  const handleCreateContract = async (): Promise<void> => {
    if (selectedItems.length === 0 || !selectedStorefrontId) {
      toast.error('กรุณาเลือกหน้าร้านและสินค้า')
      return
    }

    try {
      const payload: ContractInput = {
        storefrontId: selectedStorefrontId,
        status: ContractStatus.DRAFT,
        currency: 'THB',
        startDate: startDate!.toDate(getLocalTimeZone()),
        endDate: endDate ? endDate.toDate(getLocalTimeZone()) : null,
        totalAmount: totals.agreedTotal,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          variantName: null,
          quantity: item.quantity,
          agreedPrice: item.agreedPrice,
          subtotal: Number(
            (item.agreedPrice * (item.quantity || 1)).toFixed(2),
          ),
        })),
      }

      const result = await create(payload)

      if (result.success) {
        toast.success('ร่างสัญญาสำเร็จ')
        router.push('/dashboard/contracts')
        setSelectedItems([])
        setSelectedStorefrontId('')
        setSearchQuery('')
        setProfitPercentage(0)
        return onClose()
      }
    } catch {
      toast.error('เกิดข้อผิดพลาดในการสร้างสัญญา')
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
          <div className='flex flex-col gap-1'>
            <span className='flex items-center gap-2 font-bold'>
              <FileSignatureIcon size={20} />
              สร้างรายการสัญญาใหม่ (B2B)
            </span>
            <p className='text-default-400 text-[10px] font-normal uppercase'>
              {sourceMode === 'WAREHOUSE'
                ? 'โหมด: โอนสินค้าใหม่จากคลังหลัก'
                : 'โหมด: ปรับราคา/เติมสต็อกสินค้าเดิมในร้าน'}
            </p>
          </div>
          <div className='w-72'>
            <Input
              isClearable
              placeholder='ค้นหาชื่อสินค้า...'
              size='sm'
              startContent={
                <SearchIcon className='text-default-400' size={18} />
              }
              value={searchQuery}
              onClear={() => setSearchQuery('')}
              onValueChange={setSearchQuery}
            />
          </div>
        </ModalHeader>

        <ModalBody className='overflow-y-auto p-0'>
          <div className='flex h-full flex-col lg:flex-row lg:overflow-hidden'>
            <div className='border-default-100 flex-1 p-4 lg:overflow-y-auto lg:border-r lg:p-6'>
              <div className='mb-6'>
                <Tabs
                  fullWidth
                  aria-label='Source Mode'
                  color='primary'
                  selectedKey={sourceMode}
                  variant='underlined'
                  onSelectionChange={(key) => {
                    setSourceMode(key as ContractSourceMode)
                    setSelectedItems([])
                  }}
                >
                  <Tab
                    key='WAREHOUSE'
                    title={
                      <div className='flex items-center space-x-2'>
                        <WarehouseIcon size={16} />
                        <span>ดึงจากคลังหลัก</span>
                      </div>
                    }
                  />
                  <Tab
                    key='STOREFRONT'
                    title={
                      <div className='flex items-center space-x-2'>
                        <PackageSearchIcon size={16} />
                        <span>ดึงจากสต็อกหน้าร้าน</span>
                      </div>
                    }
                  />
                </Tabs>
              </div>

              {isLoadingProd ||
              (sourceMode === 'STOREFRONT' && isLoadingInventory) ? (
                <div className='flex h-full items-center justify-center py-20'>
                  <Spinner label='กำลังโหลดข้อมูล...' />
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {sourceMode === 'STOREFRONT' && !selectedStorefrontId ? (
                    <div className='text-default-400 col-span-2 py-20 text-center'>
                      <StoreIcon
                        className='mx-auto mb-2 opacity-20'
                        size={48}
                      />
                      <p>กรุณาเลือกสาขาหน้าร้านก่อนเพื่อดึงข้อมูลสต็อกเดิม</p>
                    </div>
                  ) : (
                    productList.map((item) => (
                      <div
                        key={item.cartKey}
                        className='hover:bg-default-50 border-default-100 flex flex-col gap-3 rounded-md border p-3 transition-colors'
                      >
                        <div className='flex gap-3'>
                          <div className='bg-default-100 flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md'>
                            <ProductImage fill image={item.image} />
                          </div>
                          <div className='flex-1 overflow-hidden'>
                            <p className='text-sm font-bold'>
                              {item.displayName}
                            </p>
                            <p className='text-primary text-sm font-bold'>
                              {formatCurrency(item.basePrice)}
                            </p>
                            {sourceMode === CONTRACT_SOURCE.STOREFRONT ? (
                              <div className='flex flex-col'>
                                <p className='text-default-400 text-[10px]'>
                                  สต็อกเดิมที่ร้าน: {item.stock}
                                </p>
                                <p
                                  className={`text-[10px] font-bold ${item.warehouseStock! <= 0 ? 'text-danger' : 'text-primary'}`}
                                >
                                  คลังหลักพร้อมโอน: {item.warehouseStock}
                                </p>
                              </div>
                            ) : (
                              <p
                                className={`text-xs ${item.stock <= 5 ? 'text-danger font-bold' : 'text-default-400'}`}
                              >
                                สต็อกคลัง: {item.stock}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          fullWidth
                          size='sm'
                          variant='flat'
                          onPress={() => handleAddItem(item)}
                        >
                          {sourceMode === 'STOREFRONT'
                            ? 'เลือกปรับราคา/โอนเพิ่ม'
                            : 'เลือกทำสัญญา'}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className='bg-default-50/50 flex w-full flex-col gap-4 p-4 lg:w-[380px] lg:overflow-y-auto lg:p-6 xl:w-[420px]'>
              <h3 className='flex items-center gap-2 text-lg font-bold'>
                <ReceiptIcon size={20} />
                รายการในสัญญา ({selectedItems.length})
              </h3>
              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <StoreIcon size={16} />
                  สาขาคู่สัญญา
                </h3>
                <Select
                  label='สาขาหน้าร้าน'
                  placeholder={isLoadingStores ? 'กำลังโหลด...' : 'ระบุสาขา'}
                  selectedKeys={
                    selectedStorefrontId ? [selectedStorefrontId] : []
                  }
                  size='sm'
                  variant='bordered'
                  onSelectionChange={(keys) =>
                    setSelectedStorefrontId(Array.from(keys)[0] as string)
                  }
                >
                  {(Array.isArray(storefronts) ? storefronts : []).map(
                    (store) => (
                      <SelectItem key={store.id} textValue={store.name}>
                        {store.name}
                      </SelectItem>
                    ),
                  )}
                </Select>
              </div>

              <div className='flex flex-col gap-3'>
                <h3 className='text-default-700 flex items-center gap-2 text-sm font-bold'>
                  <CalendarIcon size={16} />
                  ระยะเวลาสัญญา
                </h3>
                <div className='grid grid-cols-2 gap-2'>
                  <DatePicker
                    calendarProps={{
                      classNames: {
                        content: 'bg-background',
                        gridBody:
                          '[&_td[data-selected=true]_span]:bg-primary [&_td[data-selected=true]_span]:text-secondary',
                        cellButton:
                          'data-[selected=true]:bg-primary data-[selected=true]:text-secondary',
                      },
                    }}
                    label='วันที่เริ่ม'
                    value={startDate}
                    variant='bordered'
                    onChange={setStartDate}
                  />
                  <DatePicker
                    calendarProps={{
                      classNames: {
                        content: 'bg-background',
                        gridBody:
                          '[&_td[data-selected=true]_span]:bg-primary [&_td[data-selected=true]_span]:text-secondary',
                        cellButton:
                          'data-[selected=true]:bg-primary data-[selected=true]:text-secondary',
                      },
                    }}
                    label='วันที่สิ้นสุด'
                    value={endDate}
                    variant='bordered'
                    onChange={setEndDate}
                  />
                </div>
              </div>

              <Divider className='bg-default-200' />

              <div className='flex flex-col gap-3'>
                <h3 className='flex items-center gap-2 text-sm font-bold'>
                  <PercentIcon size={16} />
                  กำหนดกำไรภาพรวม
                </h3>
                <Input
                  label='ส่วนลดจากราคาปลีก (%)'
                  min={0}
                  placeholder='0'
                  size='sm'
                  type='number'
                  value={profitPercentage.toString()}
                  variant='bordered'
                  onValueChange={(val) =>
                    applyProfitPercentage(Number(val) || 0)
                  }
                />
              </div>

              <Divider className='bg-default-200' />

              <div className='flex min-h-[300px] flex-col gap-3 overflow-y-auto'>
                {selectedItems.map((item) => (
                  <div
                    key={item.cartKey}
                    className='border-default-100 bg-default-50 flex flex-col gap-2 rounded-lg border p-3'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='bg-default-100 size-12 shrink-0 overflow-hidden rounded-md'>
                        <ProductImage fill image={item.image} />
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-sm font-bold'>{item.name}</span>
                          <Button
                            isIconOnly
                            color='danger'
                            size='sm'
                            variant='light'
                            onPress={() => handleRemoveFromCart(item.cartKey)}
                          >
                            <Trash2Icon size={14} />
                          </Button>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-default-400 text-[10px] font-semibold'>
                            ราคาปลีกเดิม: {formatCurrency(item.retailPrice)}
                          </span>
                          <span className='text-primary text-[10px] font-bold'>
                            คลังพร้อมโอน: {item.maxStock}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Input
                        label='ราคาเสนอใหม่'
                        size='sm'
                        type='text'
                        value={item.agreedPrice.toFixed(2)}
                        variant='bordered'
                        onValueChange={(val) =>
                          handleUpdatePrice(item.cartKey, val)
                        }
                      />
                      <div className='w-32 shrink-0'>
                        <Input
                          label={
                            sourceMode === CONTRACT_SOURCE.STOREFRONT
                              ? 'โอนเพิ่ม'
                              : 'จำนวน'
                          }
                          max={item.maxStock}
                          min={0}
                          size='sm'
                          type='number'
                          value={item.quantity.toString()}
                          variant='bordered'
                          onValueChange={(val) => {
                            const qty = Number(val) || 0
                            if (qty > item.maxStock) {
                              toast.warn(
                                `สต็อกคลังมีจำกัด โอนได้สูงสุด ${item.maxStock} ชิ้น`,
                              )
                              const safeQty = item.maxStock
                              setSelectedItems((prev) =>
                                prev.map((i) =>
                                  i.cartKey === item.cartKey
                                    ? { ...i, quantity: safeQty }
                                    : i,
                                ),
                              )
                              return
                            }
                            setSelectedItems((prev) =>
                              prev.map((i) =>
                                i.cartKey === item.cartKey
                                  ? { ...i, quantity: qty }
                                  : i,
                              ),
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='bg-primary/5 border-primary/10 mt-auto flex flex-col gap-2 rounded-lg border p-4'>
                <div className='text-default-600 flex items-center justify-between text-sm'>
                  <span>มูลค่าตลาดรวม:</span>
                  <span className='text-default-400 line-through'>
                    {formatCurrency(totals.retailTotal)}
                  </span>
                </div>
                <Divider className='my-1 opacity-50' />
                <div className='flex items-center justify-between text-lg font-bold'>
                  <span>ยอดสุทธิสัญญา:</span>
                  <span className='text-primary'>
                    {formatCurrency(totals.agreedTotal)}
                  </span>
                </div>
                <div className='text-success flex items-center justify-between text-sm font-bold'>
                  <span>ประมาณการกำไร (Margin):</span>
                  <span>{formatCurrency(totals.potentialProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className='border-default-100 flex items-center border-t p-4'>
          <Button variant='flat' onPress={onClose}>
            ยกเลิก
          </Button>
          <Button
            className='text-secondary flex-1 font-bold'
            color='primary'
            isDisabled={selectedItems.length === 0 || !selectedStorefrontId}
            isLoading={isCreating}
            size='lg'
            onPress={handleCreateContract}
          >
            สร้างสัญญาใหม่
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { ContractPOSModal }
