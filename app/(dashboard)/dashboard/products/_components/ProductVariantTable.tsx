/* eslint-disable no-unused-vars */
'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { MoreVerticalIcon, Edit3Icon, Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { PRODUCT_UNIT_TH_LABELS } from '@/features/product/product.constant'
import { useProductVariants } from '@/features/product-variant/product-variant.hook'
import { useProductVariantUIStore } from '@/features/product-variant/product-variant.store'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency, formatNumber } from '@/utils'

interface Props {
  productId: string
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  onDelete: (id: string) => void
}

const ProductVariantTable = ({
  productId,
  selectedKeys,
  onSelectionChange,
  onDelete,
}: Props) => {
  const isMounted = useIsMounted()
  const { openForm } = useProductVariantUIStore()
  const { data: variants, isLoading } = useProductVariants(productId)

  const variantList = useMemo(() => variants || [], [variants])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Product Variant Table'
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
          <TableColumn>รหัสตัวเลือก</TableColumn>
          <TableColumn>ชื่อตัวเลือก</TableColumn>
          <TableColumn>ราคาปกติ</TableColumn>
          <TableColumn>ราคาลด</TableColumn>
          <TableColumn>คงเหลือ</TableColumn>
          <TableColumn align='center'>สถานะ</TableColumn>
          <TableColumn align='center' width={80}>
            จัดการ
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลตัวเลือกสำหรับสินค้านี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {variantList.map((variant) => {
            const isOutOfStock = variant.stockQuantity <= 0

            return (
              <TableRow key={variant.id}>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='text-default-400 font-mono text-[10px]'>
                      #{variant.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className='font-medium'>{variant.name}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      variant.salePrice
                        ? 'text-default-400 text-xs line-through'
                        : ''
                    }
                  >
                    {formatCurrency(variant.price)}
                  </span>
                </TableCell>
                <TableCell>
                  {variant.salePrice ? (
                    <span className='text-danger'>
                      {formatCurrency(variant.salePrice)}
                    </span>
                  ) : (
                    <span className='text-default-300'>-</span>
                  )}
                </TableCell>
                <TableCell className='text-small font-bold'>
                  <span
                    className={isOutOfStock ? 'text-danger' : 'text-success'}
                  >
                    {formatNumber(variant.stockQuantity)}{' '}
                    {PRODUCT_UNIT_TH_LABELS[variant?.product?.unit]}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={variant.isActive ? 'success' : 'danger'}
                    size='sm'
                    variant='dot'
                  >
                    {variant.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <MoreVerticalIcon
                          className='text-default-400'
                          size={20}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='จัดการตัวเลือก'>
                      <DropdownItem
                        key='edit'
                        startContent={<Edit3Icon size={16} />}
                        onPress={() => openForm(variant.id)}
                      >
                        แก้ไขข้อมูล
                      </DropdownItem>
                      <DropdownItem
                        key='delete'
                        className='text-danger'
                        color='danger'
                        startContent={<Trash2Icon size={16} />}
                        onPress={() => onDelete(variant.id)}
                      >
                        ลบตัวเลือก
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { ProductVariantTable }
