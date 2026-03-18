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
import { EllipsisVerticalIcon, HistoryIcon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import type { ProductWithPayload } from '@/features/product/action'
import type { Selection } from '@heroui/react'

import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { PRODUCT_UNIT_TH_LABELS } from '@/features/product/constant'
import { useStockStore } from '@/features/stock/store'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatNumber, resolveProductImages } from '@/utils'

interface Props {
  productList: ProductWithPayload[]
  isLoading: boolean
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  page: number
  onPageChange: (page: number) => void
}

const InventoryTable = ({
  productList,
  isLoading,
  selectedKeys,
  onSelectionChange,
  page,
  onPageChange,
}: Props) => {
  const router = useRouter()
  const isMounted = useIsMounted()
  const { openAdjustment } = useStockStore()

  const validProducts = useMemo(() => {
    return (productList ?? []).filter(
      (item): item is NonNullable<ProductWithPayload> => {
        return !!item
      },
    )
  }, [productList])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table
        aria-label='Inventory Admin Table'
        checkboxesProps={{
          classNames: {
            wrapper: 'after:bg-primary before:border-default-300',
            icon: 'text-white font-bold',
          },
        }}
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        onSelectionChange={(keys) => {
          return onSelectionChange(keys)
        }}
      >
        <TableHeader>
          <TableColumn>รหัสสินค้า</TableColumn>
          <TableColumn>รูปภาพ</TableColumn>
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>จำนวนคงเหลือ</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn align='center'>จัดการ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบข้อมูลสินค้า'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {validProducts.map((product) => {
            const { primarySrc } = resolveProductImages({
              images: product?.images,
            })
            const isOutOfStock = Number(product.stockQuantity) <= 0

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{product.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <ProductImage fill className='size-20' image={primarySrc} />
                </TableCell>
                <TableCell className='max-w-52 min-w-52 font-medium'>
                  {product.name}
                </TableCell>
                <TableCell className='text-small font-bold'>
                  <span
                    className={isOutOfStock ? 'text-danger' : 'text-success'}
                  >
                    {formatNumber(product.stockQuantity)}{' '}
                    {PRODUCT_UNIT_TH_LABELS[product?.unit]}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={isOutOfStock ? 'danger' : 'success'}
                    size='sm'
                    variant='dot'
                  >
                    {isOutOfStock ? 'สินค้าหมด' : 'ปกติ'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className='flex justify-center'>
                    <Dropdown placement='bottom-end'>
                      <DropdownTrigger>
                        <Button isIconOnly size='sm' variant='light'>
                          <EllipsisVerticalIcon
                            className='text-default-500'
                            size={20}
                          />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label='จัดการสต็อก' variant='flat'>
                        <DropdownItem
                          key='adjust'
                          startContent={<PlusIcon size={16} />}
                          onPress={() => {
                            return openAdjustment(product.id)
                          }}
                        >
                          เบิก/คืนสินค้า
                        </DropdownItem>
                        <DropdownItem
                          key='history'
                          startContent={<HistoryIcon size={16} />}
                          onPress={() => {
                            return router.push(
                              `/dashboard/inventory/${product.id}/stock-history`,
                            )
                          }}
                        >
                          ดูประวัติ Stock
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PaginationWrapper
        page={page}
        total={1}
        onChange={(p) => {
          return onPageChange(p)
        }}
      />
    </div>
  )
}

export { InventoryTable }
