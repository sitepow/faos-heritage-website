'use client'

import { Compass, Droplets, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { SpotlightCard } from '@/components/magicui/spotlight-card'
import { useGsapReveal } from '@/hooks/useGsap'

interface StepDef {
  icon: React.ReactNode
  key: 'step1' | 'step2' | 'step3'
  step: string
}

const stepDefs: StepDef[] = [
  {
    icon: <Compass className='size-5 text-amber-600 dark:text-amber-400' />,
    key: 'step1',
    step: '01',
  },
  {
    icon: (
      <Droplets className='size-5 text-emerald-600 dark:text-emerald-400' />
    ),
    key: 'step2',
    step: '02',
  },
  {
    icon: (
      <UtensilsCrossed className='size-5 text-amber-600 dark:text-amber-400' />
    ),
    key: 'step3',
    step: '03',
  },
]

export const HowItWorksSection = () => {
  const t = useTranslations('landing.howItWorks')
  const containerRef = useGsapReveal({ stagger: 0.12, y: 25 })

  return (
    <section
      ref={containerRef}
      className='relative w-full py-12 sm:py-16 md:py-20'
      id='how-it-works'
    >
      <div className='mx-auto max-w-5xl px-4 text-center sm:px-6'>
        {/* Shiny Badge */}
        <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
          <Sparkles className='size-3.5' />
          <AnimatedShinyText className='text-xs font-bold tracking-wide text-amber-900 dark:text-amber-200'>
            {t('tag')}
          </AnimatedShinyText>
        </div>

        {/* Title */}
        <h2 className='mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white'>
          {t('title')}
        </h2>

        {/* Description */}
        <p className='mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300'>
          {t('description')}
        </p>

        {/* 3 Step Cards */}
        <div className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6'>
          {stepDefs.map((item) => (
            <SpotlightCard
              key={item.step}
              className='gsap-reveal group relative flex flex-col justify-between border-neutral-200/80 bg-white/70 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg dark:border-white/10 dark:bg-neutral-900/60'
              spotlightColor='rgba(186, 140, 37, 0.12)'
            >
              <div>
                {/* Step header: Icon + Step number */}
                <div className='flex items-center justify-between'>
                  <div className='flex size-11 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20 dark:bg-amber-400/15'>
                    {item.icon}
                  </div>
                  <span className='font-mono text-2xl font-black text-neutral-300 transition-colors group-hover:text-amber-600 dark:text-neutral-700 dark:group-hover:text-amber-400'>
                    {item.step}
                  </span>
                </div>

                <div className='mt-5'>
                  <span className='rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'>
                    {t(`steps.${item.key}.tag`)}
                  </span>
                  <h3 className='mt-2 text-base font-bold text-neutral-900 sm:text-lg dark:text-white'>
                    {t(`steps.${item.key}.title`)}
                  </h3>
                  <p className='mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-300'>
                    {t(`steps.${item.key}.description`)}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
