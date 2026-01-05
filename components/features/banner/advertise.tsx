'use client'

import { CheckCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const AdvertiseItem = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center gap-2 text-start'>
      <CheckCircleIcon className='mt-0.5 size-5 shrink-0' />
      <span className='leading-5'>{message}</span>
    </div>
  )
}

export const AdvertiseBanner = () => {
  const t = useTranslations('Banner')

  const messages: string[] = t.raw('advertise.messages') as string[]

  return (
    <div
      className='flex w-full flex-col gap-6 rounded-xl p-6 text-white shadow-xl'
      style={{
        backgroundImage: `
        linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,1)),
        url(/images/banner/faos-waterfall.webp)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
        {t('advertise.title')}
      </h2>

      <div className='mx-auto grid max-w-md gap-2 md:max-w-2xl md:grid-cols-2 xl:max-w-4xl'>
        {messages?.map((advertise) => (
          <AdvertiseItem key={advertise} message={advertise} />
        ))}
      </div>

      <p className='mx-auto mb-4 text-center text-sm opacity-90'>
        {t('advertise.description')}
      </p>
    </div>
  )
}
