'use client'

import {
  useDisclosure,
  Table,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  Spinner,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  AvatarGroup,
  Avatar,
  Pagination,
} from '@heroui/react'
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

import { ProductForm } from './components/form/product'
import {
  CategoryManager,
  ImageManager,
  VariantManager,
} from './components/manager'
import { useProductStore } from './store'

import {
  StatCard,
  StatCardSkeleton,
} from '@/app/(dashboard)/components/stat-card'
import {
  deleteProduct,
  getProductStat,
  getProducts,
} from '@/app/(dashboard)/dashboard/product/action/product'
import { ConfirmModal } from '@/components/modal/confirm'
import { ITEM_PER_PAGE } from '@/utils/constants'
import {
  formatCurrency,
  formatCurrencyRange,
  formatNumber,
  formatNumberRange,
} from '@/utils/number'
import { getRangeDisplayValue } from '@/utils/range'

export default function Product() {
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
    queryFn: () => getProductStat(),
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
      <ConfirmModal
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
          [...Array(4)].map((_) => <StatCardSkeleton key={_} />)}

        {!isLoadingDashboard &&
          dashboard?.map((data) => <StatCard key={data.name} {...data} />)}
      </div>
      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          className='text-secondary'
          color='primary'
          startContent={<PlusIcon />}
          onPress={() => {
            onOpenProductChange()
          }}
        >
          Add new products
        </Button>
        <Button
          className='text-secondary'
          color='primary'
          startContent={<SettingsIcon />}
          onPress={() => {
            onOpenCategoryManagerChange()
          }}
        >
          Manage product categories
        </Button>
        <Button
          className='text-secondary'
          color='primary'
          isDisabled={selectedProductIds.length === 0}
          startContent={<XIcon />}
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
        checkboxesProps={{
          classNames: {
            base: 'data-[selected=true]:border-primary',
            icon: 'text-secondary',
          },
        }}
      >
        <TableHeader>
          <TableColumn>Product ID</TableColumn>
          <TableColumn>Digital Product</TableColumn>
          <TableColumn>Image</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Main Price</TableColumn>
          <TableColumn>Main Stock</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Actions</TableColumn>
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
                fallback: product?.price ?? 0,
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
                      color='primary'
                      startContent={
                        <FileIcon className='text-primary size-4' />
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
                <TableCell className='max-w-72'>
                  {product?.name ?? '-'}
                </TableCell>
                <TableCell className='max-w-32'>
                  {price !== formatCurrency(0) ? (
                    <Chip color='primary' variant='bordered'>
                      {price}
                    </Chip>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='max-w-32'>
                  {stock !== formatNumber(0) ? (
                    <Chip color='primary' variant='bordered'>
                      {stock}
                    </Chip>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='max-w-52'>
                  {product?.category?.name ? (
                    <Chip color='primary' variant='bordered'>
                      {product?.category?.name}
                    </Chip>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className='flex gap-2.5'>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVerticalIcon className='text-default-500 size-5' />
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
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Pagination
        showControls
        className='text-secondary'
        page={page}
        total={products?.totalPages || 1}
        onChange={(page) => setPage(page)}
      />
    </section>
  )
}
