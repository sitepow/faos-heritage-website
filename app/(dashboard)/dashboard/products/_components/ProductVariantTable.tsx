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
} from '@heroui/react'
import { useMemo } from 'react'

import type { Selection } from '@heroui/react'

import { useProductVariants } from '@/features/product-variant/product-variant.hook'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatCurrency, formatNumber } from '@/utils'

interface Props {
  productId: string
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}

const ProductVariantTable = ({
  productId,
  selectedKeys,
  onSelectionChange,
}: Props) => {
  const isMounted = useIsMounted()
  const { data: variants, isLoading } = useProductVariants(productId)

  const variantList = useMemo(() => {
    return variants || []
  }, [variants])

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
          <TableColumn>ชื่อตัวเลือก</TableColumn>
          <TableColumn>ราคา</TableColumn>
          <TableColumn>คงเหลือ</TableColumn>
          <TableColumn align='center'>สถานะ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ยังไม่มีข้อมูลตัวเลือกสำหรับสินค้านี้'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
        >
          {variantList.map((variant) => (
            <TableRow key={variant.id}>
              <TableCell className='font-medium'>{variant.name}</TableCell>
              <TableCell>
                <b className='font-bold'>{formatCurrency(variant.price)}</b>
              </TableCell>
              <TableCell>
                <b className='font-bold'>
                  {formatNumber(variant.stockQuantity)}
                </b>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export { ProductVariantTable }
