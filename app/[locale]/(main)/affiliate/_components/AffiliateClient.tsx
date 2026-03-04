'use client'

import { Spinner } from '@heroui/react'
import { AffiliateStatus } from '@prisma/client'

import { AffiliateLanding } from './AffiliateLanding'
import { AffiliateWaitingStatus } from './AffiliateWaitingStatus'

import { useAffiliateProfile } from '@/features/affiliate/affiliate.hook'

const AffiliateClient = () => {
  const { data: profile, isLoading } = useAffiliateProfile()

  if (isLoading) {
    return (
      <div className='bg-faos-dark flex min-h-screen items-center justify-center'>
        <Spinner
          classNames={{ label: 'text-white' }}
          label='กำลังตรวจสอบสถานะ...'
        />
      </div>
    )
  }

  if (!profile || profile.status === AffiliateStatus.REJECTED) {
    return <AffiliateLanding />
  }

  if (profile.status === AffiliateStatus.PENDING) {
    return <AffiliateWaitingStatus />
  }

  if (profile.status === AffiliateStatus.APPROVED) {
    return <div />
  }

  return null
}

export { AffiliateClient }
