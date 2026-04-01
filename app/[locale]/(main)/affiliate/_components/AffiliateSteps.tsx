'use client'

import { useTranslations } from 'next-intl'

import type { StepItem } from './affiliate.types'

import { StepCard } from './StepCard'

import { AffiliateHeading } from '@/components/ui/AffiliateHeading'
import { cn } from '@/utils'

const AffiliateSteps = () => {
  const t = useTranslations('affiliate.steps')
  const steps = t.raw('items') as StepItem[]

  return (
    <section className='mx-auto w-full'>
      <AffiliateHeading
        align='center'
        as='h2'
        className='my-5'
        namespace='affiliate.steps'
      />

      <ul className='relative grid grid-cols-1 rounded-[2rem] bg-white py-10 md:grid-cols-2'>
        <div
          aria-hidden='true'
          className='absolute inset-y-0 left-1/2 hidden w-[1px] -translate-x-1/2 bg-gray-100 md:block'
        />
        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-1/2 hidden h-[1px] -translate-y-1/2 bg-gray-100 md:block'
        />

        {steps.map((step, idx) => (
          <li
            key={step.number}
            className={cn(
              'relative py-5',
              idx !== steps.length - 1 &&
                'border-b border-gray-100 md:border-b-0',
            )}
          >
            <StepCard {...step} number={String(idx + 1)} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { AffiliateSteps }
