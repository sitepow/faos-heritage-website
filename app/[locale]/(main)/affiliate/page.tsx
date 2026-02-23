'use client'

import { AffiliateCTA } from './_components/AffiliateCTA'
import { AffiliateHero } from './_components/AffiliateHero'
import { AffiliateRewards } from './_components/AffiliateRewards'
import { AffiliateSteps } from './_components/AffiliateSteps'
import { AffiliateTiers } from './_components/AffiliateTiers'

const AffiliatePage = () => {
  return (
    <div className='bg-faos-dark flex flex-col gap-10 p-5 antialiased sm:p-0 sm:pb-5'>
      <AffiliateHero />
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        <AffiliateSteps />
        <AffiliateRewards />
        <AffiliateTiers />
        <AffiliateCTA />
      </div>
    </div>
  )
}

export default AffiliatePage
