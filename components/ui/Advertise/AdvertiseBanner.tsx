'use client'

import { useTranslations } from 'next-intl'

import { AdvertiseCard } from './AdvertiseCard'

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
    <article className='flex flex-col gap-6'>
      {translateAdvertise.map((item) => (
        <section key={item.title} className='container mx-auto'>
          <AdvertiseCard {...item} />
        </section>
      ))}
    </article>
  )
}

export { AdvertiseBanner }
