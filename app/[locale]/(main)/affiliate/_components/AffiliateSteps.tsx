'use client'

import { useTranslations } from 'next-intl'

import type { StepItem } from './affiliate.types'

import { StepCard } from './StepCard'

import { cn } from '@/utils'

const AffiliateSteps = () => {
  const t = useTranslations('affiliate.steps')
  const steps = t.raw('items') as StepItem[]

  return (
    <section className='mx-auto w-full'>
      <div className='relative grid grid-cols-1 rounded-[2rem] bg-white py-10 md:grid-cols-2'>
        <div className='bg-default-100 absolute inset-y-0 left-1/2 hidden w-[1px] -translate-x-1/2 md:block' />
        <div className='bg-default-100 absolute inset-x-0 top-1/2 hidden h-[1px] -translate-y-1/2 md:block' />

        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={cn(
              'relative py-5',
              idx !== steps.length - 1 &&
                'border-default-100 border-b md:border-b-0',
            )}
          >
            <StepCard {...step} />
          </div>
        ))}
      </div>
    </section>
  )
}

export { AffiliateSteps }
