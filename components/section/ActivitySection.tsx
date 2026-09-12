/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Calendar,
  Camera,
  ChevronDown,
  ChevronUp,
  Images,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Marquee } from '@/components/magicui/marquee'
import { Button } from '@/components/ui/button'
import { useGsapReveal } from '@/hooks/useGsap'

interface ActivityItem {
  content: string
  images: string[]
}

const ActivitySection = () => {
  const t = useTranslations()
  const activityShared = useTranslations('shared.activity')
  const tLanding = useTranslations('landing.activity')
  const activityData = (t.raw('activity') as ActivityItem[]) || []
  const [showAll, setShowAll] = useState(false)
  const containerRef = useGsapReveal({ stagger: 0.12, y: 25 })

  if (!activityData.length) {
    return null
  }

  return (
    <section
      ref={containerRef}
      className='relative w-full py-12 sm:py-16 md:py-20'
      id='activity'
    >
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Center Header (sitepow.store style) */}
        <div className='gsap-reveal mx-auto mb-10 flex max-w-3xl flex-col items-center space-y-3 px-3 text-center'>
          <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
            <Camera className='size-3.5' />
            <AnimatedShinyText className='text-xs font-bold tracking-wide text-amber-900 dark:text-amber-200'>
              {tLanding('tag')}
            </AnimatedShinyText>
          </div>

          <h2 className='text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white'>
            {activityShared('title') || 'ข่าวสารและกิจกรรม'}
          </h2>

          <p className='max-w-xl text-xs leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300'>
            {activityShared('description') ||
              'ติดตามกิจกรรมและสาระดีๆ ที่เราตั้งใจแชร์เพื่อให้ทุกคนสนุกกับการดูแลสุขภาพไปด้วยกัน'}
          </p>
        </div>

        {/* Activity Showcase Cards */}
        {activityData.map((item) => {
          const halfIndex = Math.ceil(item.images.length / 2)
          const firstRowImages = item.images.slice(0, halfIndex)
          const secondRowImages = item.images.slice(halfIndex)

          return (
            <div
              key={item.content.slice(0, 30)}
              className='gsap-reveal relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8 md:p-10 dark:border-white/10 dark:bg-neutral-900/70'
            >
              {/* Magic UI Border Beam */}
              <BorderBeam
                anchor={90}
                borderWidth={2}
                colorFrom='#ba8c25'
                colorTo='#f59e0b'
                duration={14}
                size={350}
              />

              {/* Event Meta Tags */}
              <div className='flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/60 pb-5 dark:border-white/10'>
                <div className='flex flex-wrap items-center gap-2.5'>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300'>
                    <Sparkles className='size-3.5' />
                    <span>{tLanding('sensoryWorkshop')}</span>
                  </span>

                  <span className='inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400'>
                    <Calendar className='size-3.5 text-amber-600 dark:text-amber-400' />
                    <span>{tLanding('exhibition')}</span>
                  </span>
                </div>

                <div className='flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300'>
                  <MapPin className='size-3.5 text-rose-500' />
                  <span>Atmoz Season Ladkrabang</span>
                </div>
              </div>

              {/* Description Content */}
              <div className='py-6'>
                <p
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className='text-sm leading-relaxed text-neutral-700 sm:text-base dark:text-neutral-300 [&>normal]:font-semibold [&>normal]:text-neutral-900 dark:[&>normal]:text-white'
                />
              </div>

              {/* Photos Showcase: Dual Marquee or Full Grid */}
              <div className='mt-2'>
                {!showAll ? (
                  <div className='relative w-full space-y-3 overflow-hidden rounded-2xl py-2'>
                    {/* Left & Right gradient fade masks */}
                    <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white/90 to-transparent sm:w-28 dark:from-neutral-900/90 dark:to-transparent' />
                    <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white/90 to-transparent sm:w-28 dark:from-neutral-900/90 dark:to-transparent' />

                    {/* Row 1: Forward Marquee */}
                    <Marquee
                      pauseOnHover
                      className='[--duration:32s] [--gap:1rem]'
                      repeat={3}
                    >
                      {firstRowImages.map((image) => (
                        <div
                          key={image}
                          className='group relative size-36 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/80 shadow-xs sm:size-48 dark:border-white/10'
                        >
                          <img
                            alt='Activity photo'
                            className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
                            loading='lazy'
                            src={image}
                          />
                        </div>
                      ))}
                    </Marquee>

                    {/* Row 2: Reverse Marquee */}
                    <Marquee
                      pauseOnHover
                      reverse
                      className='[--duration:36s] [--gap:1rem]'
                      repeat={3}
                    >
                      {secondRowImages.map((image) => (
                        <div
                          key={image}
                          className='group relative size-36 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/80 shadow-xs sm:size-48 dark:border-white/10'
                        >
                          <img
                            alt='Activity photo'
                            className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
                            loading='lazy'
                            src={image}
                          />
                        </div>
                      ))}
                    </Marquee>
                  </div>
                ) : (
                  /* Expanded Full Photo Grid */
                  <div className='grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {item.images.map((image) => (
                      <div
                        key={image}
                        className='group relative aspect-square overflow-hidden rounded-2xl border border-neutral-200/80 shadow-xs dark:border-white/10'
                      >
                        <img
                          alt='Activity photo'
                          className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
                          loading='lazy'
                          src={image}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View All Photos / Collapse Button */}
              <div className='mt-6 flex items-center justify-center border-t border-neutral-200/60 pt-6 dark:border-white/10'>
                <Button
                  className='h-10 rounded-full border-neutral-300/80 bg-white/80 px-6 text-xs font-semibold text-neutral-800 shadow-xs backdrop-blur-md transition-all hover:border-amber-500 hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:border-amber-400'
                  variant='outline'
                  onClick={() => setShowAll(!showAll)}
                >
                  <Images className='size-3.5 text-amber-600 dark:text-amber-400' />
                  <span>
                    {showAll
                      ? tLanding('collapsePhotos')
                      : tLanding('expandPhotos', { count: item.images.length })}
                  </span>
                  {showAll ? (
                    <ChevronUp className='size-3.5' />
                  ) : (
                    <ChevronDown className='size-3.5' />
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { ActivitySection }
