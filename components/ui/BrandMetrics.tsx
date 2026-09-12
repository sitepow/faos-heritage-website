'use client'

import { Award, Droplets, HeartHandshake, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { NumberTicker } from '@/components/magicui/number-ticker'
import { SpotlightCard } from '@/components/magicui/spotlight-card'
import { useGsapReveal } from '@/hooks/useGsap'

interface MetricItem {
  value: number
  suffix: string
  key: 'organic' | 'acidity' | 'heritage' | 'families'
  icon: React.ReactNode
  decimals?: number
}

const metrics: MetricItem[] = [
  {
    value: 100,
    suffix: '%',
    key: 'organic',
    icon: <Sparkles className='text-amber-500' size={22} />,
  },
  {
    value: 0.2,
    suffix: '%',
    decimals: 1,
    key: 'acidity',
    icon: <Droplets className='text-amber-500' size={22} />,
  },
  {
    value: 25,
    suffix: '+',
    key: 'heritage',
    icon: <Award className='text-amber-500' size={22} />,
  },
  {
    value: 15000,
    suffix: '+',
    key: 'families',
    icon: <HeartHandshake className='text-amber-500' size={22} />,
  },
]

export const BrandMetrics = () => {
  const t = useTranslations('landing.metrics')
  const containerRef = useGsapReveal({ y: 25, stagger: 0.12 })

  return (
    <section ref={containerRef} className='w-full py-6'>
      <div className='grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-5'>
        {metrics.map((metric) => (
          <SpotlightCard
            key={metric.key}
            className='gsap-reveal group relative flex flex-col justify-between border-neutral-200/70 bg-gradient-to-b from-white/90 to-white/40 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 sm:p-6 dark:border-white/10 dark:from-neutral-900/90 dark:to-neutral-900/40'
            spotlightColor='rgba(186, 140, 37, 0.12)'
          >
            <div className='flex items-center justify-between pb-3'>
              <div className='flex size-10 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20 dark:bg-amber-400/15'>
                {metric.icon}
              </div>
              <span className='rounded-full border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300'>
                {t('verified')}
              </span>
            </div>

            <div>
              <div className='flex items-baseline gap-1 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl dark:text-white'>
                <NumberTicker
                  decimalPlaces={metric.decimals || 0}
                  value={metric.value}
                />
                <span className='text-amber-600 dark:text-amber-400'>
                  {metric.suffix}
                </span>
              </div>
              <h4 className='mt-1 text-sm font-semibold tracking-tight text-neutral-800 sm:text-base dark:text-neutral-200'>
                {t(`items.${metric.key}.label`)}
              </h4>
              <p className='mt-1 text-xs leading-relaxed text-neutral-500 sm:text-sm dark:text-neutral-400'>
                {t(`items.${metric.key}.description`)}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
