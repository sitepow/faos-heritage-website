'use client'

import { Button } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

import { AffiliateCTA } from './AffiliateCTA'
import { AffiliateHero } from './AffiliateHero'
import { AffiliateRewards } from './AffiliateRewards'
import { AffiliateSteps } from './AffiliateSteps'
import { AffiliateTiers } from './AffiliateTiers'

import { AffiliateRegistrationForm } from '@/features/affiliate/ui/AffiliateRegistrationForm'

const AffiliateLanding = () => {
  const [showForm, setShowForm] = useState(false)

  const handleShowForm = () => {
    return setShowForm(true)
  }

  if (showForm) {
    return (
      <div className='flex flex-col items-center justify-center gap-5'>
        <AffiliateRegistrationForm />

        <Button
          startContent={<ArrowLeft />}
          variant='light'
          onPress={() => {
            return setShowForm(false)
          }}
        >
          ย้อนกลับ
        </Button>
      </div>
    )
  }

  return (
    <main className='bg-faos-dark flex flex-col gap-10 antialiased'>
      <AffiliateHero onRegisterClick={handleShowForm} />
      <div className='mx-auto flex max-w-6xl flex-col gap-10 p-5'>
        <AffiliateSteps />
        <AffiliateRewards />
        <AffiliateTiers />
        <AffiliateCTA onRegisterClick={handleShowForm} />
      </div>
    </main>
  )
}

export { AffiliateLanding }
