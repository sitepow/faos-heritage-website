'use client'

import { CoinsIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { BackgroundBlobs } from '@/components/ui/AffiliateBanner/_components/BackgroundBlobs'
import { AffiliateButton } from '@/components/ui/AffiliateButton'
import { AffiliateHeading } from '@/components/ui/AffiliateHeading'
import { useAppNavigation } from '@/hooks/useAppNavigation'

const AffiliateHero = () => {
  const t = useTranslations('affiliate.banner')
  const navigation = useAppNavigation()

  return (
    <section className='relative flex flex-col items-center justify-center gap-10 overflow-hidden p-5 text-center text-white'>
      <BackgroundBlobs />
      <AffiliateHeading isHero align='center' as='h1' icon={CoinsIcon} />

      <div className='flex flex-wrap items-center justify-center gap-2.5'>
        <AffiliateButton onClick={navigation.REGISTER_AFFILIATE}>
          {t('buttons.register')}
        </AffiliateButton>

        <AffiliateButton variant='outline' onClick={navigation.ABOUT}>
          {t('buttons.about')}
        </AffiliateButton>
      </div>

      {/* <AffiliatePartnerAvatars /> */}
    </section>
  )
}

export { AffiliateHero }
