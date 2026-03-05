'use client'

import { AffiliateTable } from './_components/AffiliateTable'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useAffiliates } from '@/features/affiliate/affiliate.hook'
import { AffiliateDetailModal } from '@/features/affiliate/ui/AffiliateDetailModal'
import {
  useAffiliateSummary,
  usePendingPayouts,
} from '@/features/affiliate-payout/payout.hook'
import { useIsMounted } from '@/hooks/useIsMounted'

const AffiliateAdminPage = () => {
  const isMounted = useIsMounted()

  const { data: affiliates, isLoading: isAffiliateLoading } = useAffiliates()

  const {
    pendingAmount: totalPendingAmount,
    withdrawableAmount: totalWithdrawableAmount,
    paidAmount: totalPaidAmount,
    isLoading: isSummaryLoading,
  } = useAffiliateSummary()

  const { data: pendingPayouts, isLoading: isPayoutLoading } =
    usePendingPayouts()

  const isLoading = isAffiliateLoading || isPayoutLoading || isSummaryLoading

  if (!isMounted) {
    return null
  }

  return (
    <Container className='flex flex-col gap-8 py-8'>
      <section className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        <StatCard label='จำนวนพาร์ทเนอร์' value={affiliates?.length || 0} />
        <StatCard
          isCurrency
          label='ยอดรอคอนเฟิร์ม (THB)'
          value={totalPendingAmount}
        />
        <StatCard
          isCurrency
          label='ยอดค้างจ่าย/พร้อมถอน (THB)'
          value={totalWithdrawableAmount}
        />
        <StatCard
          isCurrency
          label='ยอดที่จ่ายแล้วทั้งหมด (THB)'
          value={totalPaidAmount}
        />
      </section>

      <section className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold'>รายชื่อพาร์ทเนอร์</h2>
        </div>
        <AffiliateTable
          affiliates={affiliates || []}
          isLoading={isLoading}
          pendingPayouts={pendingPayouts}
        />
      </section>

      <AffiliateDetailModal />
    </Container>
  )
}

export default AffiliateAdminPage
