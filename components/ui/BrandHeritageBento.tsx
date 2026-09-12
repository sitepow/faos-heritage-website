'use client'

import { Compass, FlameKindling, ShieldCheck, SunMedium } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'

import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { BorderBeam } from '@/components/magicui/border-beam'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useGsapReveal } from '@/hooks/useGsap'

interface HeritageFeatureDef {
  Icon: React.ElementType
  background: React.ReactNode
  className: string
  href: string
  key: 'origin' | 'coldPressed' | 'honey' | 'organic'
}

const featureDefs: HeritageFeatureDef[] = [
  {
    Icon: Compass,
    background: (
      <div className='relative size-full overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/[0.02] to-transparent'>
        <AnimatedGridPattern
          className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,white_30%,transparent_80%)] opacity-25'
          duration={3}
          height={32}
          maxOpacity={0.2}
          numSquares={16}
          width={32}
        />
        <div className='pointer-events-none absolute -top-12 -right-12 size-56 rounded-full bg-amber-500/15 blur-3xl' />
        <BorderBeam
          colorFrom='#ba8c25'
          colorTo='#f59e0b'
          duration={12}
          size={240}
        />
      </div>
    ),
    className: 'col-span-3 md:col-span-2',
    href: '#products',
    key: 'origin',
  },
  {
    Icon: SunMedium,
    background: (
      <div className='relative size-full overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.02] to-transparent'>
        <div className='pointer-events-none absolute -top-8 -right-8 size-48 rounded-full bg-emerald-500/15 blur-2xl' />
      </div>
    ),
    className: 'col-span-3 md:col-span-1',
    href: '#why-faos',
    key: 'coldPressed',
  },
  {
    Icon: FlameKindling,
    background: (
      <div className='relative size-full overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/[0.02] to-transparent'>
        <div className='pointer-events-none absolute -right-8 -bottom-8 size-48 rounded-full bg-amber-500/15 blur-2xl' />
      </div>
    ),
    className: 'col-span-3 md:col-span-1',
    href: '#products',
    key: 'honey',
  },
  {
    Icon: ShieldCheck,
    background: (
      <div className='relative size-full overflow-hidden bg-gradient-to-tr from-emerald-500/10 via-white/5 to-transparent'>
        <div className='pointer-events-none absolute -bottom-12 -left-12 size-56 rounded-full bg-emerald-500/15 blur-3xl' />
        <div className='absolute top-4 right-4 flex flex-wrap gap-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300'>
          <span className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5'>
            Non-GMO
          </span>
          <span className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5'>
            Pesticide-Free
          </span>
          <span className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5'>
            Lab Tested
          </span>
        </div>
      </div>
    ),
    className: 'col-span-3 md:col-span-2',
    href: '#why-faos',
    key: 'organic',
  },
]

export const BrandHeritageBento = () => {
  const t = useTranslations('landing.heritageBento')
  const containerRef = useGsapReveal({ stagger: 0.12, y: 30 })

  const features = useMemo(
    () =>
      featureDefs.map((def) => ({
        ...def,
        name: t(`cards.${def.key}.name`),
        description: t(`cards.${def.key}.description`),
        cta: t(`cards.${def.key}.cta`),
      })),
    [t],
  )

  return (
    <section ref={containerRef} className='w-full py-10'>
      <div className='mb-8'>
        <SectionHeader
          description={t('headerDescription')}
          title={t('headerTitle')}
        />
      </div>

      <BentoGrid className='auto-rows-[22rem]'>
        {features.map((feature) => (
          <BentoCard
            key={feature.key}
            Icon={feature.Icon}
            background={feature.background}
            className={feature.className}
            cta={feature.cta}
            description={feature.description}
            href={feature.href}
            name={feature.name}
          />
        ))}
      </BentoGrid>
    </section>
  )
}
