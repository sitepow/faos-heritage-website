'use client'

import { Button } from '@heroui/button'
import {
  Avatar,
  AvatarGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  useDisclosure,
} from '@heroui/react'
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
  ArrowUpIcon,
  EditIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  LayoutIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'

import { ProductForm } from './_components/form/product'
import { ImageManager } from './_components/manager/image'
import { VariantManager } from './_components/manager/variant'
import { deleteProduct, getDashboard, getProducts } from './action/product'
import { useProductStore } from './store'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'
import { ModalDelete } from '@/components/modal/delete'
import { formatCurrency, formatNumber } from '@/utils/number'

const PAGE_LIMIT = 10

const Product = () => {
  const queryClient = useQueryClient()
  const {
    productId,
    setState,
    onOpenProductChange,
    onOpenImageManagerChange,
    onOpenVariantManagerChange,
  } = useProductStore()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedProductIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const { isOpen: isDeleteOpen, onOpenChange: onOpenDeleteChange } =
    useDisclosure()

  const { data: products } = useQuery({
    queryKey: ['dashboard', 'products', page, PAGE_LIMIT],
    queryFn: () => getProducts(page, PAGE_LIMIT),
  })

  const { data: dashboard } = useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: () => getDashboard(),
  })

  const { mutate: mutateDeteleProduct, isPending: isPendingDeteleProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'products'] })
        onOpenDeleteChange()
        setState({ productId: null })
        setSelectedKeys(new Set([]))
      },
    })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ModalDelete
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
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {dashboard?.map((data) => (
          <TrendCard key={data.name} {...data} />
        ))}
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
          startContent={<ArrowUpIcon className='text-default-500' />}
          variant='faded'
        >
          ส่งออกไฟล์ XLSX
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
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>ราคาหลัก</TableColumn>
          <TableColumn>สต็อคหลัก</TableColumn>
          <TableColumn>ตัวเลือกสินค้า</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>

        {products?.items?.length !== 0 ? (
          <TableBody>
            {(products?.items ?? []).map((product) => {
              const variants = product?.variants

              return (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <AvatarGroup max={3}>
                      <Avatar src='/placeholder.svg' />
                      <Avatar src='/placeholder.svg' />
                      <Avatar src='/placeholder.svg' />
                      <Avatar src='/placeholder.svg' />
                    </AvatarGroup>
                  </TableCell>
                  <TableCell className='min-w-60'>{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{formatNumber(product.stockQuantity)}</TableCell>
                  <TableCell className='min-w-60'>
                    <div className='flex flex-col'>
                      {variants?.length === 0 && <span>-</span>}

                      {variants?.length !== 0 &&
                        variants?.map((variant) => {
                          return (
                            <div key={variant.name} className='flex flex-col'>
                              <span className='line-clamp-1'>
                                {variant.name}
                              </span>
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
        ) : (
          <TableBody emptyContent='ไม่มีข้อมูลที่จะแสดง'>{[]}</TableBody>
        )}
      </Table>
      <Pagination
        showControls
        page={page}
        total={products?.totalPages ?? 1}
        onChange={(p) => setPage(p)}
      />
    </section>
  )
}

export default Product
