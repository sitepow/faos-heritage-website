'use client'

import { Spinner } from '@heroui/react'
import { AffiliateStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'

import { AffiliateLanding } from './AffiliateLanding'
import { AffiliateWaitingStatus } from './AffiliateWaitingStatus'

import { useAffiliateProfile } from '@/features/affiliate/hook'
import { AffiliateDashboardView } from '@/features/affiliate/ui/AffiliateDashboardView'

const AffiliateClient = () => {
  const t = useTranslations('status')
  const { data: profile, isLoading } = useAffiliateProfile()

  if (isLoading) {
    return (
      <div className='bg-faos-dark flex min-h-screen items-center justify-center'>
        <Spinner
          classNames={{ label: 'text-white' }}
          label={`${t('loading')}...`}
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
    return <AffiliateDashboardView />
  }

  return null
}

export { AffiliateClient }
