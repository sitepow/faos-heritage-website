'use client'

import { Card, CardBody } from '@heroui/react'
import { WalletIcon } from 'lucide-react'

import { usePendingPayouts } from '../payout.hook'

import { formatCompactNumber } from '@/utils'

interface PayoutSummaryCardProps {
  startDate?: string
  endDate?: string
}

const PayoutSummaryCard = ({ startDate, endDate }: PayoutSummaryCardProps) => {
  const { data: pendingData } = usePendingPayouts({ startDate, endDate })

  const totalPending =
    pendingData?.reduce((acc, curr) => {
      return acc + (curr._sum.commissionAmount || 0)
    }, 0) || 0

  return (
    <Card className='bg-primary text-secondary border-none shadow-md'>
      <CardBody className='flex flex-row items-center gap-4 p-6'>
        <div className='rounded-2xl bg-white/20 p-3'>
          <WalletIcon size={32} />
        </div>
        <div className='flex flex-col'>
          <p className='text-sm font-medium opacity-80'>
            ยอดรอชำระเงินรวม (ทุกพาร์ทเนอร์)
          </p>
          <h3 className='text-2xl font-bold'>
            {formatCompactNumber(totalPending)}
          </h3>
        </div>
      </CardBody>
    </Card>
  )
}

export { PayoutSummaryCard }
