/* eslint-disable no-nested-ternary */

'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { AffiliateStatus } from '@prisma/client'
import { EyeIcon, EllipsisVerticalIcon } from 'lucide-react'

import type { GetAffiliatesResult } from '@/features/affiliate/affiliate.action'
import type { GetPendingPayoutsResult } from '@/features/affiliate-payout/payout.action'

import { IMAGE_FALLBACK } from '@/constants'
import { useAffiliateStore } from '@/features/affiliate/affiliate.store'
import { PayoutForm } from '@/features/affiliate-payout/ui/PayoutForm'
import { formatCurrency } from '@/utils'

type AffiliateItem = GetAffiliatesResult[number]

interface Props {
  affiliates: AffiliateItem[]
  pendingPayouts: GetPendingPayoutsResult | undefined
  isLoading: boolean
}

const AffiliateTable = ({ affiliates, pendingPayouts, isLoading }: Props) => {
  const openDetail = useAffiliateStore((state) => {
    return state.openDetail
  })

  return (
    <Table
      aria-label='Affiliate Management Table'
      checkboxesProps={{
        classNames: {
          wrapper: 'after:bg-primary before:border-default-300',
          icon: 'text-white font-bold',
        },
      }}
      selectionMode='multiple'
    >
      <TableHeader>
        <TableColumn>รหัสพาร์ทเนอร์</TableColumn>
        <TableColumn>พาร์ทเนอร์</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn>ยอดรอจ่าย (THB)</TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบข้อมูลพาร์ทเนอร์'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {affiliates.map((item) => {
          const pendingPayout = pendingPayouts?.find((p) => {
            return p.affiliateId === item.id
          })
          const amount = pendingPayout?._sum.commissionAmount || 0

          return (
            <TableRow key={item.id}>
              <TableCell>
                <span className='text-default-500 font-mono text-xs font-bold'>
                  #{item.id.slice(-8).toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                <User
                  avatarProps={{
                    src: item?.user?.image ?? IMAGE_FALLBACK.EMPTY,
                  }}
                  description={
                    <div className='flex flex-col gap-1'>
                      <span>{item?.user?.email}</span>
                      <span>{item?.phoneNumber}</span>
                    </div>
                  }
                  name={item?.user?.name ?? '-'}
                />
              </TableCell>
              <TableCell>
                <Chip
                  color={
                    item.status === AffiliateStatus.APPROVED
                      ? 'success'
                      : item.status === AffiliateStatus.PENDING
                        ? 'warning'
                        : 'danger'
                  }
                  size='sm'
                  variant='dot'
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell className='text-primary font-bold'>
                {formatCurrency(amount)}
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  {amount > 0 && item.status === AffiliateStatus.APPROVED && (
                    <PayoutForm affiliateId={item.id} pendingAmount={amount} />
                  )}
                  <Dropdown placement='bottom-end'>
                    <DropdownTrigger>
                      <Button isIconOnly size='sm' variant='light'>
                        <EllipsisVerticalIcon
                          className='text-default-500'
                          size={20}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='จัดการพาร์ทเนอร์' variant='flat'>
                      <DropdownItem
                        key='view'
                        startContent={<EyeIcon size={16} />}
                        onPress={() => {
                          return openDetail(item)
                        }}
                      >
                        ดูรายละเอียด
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
  )
}

export { AffiliateTable }
