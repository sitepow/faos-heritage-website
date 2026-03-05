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
  Tooltip,
} from '@heroui/react'
import { AffiliateStatus, PayoutStatus } from '@prisma/client'
import {
  EyeIcon,
  EllipsisVerticalIcon,
  HistoryIcon,
  InfoIcon,
  CheckCircle2Icon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { GetAffiliatesResult } from '@/features/affiliate/affiliate.action'
import type { GetPendingPayoutsResult } from '@/features/affiliate-payout/payout.action'

import { IMAGE_FALLBACK } from '@/constants'
import { useAffiliateStore } from '@/features/affiliate/affiliate.store'
import { PayoutForm } from '@/features/affiliate-payout/ui/PayoutForm'
import { useTranslateStatus } from '@/hooks/useTranslateStatus'
import { formatCurrency } from '@/utils'

type AffiliateItem = GetAffiliatesResult[number]

interface Props {
  affiliates: AffiliateItem[]
  pendingPayouts: GetPendingPayoutsResult | undefined
  isLoading: boolean
}

const AffiliateTable = ({ affiliates, pendingPayouts, isLoading }: Props) => {
  const router = useRouter()
  const { getAffiliateStatusProps } = useTranslateStatus()
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
        <TableColumn>รหัสแอฟิลิเอต</TableColumn>
        <TableColumn>พาร์ทเนอร์</TableColumn>
        <TableColumn>สถานะ</TableColumn>
        <TableColumn>
          <div className='flex items-center gap-1'>
            รอคอนเฟิร์ม
            <Tooltip content='ยอดจากออเดอร์ที่ยังจัดส่งไม่สำเร็จ'>
              <InfoIcon className='text-default-400' size={12} />
            </Tooltip>
          </div>
        </TableColumn>
        <TableColumn>
          <div className='flex items-center gap-1'>
            ถอนได้แล้ว
            <Tooltip content='ยอดจากออเดอร์ที่จัดส่งสำเร็จและพร้อมจ่ายเงิน'>
              <InfoIcon className='text-default-400' size={12} />
            </Tooltip>
          </div>
        </TableColumn>
        <TableColumn>
          <div className='flex items-center gap-1'>
            ถอนแล้ว
            <Tooltip content='ยอดรวมที่โอนเงินให้พาร์ทเนอร์สำเร็จแล้ว'>
              <CheckCircle2Icon size={12} />
            </Tooltip>
          </div>
        </TableColumn>
        <TableColumn align='center'>จัดการ</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent='ไม่พบข้อมูลพาร์ทเนอร์'
        isLoading={isLoading}
        loadingContent={<Spinner label='กำลังโหลดข้อมูล...' />}
      >
        {affiliates.map((item) => {
          const partnerSummary = pendingPayouts?.filter((p) => {
            return p.affiliateId === item.id
          })

          const pendingAmount =
            partnerSummary?.find((s) => {
              return s.status === PayoutStatus.PENDING
            })?._sum.commissionAmount || 0

          const withdrawableAmount =
            partnerSummary?.find((s) => {
              return s.status === PayoutStatus.COMPLETED
            })?._sum.commissionAmount || 0

          const paidAmount =
            partnerSummary?.find((s) => {
              return s.status === PayoutStatus.PAID
            })?._sum.commissionAmount || 0

          const statusProps = getAffiliateStatusProps(item.status)

          return (
            <TableRow key={item.id}>
              <TableCell>
                <span className='text-default-500 font-mono text-xs font-bold'>
                  #{item.id.slice(-8).toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                <span className='text-default-500 font-mono text-xs font-bold'>
                  #{item?.affiliateCode?.toUpperCase() || '-'}
                </span>
              </TableCell>
              <TableCell>
                <User
                  avatarProps={{
                    src: item?.user?.image ?? IMAGE_FALLBACK.EMPTY,
                  }}
                  description={item?.user?.email}
                  name={item?.user?.name ?? '-'}
                />
              </TableCell>
              <TableCell>
                <Chip color={statusProps.color} size='sm' variant='dot'>
                  {statusProps.label}
                </Chip>
              </TableCell>
              <TableCell className='text-default-500'>
                {formatCurrency(pendingAmount)}
              </TableCell>
              <TableCell className='text-primary font-bold'>
                {formatCurrency(withdrawableAmount)}
              </TableCell>
              <TableCell className='text-success font-bold'>
                {formatCurrency(paidAmount)}
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-center gap-2'>
                  {withdrawableAmount > 0 &&
                    item.status === AffiliateStatus.APPROVED && (
                      <PayoutForm
                        affiliateId={item.id}
                        pendingAmount={withdrawableAmount}
                      />
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
                        ดูข้อมูลสมัคร
                      </DropdownItem>
                      <DropdownItem
                        key='history'
                        startContent={<HistoryIcon size={16} />}
                        onPress={() => {
                          return router.push(`/dashboard/affiliates/${item.id}`)
                        }}
                      >
                        ประวัติยอดขาย/คอมมิชชัน
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
