/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { IMAGE_FALLBACK } from '@/constants'
import { useActiveStorefronts } from '@/features/storefront/hook'

const PartnerSection = () => {
  const t = useTranslations('footer')
  const { data: storefronts, isLoading } = useActiveStorefronts()

  if (isLoading) {
    return null
  }

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='mb-8 text-center text-2xl font-bold'>
          {t('menu.3.title')}
        </h2>
        <div className='grid items-center gap-8 sm:grid-cols-2 xl:grid-cols-4'>
          {storefronts?.map((partner) => {
            return (
              <Link
                key={partner.id}
                className='flex flex-col flex-wrap items-center justify-center gap-2.5 p-4 text-center grayscale transition-all duration-300 hover:grayscale-0'
                href={partner.googleMapUrl || '#'}
                rel='noopener noreferrer'
                target='_blank'
              >
                <img
                  alt={partner.name}
                  className='max-h-32 w-auto bg-black object-contain'
                  height={80}
                  src={partner.image || IMAGE_FALLBACK.EMPTY}
                  width={160}
                />
                <p className='max-w-3/4 md:max-w-3/5 xl:w-full'>
                  {partner.name}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { PartnerSection }
