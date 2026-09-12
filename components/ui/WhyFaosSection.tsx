/* eslint-disable react/no-array-index-key */
'use client'

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { SpotlightCard } from '@/components/magicui/spotlight-card'
import { useGsapReveal } from '@/hooks/useGsap'

export const WhyFaosSection = () => {
  const t = useTranslations('landing.whyFaos')
  const containerRef = useGsapReveal({ stagger: 0.15, y: 30 })

  const problems = t.raw('problem.items') as string[]
  const solutions = t.raw('solution.items') as string[]

  return (
    <section
      ref={containerRef}
      className='relative w-full py-12 sm:py-16 md:py-20'
      id='why-faos'
    >
      <div className='mx-auto max-w-5xl px-4 text-center sm:px-6'>
        {/* Shiny Tag */}
        <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
          <Sparkles className='size-3.5' />
          <AnimatedShinyText className='text-xs font-bold tracking-wide text-amber-900 dark:text-amber-200'>
            {t('tag')}
          </AnimatedShinyText>
        </div>

        {/* Section Title */}
        <h2 className='mt-3 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white'>
          {t('title')}
        </h2>

        {/* Section Description */}
        <p className='mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300'>
          {t('description')}
        </p>

        {/* Comparison Grid */}
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'>
          {/* Problem Card (Negative / Warning) */}
          <div className='gsap-reveal flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-rose-50/30 p-6 text-left shadow-xs backdrop-blur-md sm:p-8 dark:border-rose-900/30 dark:bg-rose-950/10'>
            <div>
              <div className='flex items-center gap-2 text-xs font-bold text-rose-600 uppercase dark:text-rose-400'>
                <AlertTriangle className='size-4' />
                <span>{t('problem.tag')}</span>
              </div>

              <h3 className='mt-2.5 text-lg font-bold text-neutral-900 sm:text-xl dark:text-white'>
                {t('problem.title')}
              </h3>

              <p className='mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400'>
                {t('problem.description')}
              </p>

              <ul className='mt-5 space-y-3 border-t border-rose-200/60 pt-4 dark:border-rose-900/40'>
                {problems.map((prob, idx) => (
                  <li
                    key={idx}
                    className='flex items-start gap-2.5 text-xs text-neutral-700 sm:text-sm dark:text-neutral-300'
                  >
                    <XCircle className='mt-0.5 size-4 shrink-0 text-rose-500' />
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='mt-6 rounded-xl bg-rose-100/60 p-3 text-[11px] font-medium text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'>
              {t('problem.warning')}
            </div>
          </div>

          {/* Solution Card (Positive / FAOS Premium) */}
          <SpotlightCard
            className='gsap-reveal relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.07] via-white to-white p-6 text-left shadow-xl sm:p-8 dark:border-amber-400/20 dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900'
            spotlightColor='rgba(186, 140, 37, 0.15)'
          >
            <BorderBeam
              anchor={90}
              borderWidth={2}
              colorFrom='#ba8c25'
              colorTo='#10b981'
              duration={12}
              size={260}
            />

            <div>
              <div className='flex items-center gap-2 text-xs font-bold text-amber-700 uppercase dark:text-amber-400'>
                <HeartPulse className='size-4 text-emerald-600 dark:text-emerald-400' />
                <span>{t('solution.tag')}</span>
              </div>

              <h3 className='mt-2.5 text-lg font-bold text-neutral-900 sm:text-xl dark:text-white'>
                {t('solution.title')}
              </h3>

              <p className='mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-300'>
                {t('solution.description')}
              </p>

              <ul className='mt-5 space-y-3 border-t border-amber-200/60 pt-4 dark:border-white/10'>
                {solutions.map((sol, idx) => (
                  <li
                    key={idx}
                    className='flex items-start gap-2.5 text-xs font-medium text-neutral-800 sm:text-sm dark:text-neutral-200'
                  >
                    <CheckCircle2 className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='mt-6 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'>
              <span>{t('solution.guarantee')}</span>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
