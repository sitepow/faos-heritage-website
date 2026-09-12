'use client'

import {
  Award,
  CreditCard,
  Droplets,
  Flame,
  HeartPulse,
  Landmark,
  Lock,
  QrCode,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { Marquee } from '@/components/magicui/marquee'

interface TrustBadgeItem {
  icon: React.ReactNode
  id: string
  key:
    | 'promptpay'
    | 'stripe'
    | 'coldPressed'
    | 'origin'
    | 'organic'
    | 'acidity'
    | 'polyphenols'
    | 'honey'
    | 'delivery'
    | 'guarantee'
    | 'security'
}

const trustBadges: TrustBadgeItem[] = [
  {
    icon: <QrCode className='size-4 text-amber-600 dark:text-amber-400' />,
    id: 'promptpay',
    key: 'promptpay',
  },
  {
    icon: <CreditCard className='size-4 text-amber-600 dark:text-amber-400' />,
    id: 'stripe',
    key: 'stripe',
  },
  {
    icon: (
      <Droplets className='size-4 text-emerald-600 dark:text-emerald-400' />
    ),
    id: 'cold-pressed',
    key: 'coldPressed',
  },
  {
    icon: <Landmark className='size-4 text-amber-600 dark:text-amber-400' />,
    id: 'origin',
    key: 'origin',
  },
  {
    icon: (
      <ShieldCheck className='size-4 text-emerald-600 dark:text-emerald-400' />
    ),
    id: 'organic',
    key: 'organic',
  },
  {
    icon: <Droplets className='size-4 text-amber-600 dark:text-amber-400' />,
    id: 'acidity',
    key: 'acidity',
  },
  {
    icon: <HeartPulse className='size-4 text-rose-500' />,
    id: 'polyphenols',
    key: 'polyphenols',
  },
  {
    icon: <Flame className='size-4 text-amber-500' />,
    id: 'honey',
    key: 'honey',
  },
  {
    icon: <Truck className='size-4 text-sky-500' />,
    id: 'delivery',
    key: 'delivery',
  },
  {
    icon: <Award className='size-4 text-amber-600 dark:text-amber-400' />,
    id: 'guarantee',
    key: 'guarantee',
  },
  {
    icon: <Lock className='size-4 text-emerald-600 dark:text-emerald-400' />,
    id: 'security',
    key: 'security',
  },
]

export const TrustMarquee = () => {
  const t = useTranslations('landing.trustMarquee')

  return (
    <section
      className='relative w-full overflow-hidden border-y border-neutral-200/80 bg-neutral-50/50 py-8 dark:border-white/10 dark:bg-neutral-900/30'
      id='trust-marquee'
    >
      <div className='mx-auto mb-4 px-4 text-center'>
        <h3 className='text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400'>
          {t('subtitle')}
        </h3>
      </div>

      <div className='relative w-full overflow-hidden'>
        {/* Left & right gradient fade masks */}
        <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-50/90 to-transparent sm:w-28 dark:from-neutral-950 dark:to-transparent' />
        <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-50/90 to-transparent sm:w-28 dark:from-neutral-950 dark:to-transparent' />

        <Marquee
          pauseOnHover
          className='[--duration:38s] [--gap:1.25rem]'
          repeat={3}
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className='flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white/80 px-4 py-2.5 shadow-xs backdrop-blur-md transition-colors hover:border-amber-500/40 hover:bg-white dark:border-white/10 dark:bg-neutral-900/80 dark:hover:border-amber-400/40'
            >
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100/80 dark:bg-neutral-800/80'>
                {badge.icon}
              </div>
              <div className='flex flex-col text-left'>
                <span className='text-xs leading-tight font-semibold text-neutral-900 dark:text-white'>
                  {t(`badges.${badge.key}.title`)}
                </span>
                <span className='text-[10px] text-neutral-500 dark:text-neutral-400'>
                  {t(`badges.${badge.key}.description`)}
                </span>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
