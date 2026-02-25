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
      <AffiliateHeading align='center' as='h2' namespace='affiliate.tiers' />

      <ul className='mx-auto grid w-full gap-10 lg:grid-cols-2'>
        {tiers.map((tier, idx) => (
          <li key={idx}>
            <CommissionCard {...tier} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { AffiliateTiers }
