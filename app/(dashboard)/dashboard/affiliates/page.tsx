'use client'

import { useMemo } from 'react'

import { AffiliateTable } from './_components/AffiliateTable'

import { Container } from '@/components/layouts/Container'
import { StatCard } from '@/components/ui/StatCard'
import { useAffiliates } from '@/features/affiliate/affiliate.hook'
import { AffiliateDetailModal } from '@/features/affiliate/ui/AffiliateDetailModal'
import { usePendingPayouts } from '@/features/affiliate-payout/payout.hook'
import { PayoutSummaryCard } from '@/features/affiliate-payout/ui/PayoutSummaryCard'
import { useIsMounted } from '@/hooks/useIsMounted'

const AffiliateAdminPage = () => {
  const isMounted = useIsMounted()

  const { data: affiliates, isLoading: isAffiliateLoading } = useAffiliates()
  const { data: pendingPayouts, isLoading: isPayoutLoading } =
    usePendingPayouts({})

  const isLoading = isAffiliateLoading || isPayoutLoading

  const totalPendingAmount = useMemo(() => {
    return (
      pendingPayouts?.reduce((acc, curr) => {
        return acc + (curr._sum.commissionAmount || 0)
      }, 0) || 0
    )
  }, [pendingPayouts])

  if (!isMounted) {
    return null
  }

  return (
    <Container className='flex flex-col gap-8'>
      <section className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <PayoutSummaryCard />
        <StatCard
          label='จำนวนพาร์ทเนอร์ทั้งหมด'
          value={affiliates?.length || 0}
        />
        <StatCard
          isCurrency
          label='ยอดค้างจ่ายรวม (THB)'
          value={totalPendingAmount}
        />
      </section>

      <section className='flex flex-col gap-4'>
        <h2 className='text-xl font-bold'>รายชื่อพาร์ทเนอร์</h2>
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
