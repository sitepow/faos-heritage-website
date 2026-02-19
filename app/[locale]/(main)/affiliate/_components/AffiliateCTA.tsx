'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { BackgroundBlobs } from '@/components/ui/AffiliateBanner/_components/BackgroundBlobs'
import { AffiliateButton } from '@/components/ui/AffiliateButton'
import { AffiliateHeading } from '@/components/ui/AffiliateHeading'
import { useAppNavigation } from '@/hooks/useAppNavigation'

const AffiliateCTA = () => {
  const t = useTranslations('affiliate.cta')
  const navigation = useAppNavigation()

  return (
    <section className='mx-auto w-full'>
      <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 py-10 text-center backdrop-blur-md'>
        <BackgroundBlobs />

        <div className='relative z-10'>
          <AffiliateHeading
            align='center'
            className='mb-10'
            namespace='affiliate.cta'
          />

          <div className='flex flex-col flex-wrap items-center justify-center gap-4'>
            <AffiliateButton
              className='group flex flex-wrap items-center justify-center gap-2'
              onClick={navigation.REGISTER_AFFILIATE}
            >
              {t('buttons.register')}
              <ArrowRight className='hidden size-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block' />
            </AffiliateButton>

            <AffiliateButton
              variant='outline'
              onClick={navigation.AFFILIATE_CONTRACT}
            >
              {t('buttons.inquiry')}
            </AffiliateButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export { AffiliateCTA }
