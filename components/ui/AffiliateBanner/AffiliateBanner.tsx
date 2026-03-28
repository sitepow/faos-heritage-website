/* eslint-disable no-nested-ternary */
'use client'

import { AffiliateStatus } from '@prisma/client'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { AffiliateHeading } from '../AffiliateHeading'
import { BackgroundBlobs } from './_components/BackgroundBlobs'
import { FadingBackgroundImage } from './_components/FadingBackgroundImage'

import { AffiliateButton } from '@/components/ui/AffiliateButton'
import { useAffiliateProfile } from '@/features/affiliate/hook'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { cn } from '@/utils'

const AffiliateBanner = ({ className }: ComponentProps<'section'>) => {
  const t = useTranslations('affiliate.banner')
  const navigation = useAppNavigation()

  const { data: profile } = useAffiliateProfile()
  const isPending = profile?.status === AffiliateStatus.PENDING
  const isApproved = profile?.status === AffiliateStatus.APPROVED

  return (
    <section
      className={cn(
        'bg-faos-dark relative isolate overflow-hidden rounded-xl px-8 py-12 md:px-16 md:py-20',
        className,
      )}
    >
      <BackgroundBlobs />
      <FadingBackgroundImage />

      <div className='relative z-10 flex flex-col items-center justify-between gap-10 xl:flex-row'>
        <div className='flex flex-col items-center xl:items-start'>
          <AffiliateHeading className='md:max-w-4xl xl:items-start xl:text-left' />
        </div>

        <div className='flex flex-shrink-0 flex-col items-center gap-4'>
          <AffiliateButton onClick={navigation.AFFILIATE}>
            {isPending
              ? t('buttons.checkStatus')
              : isApproved
                ? t('buttons.gotoDashboard')
                : t('buttons.gotoAffiliate')}
          </AffiliateButton>

          <ul className='flex flex-col flex-wrap items-center justify-center gap-2 text-sm text-white/80 sm:flex-row sm:flex-nowrap sm:justify-start'>
            {isPending ? (
              <li className='flex items-center gap-2'>
                <span className='size-2 animate-pulse rounded-full bg-amber-400' />
                <span>{t('status.pending')}</span>
              </li>
            ) : isApproved ? (
              <li className='flex items-center gap-2'>
                <span className='bg-success size-2 rounded-full' />
                <span>{t('status.approved')}</span>
              </li>
            ) : (
              <>
                <li className='flex items-center gap-2'>
                  <span>{t('features.noInvestment')}</span>
                  <span
                    aria-hidden='true'
                    className='size-1 rounded-full bg-white/80'
                  />
                </li>
                <li>
                  <span>{t('features.freeSignup')}</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { AffiliateBanner }
