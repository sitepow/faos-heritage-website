'use client'

import { Button } from '@heroui/button'
import {
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
  ArrowUp,
  Edit,
  EllipsisVertical,
  ImageIcon,
  Layout,
  PlusIcon,
  Trash,
  XIcon,
} from 'lucide-react'
import { useState, type ComponentProps } from 'react'

import { ProductForm } from './_components/form/product'
import { ImageManager } from './_components/manager/image'
import { VariantManager } from './_components/manager/varient'
import { deleteProduct, getProducts } from './action'
import { useProductStore } from './store'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'
import { ModalDelete } from '@/components/modal/delete'
import { formatCurrency } from '@/utils/number'

const PAGE_LIMIT = 10
const MOCKUP_DASHBOARD_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'สินค้าทั้งหมด',
    value: 156,
  },
  {
    title: 'พร้อมขาย (ยังมีสินค้า)',
    value: 150,
  },
  {
    title: 'ไม่พร้อมขาย (สินค้าหมด)',
    value: 6,
  },
]

const Product = () => {
  const queryClient = useQueryClient()
  const { productId, setProductState } = useProductStore()

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedProductIds = Array.from(selectedKeys)
  const [page, setPage] = useState(1)

  const { data } = useQuery({
    queryKey: ['dashboard', 'products', page, PAGE_LIMIT],
    queryFn: () => getProducts(page, PAGE_LIMIT),
  })

  const { mutate: mutateDeteleProduct, isPending: isPendingDeteleProduct } =
    useMutation({
      mutationFn: deleteProduct,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'products'] })
        onOpenDeleteChange()
        setProductState({ productId: null })
        setSelectedKeys(new Set([]))
      },
    })

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure()

  const {
    isOpen: isProductOpen,
    onOpen: onProductOpen,
    onOpenChange: onOpenProductChange,
  } = useDisclosure()

  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onOpenChange: onOpenImageChange,
  } = useDisclosure()

  const {
    isOpen: isVarientOpen,
    onOpen: onVarientOpen,
    onOpenChange: onOpenVarientChange,
  } = useDisclosure()

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ModalDelete
        isConfirmPending={isPendingDeteleProduct}
        isOpen={isDeleteOpen}
        onConfirm={() => {
          mutateDeteleProduct(productId ? productId : selectedProductIds)
        }}
        onOpenChange={onOpenDeleteChange}
      />
      <ProductForm isOpen={isProductOpen} onOpenChange={onOpenProductChange} />
      <ImageManager isOpen={isImageOpen} onOpenChange={onOpenImageChange} />
      <VariantManager
        isOpen={isVarientOpen}
        onOpenChange={onOpenVarientChange}
      />
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {MOCKUP_DASHBOARD_CONST.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>
      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
        <Button
          startContent={<PlusIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            onProductOpen()
          }}
        >
          เพิ่มสินค้าใหม่
        </Button>
        <Button
          startContent={<ArrowUp className='text-default-500' />}
          variant='faded'
        >
          ส่งออกไฟล์ XLSX
        </Button>
        <Button
          isDisabled={selectedProductIds.length === 0}
          startContent={<XIcon className='text-default-500' />}
          variant='faded'
          onPress={() => {
            setProductState({ productId: null })
            onDeleteOpen()
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
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>ราคา (บาท)</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>

        {data?.items?.length !== 0 ? (
          <TableBody>
            {(data?.items ?? []).map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell className='flex gap-2.5'>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVertical className='size-5 text-default-500' />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label='จัดการสินค้า'
                      className='min-w-[180px]'
                    >
                      <DropdownItem
                        key='edit'
                        startContent={<Edit className='size-4' />}
                        onClick={() => {
                          setProductState({ productId: product?.id })
                          onProductOpen()
                        }}
                      >
                        แก้ไขข้อมูล
                      </DropdownItem>
                      <DropdownItem
                        key='image'
                        startContent={<ImageIcon className='size-4' />}
                        onClick={() => onImageOpen()}
                      >
                        จัดการรูปภาพ
                      </DropdownItem>
                      <DropdownItem
                        key='variant'
                        startContent={<Layout className='size-4' />}
                        onClick={() => onVarientOpen()}
                      >
                        จัดการตัวเลือก
                      </DropdownItem>
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                        startContent={<Trash className='size-4' />}
                        onClick={() => {
                          setProductState({ productId: product?.id })
                          onDeleteOpen()
                        }}
                      >
                        ลบสินค้า
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent='ไม่มีข้อมูลที่จะแสดง'>{[]}</TableBody>
        )}
      </Table>
      <Pagination
        showControls
        page={page}
        total={data?.totalPages ?? 1}
        onChange={(p) => setPage(p)}
      />
    </section>
  )
}

export default Product
