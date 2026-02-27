'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import {
  EditIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  LayoutIcon,
  LanguagesIcon,
  TrashIcon,
  FileTextIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { StatItem } from '@/types/stat.types'

import {
  useProductsAdmin,
  useProductStat,
} from '../../../../../features/product/product.hook'
import { useProductMutation } from '../../../../../features/product/product.mutation'
import { useProductUIStore } from '../../../../../features/product/product.store'
import { ProductForm } from '../../../../../features/product/ui/ProductForm'

import { ConfirmDeleteModal } from '@/app/(dashboard)/_components/ConfirmDeleteModal'
import { CategoryChip } from '@/components/ui/CategoryChip'
import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { StatCard } from '@/components/ui/StatCard'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency, formatNumber, resolveProductImages } from '@/utils'

const ProductTable = () => {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { openForm } = useProductUIStore()
  const { remove, isDeleting } = useProductMutation()
  const [page, setPage] = useState(1)

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]))
  const selectedProductIds = Array.from(selectedKeys)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetDeleteId, setTargetDeleteId] = useState<
    string | string[] | null
  >(null)

  const { data, isLoading } = useProductsAdmin(page, 50)
  const { data: stats } = useProductStat()

  const productList = data && 'items' in data ? data.items : []
  const statsData: StatItem[] = Array.isArray(stats) ? stats : []

  const handleDeleteClick = (id: string | string[]) => {
    setTargetDeleteId(id)
    onOpen()
  }

  const handleConfirmDelete = async () => {
    if (targetDeleteId) {
      await remove(targetDeleteId)
      onOpenChange()
      setTargetDeleteId(null)
      setSelectedKeys(new Set([]))
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {statsData?.map((stat) => (
          <StatCard key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>

      <div className='flex w-full flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-bold'>จัดการสินค้า</h1>
        <div className='flex flex-wrap gap-2'>
          <Button
            color='danger'
            isDisabled={selectedProductIds.length === 0}
            startContent={<TrashIcon size={18} />}
            variant='flat'
            onPress={() => handleDeleteClick(selectedProductIds)}
          >
            ลบที่เลือก ({selectedProductIds.length})
          </Button>
          <Button
            className='text-secondary'
            color='primary'
            startContent={<PlusIcon size={18} />}
            onPress={() => openForm()}
          >
            เพิ่มสินค้าใหม่
          </Button>
        </div>
      </div>

      <Table
        aria-label='Product Admin Table'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        className='border-default-100 rounded-lg border'
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
      >
        <TableHeader>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อสินค้า (ต้นฉบับ)</TableColumn>
          <TableColumn>หมวดหมู่</TableColumn>
          <TableColumn>ราคา</TableColumn>
          <TableColumn>คงเหลือ</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบข้อมูลสินค้า'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {productList.map((product) => {
            const { primarySrc } = resolveProductImages({
              images: product?.images,
            })

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImage image={primarySrc} />
                </TableCell>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>
                  <CategoryChip
                    categoryName={product.category?.name || 'ไม่มีหมวดหมู่'}
                  />
                </TableCell>
                <TableCell>
                  <b className='font-bold'>{formatCurrency(product.price)}</b>
                </TableCell>
                <TableCell>
                  <b className='font-bold'>
                    {formatNumber(product?.stockQuantity)}
                  </b>
                </TableCell>
                <TableCell>
                  <Chip
                    color={product.isActive ? 'success' : 'danger'}
                    size='sm'
                    variant='dot'
                  >
                    {product.isActive ? 'แสดงสินค้าอยู่' : 'ซ่อนสินค้า'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVerticalIcon
                          className='text-default-500'
                          size={20}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='จัดการสินค้า' variant='flat'>
                      <DropdownItem
                        key='edit'
                        startContent={<EditIcon size={16} />}
                        onPress={() => openForm(product.id)}
                      >
                        แก้ไขข้อมูลพื้นฐาน
                      </DropdownItem>
                      <DropdownItem
                        key='description'
                        startContent={<FileTextIcon size={16} />}
                        onPress={() =>
                          router.push(
                            `/dashboard/products/${product.id}/description`,
                          )
                        }
                      >
                        แก้ไขรายละเอียดเนื้อหา
                      </DropdownItem>
                      <DropdownItem
                        key='images'
                        startContent={<ImageIcon size={16} />}
                        onPress={() =>
                          router.push(
                            `/dashboard/products/${product.id}/images`,
                          )
                        }
                      >
                        จัดการรูปภาพ
                      </DropdownItem>
                      <DropdownItem
                        key='variants'
                        startContent={<LayoutIcon size={16} />}
                        onPress={() =>
                          router.push(
                            `/dashboard/products/${product.id}/variants`,
                          )
                        }
                      >
                        จัดการตัวเลือก (Variants)
                      </DropdownItem>
                      <DropdownItem
                        key='locale'
                        startContent={<LanguagesIcon size={16} />}
                        onPress={() =>
                          router.push(
                            `/dashboard/products/${product.id}/localization`,
                          )
                        }
                      >
                        จัดการภาษา (Translation)
                      </DropdownItem>
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                        startContent={<TrashIcon size={16} />}
                        onPress={() => handleDeleteClick(product.id)}
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

      <PaginationWrapper
        page={page}
        total={data && 'totalPages' in data ? data.totalPages : 1}
        onChange={(p) => setPage(p)}
      />

      <ProductForm />

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </div>
  )
}

export { ProductTable }
