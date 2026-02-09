'use client'

import { useTranslations } from 'next-intl'

import { AdvertiseCard } from './AdvertiseCard'

import { AppSection } from '@/components/layouts/AppSection'

interface AdvertiseItem {
  title: string
  image: string
  messages: string[]
}

const AdvertiseBanner = () => {
  const translate = useTranslations('')
  const translateAdvertise = translate.raw('advertise') as AdvertiseItem[]

  if (!Array.isArray(translateAdvertise) || translateAdvertise.length === 0) {
    return null
  }

  return (
    <AppSection>
      {translateAdvertise.map((item) => (
        <AdvertiseCard key={item?.title} {...item} />
      ))}
    </AppSection>
  )
}

export { AdvertiseBanner }
