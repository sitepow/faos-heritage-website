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
  User,
} from '@heroui/react'
import { useMemo } from 'react'

import type { StockHistoryListItem } from '@/features/stock-history/stock-history.action'

import { PaginationWrapper } from '@/components/ui/PaginationWrapper'
import { IMAGE_FALLBACK } from '@/constants'
import { PRODUCT_UNIT_TH_LABELS } from '@/features/product/product.constant'
import { STOCK_MOVEMENT_LABELS } from '@/features/stock-history/stock-history.constant'
import { useStockHistory } from '@/features/stock-history/stock-history.hook'
import { useIsMounted } from '@/hooks/useIsMounted'
import { formatDate, formatNumber } from '@/utils'

interface Props {
  productId: string
  page: number
  onPageChange: (page: number) => void
}

const StockHistoryTable = ({ productId, page, onPageChange }: Props) => {
  const isMounted = useIsMounted()

  const { data: result, isLoading } = useStockHistory(productId, page)

  const historyList = useMemo(() => {
    return result?.success ? (result.data.items as StockHistoryListItem[]) : []
  }, [result])

  const totalPages = useMemo(() => {
    return result?.success ? (result.data.totalPages as number) : 1
  }, [result])

  const validHistory = useMemo(() => {
    return (historyList ?? []).filter(
      (item): item is NonNullable<StockHistoryListItem> => {
        return !!item
      },
    )
  }, [historyList])

  if (!isMounted) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <Table aria-label='Stock history movements table'>
        <TableHeader>
          <TableColumn>รหัสประวัติ</TableColumn>
          <TableColumn>วันที่ทำรายการ</TableColumn>
          <TableColumn>ผู้ทำรายการ</TableColumn>
          <TableColumn>เป้าหมาย</TableColumn>
          <TableColumn>ประเภท</TableColumn>
          <TableColumn>จำนวน</TableColumn>
          <TableColumn>สถานที่ / หมายเหตุ</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent='ไม่พบประวัติความเคลื่อนไหว'
          isLoading={isLoading}
          loadingContent={<Spinner label='กำลังโหลด...' />}
        >
          {validHistory.map((log) => {
            const isIncrement = log.quantity > 0
            const isProductLevel = !!log.productId && !log.variantId

            const rawUnit = log.product?.unit || log.variant?.product?.unit
            const unitLabel = rawUnit ? PRODUCT_UNIT_TH_LABELS[rawUnit] : ''

            return (
              <TableRow key={log.id}>
                <TableCell>
                  <span className='text-default-500 font-mono text-xs font-bold'>
                    #{log.id.slice(-8).toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className='text-tiny max-w-64 min-w-64'>
                  {formatDate(log.createdAt)}
                </TableCell>
                <TableCell className='max-w-64 min-w-64'>
                  <User
                    avatarProps={{
                      className: 'shrink-0',
                      src: log?.user?.image ?? IMAGE_FALLBACK.EMPTY,
                    }}
                    className='text-left'
                    name={log.user?.name || 'ระบบ'}
                  />
                </TableCell>
                <TableCell className='max-w-32 min-w-32'>
                  <div className='flex flex-col gap-1'>
                    <Chip size='sm' variant='dot'>
                      {isProductLevel ? 'สินค้าหลัก' : 'ตัวเลือกสินค้า'}
                    </Chip>
                    <span className='text-tiny text-default-600 font-bold'>
                      {isProductLevel ? log.product?.name : log.variant?.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    color={isIncrement ? 'success' : 'danger'}
                    size='sm'
                    variant='dot'
                  >
                    {STOCK_MOVEMENT_LABELS[log.type]}
                  </Chip>
                </TableCell>
                <TableCell className='text-small max-w-48 min-w-48 font-bold'>
                  <span
                    className={isIncrement ? 'text-success' : 'text-danger'}
                  >
                    {isIncrement ? '+' : ''}
                    {formatNumber(log.quantity)} {unitLabel}
                  </span>
                </TableCell>
                <TableCell className='text-tiny text-default-500 max-w-64 min-w-64'>
                  <div className='flex flex-col'>
                    <span className='text-default-700 font-bold'>
                      {log.location || 'ทั่วไป'}
                    </span>
                    <span>{log.note || '-'}</span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PaginationWrapper
        page={page}
        total={totalPages}
        onChange={(p) => {
          return onPageChange(p)
        }}
      />
    </div>
  )
}

export { StockHistoryTable }
