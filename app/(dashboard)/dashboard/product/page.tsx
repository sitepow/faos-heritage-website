'use client'

import { Avatar, AvatarGroup } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { useDisclosure } from '@heroui/modal'
import { Pagination } from '@heroui/pagination'
import { Spinner } from '@heroui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  EditIcon,
  EllipsisVerticalIcon,
  FileIcon,
  ImageIcon,
  LayoutIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'

import { ProductForm } from './_components/form/product'
import { CategoryManager } from './_components/manager/category'
import { ImageManager } from './_components/manager/image'
import { VariantManager } from './_components/manager/variant'
import {
  deleteProduct,
  getProducts,
  getProductDashboard,
} from './actions/product'
import { useProductStore } from './store'

import {
  TrendCard,
  TrendCardSkeleton,
} from '@/app/(dashboard)/_components/trend-card'
import { ModalConfirm } from '@/components/modal/confirm'
import {
  formatCurrency,
  formatCurrencyRange,
  formatNumber,
  formatNumberRange,
} from '@/utils/number'
import { getRangeDisplayValue } from '@/utils/range'

const ITEM_PER_PAGE = 10

const Product = () => {
  const queryClient = useQueryClient()
  const {
    productId,
    setState,
    onOpenCategoryManagerChange,
    onOpenProductChange,
    onOpenImageManagerChange,
    onOpenVariantManagerChange,
  } = useProductStore()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedProductIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const QUERY = {
    DASHBOARD: ['dashboard', 'products', 'card'],
    PRODUCTS: ['dashboard', 'products', 'pagination', page],
  }

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: QUERY.PRODUCTS,
    queryFn: () => getProducts(page, ITEM_PER_PAGE),
  })

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: QUERY.DASHBOARD,
    queryFn: () => getProductDashboard(),
  })

  const { mutate: mutateDeteleProduct, isPending: isPendingDeteleProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.DASHBOARD })
        onOpenDeleteChange()
        setState({ productId: null })
        setSelectedKeys(new Set([]))
      },
    })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ModalConfirm
        isOpen={isDeleteOpen}
        isPending={isPendingDeteleProduct}
        onConfirm={() => {
          mutateDeteleProduct(productId ? productId : selectedProductIds)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <ProductForm />
      <ImageManager />
      <VariantManager />
      <CategoryManager />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoadingDashboard &&
          [...Array(4)].map((_) => <TrendCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <TrendCard key={data.name} {...data} />)}
      </div>
      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          startContent={<PlusIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            onOpenProductChange()
          }}
        >
          เพิ่มสินค้าใหม่
        </Button>
        <Button
          startContent={<SettingsIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            onOpenCategoryManagerChange()
          }}
        >
          จัดการหมวดหมู่สินค้า
        </Button>
        <Button
          isDisabled={selectedProductIds.length === 0}
          startContent={<XIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            setState({ productId: null })
            onOpenDeleteChange()
          }}
        >
          ลบรายการที่เลือก ({selectedProductIds.length})
        </Button>
      </div>
      <Table
        aria-label='ตารางข้อมูลสินค้า'
        selectionMode='multiple'
        onSelectionChange={(keys) => {
          setSelectedKeys(keys as Set<string>)
        }}
      >
        <TableHeader>
          <TableColumn>รหัสสินค้า</TableColumn>
          <TableColumn>สินค้าดิจิทัล</TableColumn>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>ราคาหลัก</TableColumn>
          <TableColumn>สต็อคหลัก</TableColumn>
          <TableColumn>หมวดหมู่</TableColumn>
          <TableColumn>ตัวเลือกสินค้า</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent='ไม่มีข้อมูลที่จะแสดง'
          isLoading={isLoadingProducts}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {(products?.items ?? []).map((product) => {
            const price = getRangeDisplayValue(
              {
                min: product?.priceMin,
                max: product?.priceMax,
                fallback: product?.price,
              },
              {
                formatSingle: formatCurrency,
                formatRange: formatCurrencyRange,
              },
            )

            const stock = getRangeDisplayValue(
              {
                min: product?.stockMin,
                max: product?.stockMax,
                fallback: product?.stockQuantity,
              },
              {
                formatSingle: formatNumber,
                formatRange: formatNumberRange,
              },
            )

            return (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {product?.isDigitalProduct ? (
                    <Chip
                      startContent={
                        <FileIcon className='size-4 text-default-500' />
                      }
                      variant='faded'
                    >
                      สินค้าดิจิทัล
                    </Chip>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {product?.images?.length === 0 && <span>-</span>}

                  {product?.images?.length !== 0 && (
                    <AvatarGroup max={3}>
                      {product?.images?.map((image) => (
                        <Avatar key={image?.url} src={image?.url} />
                      ))}
                    </AvatarGroup>
                  )}
                </TableCell>
                <TableCell className='max-w-72 min-w-72'>
                  {product?.name ?? '-'}
                </TableCell>
                <TableCell className='max-w-32 min-w-32'>{price}</TableCell>
                <TableCell className='max-w-32 min-w-32'>{stock}</TableCell>
                <TableCell className='max-w-52 min-w-52'>
                  <Chip variant='bordered'>
                    {product?.category?.name ?? '-'}
                  </Chip>
                </TableCell>
                <TableCell className='min-w-60'>
                  <div className='flex flex-col'>
                    {product?.variants?.length === 0 && <span>-</span>}

                    {product?.variants?.length !== 0 &&
                      product?.variants?.map((variant) => {
                        return (
                          <div key={variant.name} className='flex flex-col'>
                            <span className='line-clamp-1'>{variant.name}</span>
                            <div className='flex gap-2'>
                              <span className='text-default-500'>
                                ราคา: {formatCurrency(variant.price)}
                              </span>
                              <span className='text-default-500'>
                                สต็อค: {formatNumber(variant.stockQuantity)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </TableCell>
                <TableCell className='flex gap-2.5'>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVerticalIcon className='size-5 text-default-500' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label='จัดการสินค้า'
                      className='min-w-[180px]'
                    >
                      <DropdownItem
                        key='edit'
                        startContent={<EditIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenProductChange()
                        }}
                      >
                        แก้ไขข้อมูล
                      </DropdownItem>
                      <DropdownItem
                        key='image'
                        startContent={<ImageIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenImageManagerChange()
                        }}
                      >
                        จัดการรูปภาพ
                      </DropdownItem>
                      <DropdownItem
                        key='variant'
                        startContent={<LayoutIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenVariantManagerChange()
                        }}
                      >
                        จัดการตัวเลือก
                      </DropdownItem>
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                        startContent={<TrashIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenDeleteChange()
                        }}
                      >
                        ลบสินค้า
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Pagination
        showControls
        page={page}
        total={products?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}

export default Product
