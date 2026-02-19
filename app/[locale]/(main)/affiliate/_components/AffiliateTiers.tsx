'use client'

import { useTranslations } from 'next-intl'

import type { CommissionTier } from './affiliate.types'

import { CommissionCard } from './CommissionCard'

import { AffiliateHeading } from '@/components/ui/AffiliateHeading'

const AffiliateTiers = () => {
  const t = useTranslations('affiliate.tiers')

  const tiers = t.raw('items') as CommissionTier[]

  return (
    <section className='mx-auto flex w-full flex-col gap-10'>
      <AffiliateHeading align='center' namespace='affiliate.tiers' />

      <div className='mx-auto grid w-full gap-10 lg:grid-cols-2'>
        {tiers.map((tier, idx) => (
          <CommissionCard key={idx} {...tier} />
        ))}
      </div>
    </section>
  )
}

export { AffiliateTiers }
