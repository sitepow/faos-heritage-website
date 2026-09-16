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
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Accordion,
  AccordionItem,
} from '@heroui/react'
import { EyeIcon, PackageIcon } from 'lucide-react'

import type { GetAffiliatePayoutsResult } from '@/features/affiliate-payout/action'

import { useTranslateStatus } from '@/hooks/useTranslateStatus'
import { formatCurrency, formatDate } from '@/utils'

interface Props {
  payouts: GetAffiliatePayoutsResult
  isLoading: boolean
}

const AffiliatePayoutTable = ({ payouts, isLoading }: Props) => {
  const { getPayoutStatusProps } = useTranslateStatus()

  return (
    <Table aria-label='Payout History Table'>
      <TableHeader>
        <TableColumn width={250}>รายการคอมมิชชันที่จ่าย</TableColumn>
        <TableColumn>วันที่โอน</TableColumn>
        <TableColumn>ยอดที่โอน (THB)</TableColumn>
        <TableColumn align='center'>หลักฐาน</TableColumn>
        <TableColumn>บันทึก</TableColumn>
        <TableColumn align='center'>สถานะ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ยังไม่มีประวัติการโอนเงิน'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {payouts.map((item) => {
          const statusProps = getPayoutStatusProps(item.status)

          return (
            <TableRow key={item.id}>
              <TableCell className='max-w-64 min-w-64'>
                <Accordion isCompact className='px-0' variant='light'>
                  <AccordionItem
                    key='1'
                    aria-label='View Commission Items'
                    startContent={
                      <div className='bg-default-100 flex h-6 w-6 items-center justify-center rounded-lg'>
                        <PackageIcon className='text-default-500' size={14} />
                      </div>
                    }
                    title={
                      <div className='flex items-center gap-2'>
                        <span className='text-tiny font-bold uppercase'>
                          #{item.id.slice(-8)}
                        </span>
                        <Chip
                          className='h-5 text-[10px] font-bold'
                          size='sm'
                          variant='dot'
                        >
                          {item.commissions?.length || 0} รายการ
                        </Chip>
                      </div>
                    }
                  >
                    <div className='flex flex-col gap-1 pb-2'>
                      <div className='border-default-100 mb-1 flex justify-between border-b px-1 pb-1'>
                        <span className='text-default-400 text-[9px] font-bold uppercase'>
                          ออเดอร์ / วันที่
                        </span>
                        <span className='text-default-400 text-right text-[9px] font-bold uppercase'>
                          คอมมิชชั่น
                        </span>
                      </div>

                      {item.commissions?.map((comm, idx: number) => {
                        return (
                          <div
                            key={idx}
                            className='hover:bg-default-50 flex items-center justify-between rounded-lg px-1 py-1.5 transition-colors'
                          >
                            <div className='flex flex-col gap-0.5'>
                              <span className='text-[10px] leading-none font-bold'>
                                #{comm.orderId.slice(-8).toUpperCase()}
                              </span>
                              <span className='text-default-400 text-[9px]'>
                                {formatDate(comm.createdAt)}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='text-success text-[11px] font-bold'>
                                {formatCurrency(comm.commissionAmount)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              <TableCell className='max-w-64 min-w-64'>
                {formatDate(item.createdAt)}
              </TableCell>
              <TableCell className='text-primary font-bold'>
                {formatCurrency(item.amount)}
              </TableCell>
              <TableCell>
                {item.payoutProofImage ? (
                  <Popover placement='top'>
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        color='primary'
                        size='sm'
                        variant='bordered'
                      >
                        <EyeIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Image
                        alt='Payout Proof'
                        className='max-w-[500px] object-contain'
                        src={item.payoutProofImage}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className='text-default-400 text-[10px]'>ไม่มีรูป</span>
                )}
              </TableCell>
              <TableCell className='text-tiny text-default-500 max-w-64 min-w-64 truncate'>
                {item.notes || '-'}
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

export { AffiliatePayoutTable }
