'use client'

import { useTranslations } from 'next-intl'

import { AdvertiseCard } from './AdvertiseCard'

interface AdvertiseItem {
  title: string
  image: string
  messages: string[]
}

const AdvertiseBanner = () => {
  const t = useTranslations('Banner')
  const advertiseData = t.raw('advertise') as AdvertiseItem[]

  if (!Array.isArray(advertiseData) || advertiseData.length === 0) {
    return null
  }

  return (
    <article className='flex flex-col gap-6'>
      {advertiseData.map((item) => (
        <section key={item.title} className='container mx-auto'>
          <AdvertiseCard {...item} />
        </section>
      ))}
    </article>
  )
}

export { AdvertiseBanner }
