'use client'

import { useTranslations } from 'next-intl'

import { AffiliateRemark } from './AffiliateRemark'
import { AffiliateRewardList } from './AffiliateRewardList'

import { AffiliateHeading } from '@/components/ui/AffiliateHeading'

const AffiliateRewards = () => {
  const t = useTranslations('affiliate.remarks')

  return (
    <section className='mx-auto flex w-full flex-col gap-10'>
      <div className='flex flex-col items-center justify-between gap-12 lg:flex-row'>
        <div className='lg:w-1/2'>
          <AffiliateHeading
            className='mb-10 lg:text-left'
            namespace='affiliate.rewards'
          />
          <AffiliateRewardList />
        </div>

        <div className='flex flex-col gap-5 lg:w-1/2'>
          <AffiliateRemark items={t.raw('docItems')} title={t('docTitle')} />
          <AffiliateRemark items={t.raw('generalItems')} />
        </div>
      </div>
    </section>
  )
}

export { AffiliateRewards }
