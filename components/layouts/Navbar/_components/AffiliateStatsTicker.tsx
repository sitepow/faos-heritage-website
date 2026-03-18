'use client'

import { useAffiliateDashboard } from '@/features/affiliate/hook'
import { formatCurrency } from '@/utils'

const AffiliateStatsTicker = () => {
  const { data } = useAffiliateDashboard()

  return (
    <div className='bg-primary-50 text-primary hover:bg-primary-100 flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold transition-all'>
      <span>{formatCurrency(data?.totalEarnings || 0)}</span>
      <span className='opacity-30'>|</span>
      <span>{formatCurrency(data?.pendingAmount || 0)}</span>
    </div>
  )
}

export { AffiliateStatsTicker }
