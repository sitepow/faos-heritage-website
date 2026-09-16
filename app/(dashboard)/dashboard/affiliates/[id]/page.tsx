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
  Accordion,
  AccordionItem,
  Spinner,
  Tabs,
  Tab,
} from '@heroui/react'
import { PayoutStatus } from '@prisma/client'
import { ChevronLeftIcon, PackageIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { GetAffiliateCommissionsResult } from '@/features/affiliate-payout/action'
import type { Selection } from '@heroui/react'

import { AffiliatePayoutTable } from '../_components/AffiliatePayoutTable'

import { Container } from '@/components/layouts/Container'
import { useAffiliateById } from '@/features/affiliate/hook'
import {
  useAffiliateCommissions,
  useAffiliatePayouts,
} from '@/features/affiliate-payout/hook'
import { PayoutForm } from '@/features/affiliate-payout/ui/PayoutForm'
import { calculateCommissionByStatus } from '@/features/affiliate-payout/util'
import { useTranslateStatus } from '@/hooks/useTranslateStatus'
import { formatCurrency, formatDate } from '@/utils'

const AffiliateHistoryPage = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { getPayoutStatusProps } = useTranslateStatus()

  const { data: profile, isLoading: isProfileLoading } = useAffiliateById(id)
  const { data: commissions, isLoading: isCommissionsLoading } =
    useAffiliateCommissions(id)
  const { data: payouts, isLoading: isPayoutsLoading } = useAffiliatePayouts(id)

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))

  const isLoading = isProfileLoading || isCommissionsLoading

  const selectedAmount = useMemo(() => {
    if (!commissions) {
      return 0
    }

    if (selectedKeys === 'all') {
      return calculateCommissionByStatus(commissions, PayoutStatus.COMPLETED)
    }

    const selectedIds = Array.from(selectedKeys)
    const selectedItems = commissions.filter((c) => {
      return selectedIds.includes(c.id)
    })

    return calculateCommissionByStatus(selectedItems, PayoutStatus.COMPLETED)
  }, [selectedKeys, commissions])

  const disabledKeys = useMemo(() => {
    if (!commissions) {
      return new Set([])
    }
    const nonWithdrawableIds = commissions
      .filter((c) => {
        return c.status !== PayoutStatus.COMPLETED
      })
      .map((c) => {
        return c.id
      })
    return new Set(nonWithdrawableIds)
  }, [commissions])

  return (
    <Container className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            className='hover:bg-default-100 flex h-8 w-8 items-center justify-center rounded-full transition-colors'
            onClick={() => {
              return router.push('/dashboard/affiliates')
            }}
          >
            <ChevronLeftIcon size={18} />
          </button>

          <div className='flex flex-col gap-1'>
            <h1 className='text-2xl font-bold'>ประวัติค่าคอมมิชชัน</h1>
            <span>บัญชี: {profile?.user?.name ?? '-'}</span>
            <p className='text-default-500 text-sm'>
              เลือกรายการที่จัดส่งสำเร็จเพื่อดำเนินการจ่ายเงินให้พาร์ทเนอร์
            </p>
          </div>
        </div>

        {selectedAmount > 0 && (
          <PayoutForm
            affiliateId={id}
            pendingAmount={selectedAmount}
            selectedIds={
              selectedKeys === 'all'
                ? (commissions ?? [])
                    .filter((c) => {
                      return c.status === PayoutStatus.COMPLETED
                    })
                    .map((c) => {
                      return c.id
                    })
                : (Array.from(selectedKeys) as string[])
            }
          />
        )}
      </div>

      <Tabs
        aria-label='Affiliate History Options'
        classNames={{
          tabList: 'gap-6',
          cursor: 'w-full bg-primary',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-primary font-bold',
        }}
        color='primary'
        variant='underlined'
      >
        <Tab key='commissions' title='ยอดค่าคอมมิชชันรอจ่าย'>
          <Table
            aria-label='Commission History'
            checkboxesProps={{
              classNames: {
                wrapper: 'after:bg-primary before:border-default-100',
                icon: 'text-white font-bold',
              },
            }}
            disabledKeys={disabledKeys}
            selectedKeys={selectedKeys}
            selectionMode='multiple'
            onSelectionChange={setSelectedKeys}
          >
            <TableHeader>
              <TableColumn>รหัสรายการ</TableColumn>
              <TableColumn>วันที่</TableColumn>
              <TableColumn width={250}>รายการสินค้า / ออเดอร์</TableColumn>
              <TableColumn>ยอดขาย (THB)</TableColumn>
              <TableColumn>ค่าตอบแทน (THB)</TableColumn>
              <TableColumn align='center'>สถานะ</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent='ไม่พบรายการ'
              isLoading={isLoading}
              loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
            >
              {(commissions ?? []).map(
                (item: GetAffiliateCommissionsResult[number]) => {
                  const statusProps = getPayoutStatusProps(item.status)

                  return (
                    <TableRow
                      key={item.id}
                      className={
                        item.status !== PayoutStatus.COMPLETED
                          ? 'opacity-50'
                          : ''
                      }
                    >
                      <TableCell>
                        <span className='text-default-500 text-xs font-bold'>
                          #{item.id.slice(-8).toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className='max-w-64 min-w-64'>
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell className='max-w-64 min-w-64'>
                        <Accordion isCompact className='px-0' variant='light'>
                          <AccordionItem
                            key='1'
                            aria-label='View Items'
                            startContent={
                              <PackageIcon
                                className='text-default-400'
                                size={14}
                              />
                            }
                            title={
                              <span className='text-tiny font-bold'>
                                #{item.orderId.slice(-8).toUpperCase()}
                              </span>
                            }
                          >
                            <div className='flex flex-col gap-2 pb-2'>
                              {item.order?.items?.map(
                                (orderItem, idx: number) => {
                                  return (
                                    <div
                                      key={idx}
                                      className='border-default-100 text-default-500 flex justify-between border-b pb-1 text-[10px]'
                                    >
                                      <span className='flex-1'>
                                        {orderItem.productName}{' '}
                                        {orderItem.variantName &&
                                          `(${orderItem.variantName})`}
                                      </span>
                                      <span className='ml-2 font-bold'>
                                        x{orderItem.quantity}
                                      </span>
                                    </div>
                                  )
                                },
                              )}
                            </div>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                      <TableCell>{formatCurrency(item.orderAmount)}</TableCell>
                      <TableCell className='text-success font-bold'>
                        {formatCurrency(item.commissionAmount)}
                      </TableCell>
                      <TableCell>
                        <Chip color={statusProps.color} size='sm' variant='dot'>
                          {statusProps.label}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  )
                },
              )}
            </TableBody>
          </Table>
        </Tab>

        <Tab key='payouts' title='ประวัติการโอนเงินแล้ว'>
          <AffiliatePayoutTable
            isLoading={isPayoutsLoading}
            payouts={payouts ?? []}
          />
        </Tab>
      </Tabs>
    </Container>
  )
}

export default AffiliateHistoryPage
