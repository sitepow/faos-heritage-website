/* eslint-disable @next/next/no-img-element */
'use client'

import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import { SectionHeader } from './SectionHeader'

import { Marquee } from '@/components/magicui/marquee'
import { IMAGE_FALLBACK } from '@/constants'
import { useActiveStorefronts } from '@/features/storefront/hook'
import { useGsapReveal } from '@/hooks/useGsap'

interface PartnerImageProps {
  name: string
  image: string
}

const PartnerImage = React.memo(({ name, image }: PartnerImageProps) => {
  return (
    <div className='flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white p-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
      <img
        alt={name}
        className='size-full rounded-full object-contain'
        loading='lazy'
        src={image || IMAGE_FALLBACK.EMPTY}
      />
    </div>
  )
})

PartnerImage.displayName = 'PartnerImage'

const PartnerSection = () => {
  const t = useTranslations('shared.partner')
  const tLanding = useTranslations('landing.partner')
  const { data: storefronts, isLoading } = useActiveStorefronts({
    ignoreAdmin: true,
  })
  const containerRef = useGsapReveal({ y: 20 })

  if (isLoading || !storefronts?.length) {
    return null
  }

  return (
    <section ref={containerRef} className='relative w-full py-12'>
      <div className='container mx-auto px-4'>
        <div className='gsap-reveal mb-8'>
          <SectionHeader description={t('description')} title={t('title')} />
        </div>

        {/* Magic UI Marquee with left/right fade masks */}
        <div className='relative w-full overflow-hidden py-4'>
          {/* Gradient Masks */}
          <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent sm:w-28' />
          <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent sm:w-28' />

          <Marquee pauseOnHover className='[--duration:35s]' repeat={4}>
            {storefronts.map((partner) => (
              <Link
                key={partner.id}
                className='group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white/70 px-5 py-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-amber-400/40'
                href={partner.googleMapUrl || '#'}
                rel='noopener noreferrer'
                target='_blank'
              >
                <PartnerImage
                  image={partner.image || IMAGE_FALLBACK.EMPTY}
                  name={partner.name}
                />
                <div className='flex flex-col text-left'>
                  <span className='font-semibold text-neutral-800 transition-colors group-hover:text-amber-700 dark:text-neutral-100 dark:group-hover:text-amber-300'>
                    {partner.name}
                  </span>
                  <span className='flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400'>
                    <MapPin
                      className='text-amber-600 dark:text-amber-400'
                      size={12}
                    />
                    {tLanding('viewMap')}
                  </span>
                </div>
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}

export { PartnerSection }
