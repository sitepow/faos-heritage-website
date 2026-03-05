/* eslint-disable react/no-array-index-key */
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
  Accordion,
  AccordionItem,
} from '@heroui/react'
import { PackageIcon } from 'lucide-react'

import type { AffiliateDashboardData } from '@/features/affiliate/affiliate.action'

import { useTranslateStatus } from '@/hooks/useTranslateStatus'
import { formatCurrency, formatDate } from '@/utils'

interface Props {
  commissions: AffiliateDashboardData['recentCommissions']
  isLoading: boolean
}

const AffiliateCommissionTable = ({ commissions, isLoading }: Props) => {
  const { getPayoutStatusProps } = useTranslateStatus()

  return (
    <Table aria-label='Commission History Table'>
      <TableHeader>
        <TableColumn>วันที่</TableColumn>
        <TableColumn width={250}>รายการสินค้า / ออเดอร์</TableColumn>
        <TableColumn>ยอดขาย (THB)</TableColumn>
        <TableColumn>เรทคอมมิชชัน</TableColumn>
        <TableColumn>ค่าตอบแทน (THB)</TableColumn>
        <TableColumn align='center'>สถานะ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ยังไม่มีรายการค่าคอมมิชชัน'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {commissions.map((item) => {
          const statusProps = getPayoutStatusProps(item.status)

          return (
            <TableRow key={item.id}>
              <TableCell className='min-w-32'>
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell>
                <Accordion isCompact className='px-0' variant='light'>
                  <AccordionItem
                    key='1'
                    aria-label='View Items'
                    startContent={
                      <PackageIcon className='text-default-400' size={14} />
                    }
                    title={
                      <span className='text-tiny font-mono font-bold'>
                        #{item.orderId.slice(-8).toUpperCase()}
                      </span>
                    }
                  >
                    <div className='flex flex-col gap-2 pb-2'>
                      {item.order?.items?.map((orderItem, idx: number) => {
                        return (
                          <div
                            key={idx}
                            className='text-default-500 border-default-50 flex justify-between border-b pb-1 text-[10px]'
                          >
                            <span className='line-clamp-1 flex-1'>
                              {orderItem.productName}{' '}
                              {orderItem.variantName &&
                                `(${orderItem.variantName})`}
                            </span>
                            <span className='ml-2 font-bold'>
                              x{orderItem.quantity}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell>{formatCurrency(Number(item.orderAmount))}</TableCell>
              <TableCell>{Number(item.appliedRate)}%</TableCell>
              <TableCell className='text-success font-bold'>
                {formatCurrency(Number(item.commissionAmount))}
              </TableCell>
              <TableCell>
                <Chip color={statusProps.color} size='sm' variant='dot'>
                  {statusProps.label}
                </Chip>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { AffiliateCommissionTable }
