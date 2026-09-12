'use client'

import {
  ArrowRight,
  Check,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Button } from '@/components/ui/button'
import { useGsapReveal } from '@/hooks/useGsap'

export const CallToActionSection = () => {
  const t = useTranslations('landing.cta')
  const containerRef = useGsapReveal({ y: 30 })

  return (
    <section
      ref={containerRef}
      className='relative w-full overflow-hidden py-14 sm:py-20 md:py-24'
      id='cta'
    >
      {/* Perspective Container */}
      <div className='relative mx-auto max-w-5xl px-4 sm:px-6'>
        {/* Ambient Glow */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 opacity-70 blur-3xl dark:opacity-40'
        />

        {/* Card */}
        <div className='relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-gradient-to-b from-amber-500/[0.04] via-white to-white px-6 py-10 text-center shadow-2xl backdrop-blur-xl sm:px-12 sm:py-16 md:px-16 dark:border-white/10 dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900'>
          {/* Magic UI Animated Grid Pattern */}
          <AnimatedGridPattern
            className='pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)] opacity-30 dark:opacity-20'
            duration={3}
            height={40}
            maxOpacity={0.2}
            numSquares={20}
            width={40}
          />

          {/* Border Beam */}
          <BorderBeam
            anchor={90}
            borderWidth={2}
            colorFrom='#ba8c25'
            colorTo='#f59e0b'
            duration={10}
            size={300}
          />

          {/* Pill Badge */}
          <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
            <Sparkles className='size-3.5' />
            <AnimatedShinyText className='text-xs font-bold tracking-wide text-amber-900 dark:text-amber-200'>
              {t('tag')}
            </AnimatedShinyText>
          </div>

          {/* Headline */}
          <h2 className='mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl dark:text-white'>
            {t('titleLine1')}
            <br className='hidden sm:inline' />
            {t('titleLine2')}
          </h2>

          {/* Subtitle */}
          <p className='mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-300'>
            {t('description')}
          </p>

          {/* CTAs */}
          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
            <Link className='w-full sm:w-auto' href='#products'>
              <ShimmerButton
                background='linear-gradient(135deg, #ba8c25 0%, #946914 100%)'
                className='h-12 w-full px-8 shadow-lg shadow-amber-500/20 sm:w-auto'
                shimmerColor='#ffe399'
                shimmerDuration='2.2s'
              >
                <span className='flex items-center justify-center gap-2 text-sm font-bold text-white'>
                  <ShoppingBag className='size-4' />
                  <span>{t('shopNow')}</span>
                  <ArrowRight className='size-4' />
                </span>
              </ShimmerButton>
            </Link>

            <Link
              className='w-full sm:w-auto'
              href='https://line.me'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Button
                className='h-12 w-full rounded-full border-neutral-300/80 bg-white/70 px-7 text-sm font-semibold text-neutral-800 shadow-xs backdrop-blur-md transition-all hover:border-amber-500 hover:bg-neutral-50 sm:w-auto dark:border-white/15 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:border-amber-400 dark:hover:bg-neutral-800'
                variant='outline'
              >
                <MessageCircle className='size-4 text-emerald-600 dark:text-emerald-400' />
                <span>{t('contactLine')}</span>
              </Button>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className='mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-500 sm:gap-6 dark:text-neutral-400'>
            <span className='flex items-center gap-1.5'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('guarantees.authentic')}
            </span>
            <span className='flex items-center gap-1.5'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('guarantees.shipping')}
            </span>
            <span className='flex items-center gap-1.5'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('guarantees.payment')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
