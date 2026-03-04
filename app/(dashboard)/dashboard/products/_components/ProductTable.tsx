/* eslint-disable no-unused-vars */
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from '@heroui/react'
import {
  EditIcon,
  EllipsisVerticalIcon,
  ImageIcon,
  LayoutIcon,
  LanguagesIcon,
  TrashIcon,
  FileTextIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { CategoryChip } from '@/components/ui/CategoryChip'
import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { useProductsAdmin } from '@/features/product/product.hook'
import { useProductUIStore } from '@/features/product/product.store'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency, formatNumber, resolveProductImages } from '@/utils'

interface Props {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  page: number
  onPageChange: (page: number) => void
  onDeleteClick: (id: string) => void
}

const ProductTable = ({
  selectedKeys,
  onSelectionChange,
  page,
  onPageChange,
  onDeleteClick,
}: Props) => {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { openForm } = useProductUIStore()

  const { data, isLoading } = useProductsAdmin(page, 50)

  const productList = useMemo(() => {
    return data && 'items' in data ? data.items : []
  }, [data])

  const totalPages = useMemo(() => {
    return data && 'totalPages' in data ? data.totalPages : 1
  }, [data])

  const getActionItems = (productId: string) => [
    {
      key: 'edit',
      label: 'แก้ไขข้อมูลพื้นฐาน',
      icon: <EditIcon size={16} />,
      onClick: () => openForm(productId),
    },
    {
      key: 'description',
      label: 'แก้ไขรายละเอียดเนื้อหา',
      icon: <FileTextIcon size={16} />,
      onClick: () =>
        router.push(`/dashboard/products/${productId}/description`),
    },
    {
      key: 'images',
      label: 'จัดการรูปภาพ',
      icon: <ImageIcon size={16} />,
      onClick: () => router.push(`/dashboard/products/${productId}/images`),
    },
    {
      key: 'variants',
      label: 'จัดการตัวเลือก (Variants)',
      icon: <LayoutIcon size={16} />,
      onClick: () => router.push(`/dashboard/products/${productId}/variants`),
    },
    {
      key: 'locale',
      label: 'จัดการภาษา (Translation)',
      icon: <LanguagesIcon size={16} />,
      onClick: () =>
        router.push(`/dashboard/products/${productId}/localization`),
    },
    {
      key: 'delete',
      label: 'ลบสินค้า',
      icon: <TrashIcon size={16} />,
      isDanger: true,
      onClick: () => onDeleteClick(productId),
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Product Admin Table'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn>รหัสสินค้า</TableColumn>
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
            const actionItems = getActionItems(product.id)

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{product.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <ProductImage className='size-20' image={primarySrc} />
                </TableCell>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>
                  <CategoryChip
                    categoryName={product.category?.name || 'ไม่มีหมวดหมู่'}
                  />
                </TableCell>
                <TableCell>
                  <span>{formatCurrency(product.price)}</span>
                </TableCell>
                <TableCell>
                  <span>{formatNumber(product?.stockQuantity)}</span>
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
                      {actionItems.map((item) => (
                        <DropdownItem
                          key={item.key}
                          className={item.isDanger ? 'text-danger' : ''}
                          color={item.isDanger ? 'danger' : 'default'}
                          startContent={item.icon}
                          onPress={item.onClick}
                        >
                          {item.label}
                        </DropdownItem>
                      ))}
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
        total={totalPages}
        onChange={onPageChange}
      />
    </div>
  )
}

export { ProductTable }
