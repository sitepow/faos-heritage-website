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

  const onRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY.DASHBOARD }),
      queryClient.invalidateQueries({ queryKey: QUERY.PRODUCTS }),
    ])
  }

  const { mutate: mutateDeteleProduct, isPending: isPendingDeteleProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        onRefetch()
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
          color='primary'
          startContent={<PlusIcon className='text-primary' />}
          variant='bordered'
          onPress={() => {
            onOpenProductChange()
          }}
        >
          Add new products
        </Button>
        <Button
          color='primary'
          startContent={<SettingsIcon className='text-primary' />}
          variant='bordered'
          onPress={() => {
            onOpenCategoryManagerChange()
          }}
        >
          Manage product categories
        </Button>
        <Button
          color='primary'
          isDisabled={selectedProductIds.length === 0}
          startContent={<XIcon className='text-primary' />}
          variant='bordered'
          onPress={() => {
            setState({ productId: null })
            onOpenDeleteChange()
          }}
        >
          Delete selected items ({selectedProductIds.length})
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
          <TableColumn>Actions</TableColumn>
          <TableColumn>Product ID</TableColumn>
          <TableColumn>Digital Product</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Main Price</TableColumn>
          <TableColumn>Main Stock</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Product Options</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent='There is no information to display'
          isLoading={isLoadingProducts}
          loadingContent={<Spinner label='Loading...' />}
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
                <TableCell className='flex gap-2.5'>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVerticalIcon className='size-5 text-default-500' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label='Manage products'
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
                        Edit information
                      </DropdownItem>
                      <DropdownItem
                        key='image'
                        startContent={<ImageIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenImageManagerChange()
                        }}
                      >
                        Manage images
                      </DropdownItem>
                      <DropdownItem
                        key='variant'
                        startContent={<LayoutIcon className='size-4' />}
                        onClick={() => {
                          setState({ productId: product?.id })
                          onOpenVariantManagerChange()
                        }}
                      >
                        Manage options
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
                        Remove product
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {product?.isDigitalProduct ? (
                    <Chip
                      color='primary'
                      startContent={
                        <FileIcon className='size-4 text-primary' />
                      }
                      variant='bordered'
                    >
                      Digital product
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
                  {product?.category?.name ? (
                    <Chip color='primary' variant='bordered'>
                      {product?.category?.name}
                    </Chip>
                  ) : (
                    '-'
                  )}
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
                                Price: {formatCurrency(variant.price)}
                              </span>
                              <span className='text-default-500'>
                                Stock: {formatNumber(variant.stockQuantity)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Pagination
        showControls
        className='text-white'
        page={page}
        total={products?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}

export default Product
