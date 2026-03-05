'use client'

import { AffiliateStatus, PayoutStatus } from '@prisma/client'

import commonTh from '@/messages/th/ui/common.json'

const useTranslateStatus = () => {
  const getPayoutStatusProps = (status: PayoutStatus) => {
    const label =
      commonTh.global.payoutStatus[
        status as keyof typeof commonTh.global.payoutStatus
      ] || status

    const colorMap: Record<
      PayoutStatus,
      'success' | 'warning' | 'danger' | 'default' | 'primary' | 'secondary'
    > = {
      [PayoutStatus.PAID]: 'success',
      [PayoutStatus.COMPLETED]: 'success',
      [PayoutStatus.PENDING]: 'warning',
      [PayoutStatus.REJECTED]: 'danger',
    }

    return {
      label,
      color: colorMap[status] || 'default',
    }
  }

  const getAffiliateStatusProps = (status: AffiliateStatus) => {
    const label =
      commonTh.global.affiliateStatus[
        status as keyof typeof commonTh.global.affiliateStatus
      ] || status

    const colorMap: Record<
      AffiliateStatus,
      'success' | 'warning' | 'danger' | 'default' | 'primary' | 'secondary'
    > = {
      [AffiliateStatus.APPROVED]: 'success',
      [AffiliateStatus.PENDING]: 'warning',
      [AffiliateStatus.REJECTED]: 'danger',
      [AffiliateStatus.SUSPENDED]: 'danger',
    }

    return {
      label,
      color: colorMap[status] || 'default',
    }
  }

  return { getPayoutStatusProps, getAffiliateStatusProps }
}

export { useTranslateStatus }
