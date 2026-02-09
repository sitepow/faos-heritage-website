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
  const t = useTranslations('')
  const tAdvertise = t.raw('advertise') as AdvertiseItem[]

  if (!Array.isArray(tAdvertise) || tAdvertise.length === 0) {
    return null
  }

  return (
    <AppSection>
      {tAdvertise.map((item) => (
        <AdvertiseCard key={item?.title} {...item} />
      ))}
    </AppSection>
  )
}

export { AdvertiseBanner }
