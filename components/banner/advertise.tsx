'use client'

import { CheckCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const AdvertiseItem = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center gap-2 text-start text-sm sm:text-base'>
      <CheckCircleIcon className='mt-0.5 size-6 shrink-0' />
      <span className='leading-relaxed'>{message}</span>
    </div>
  )
}

export const AdvertiseBanner = () => {
  const t = useTranslations('Banner')

  const messages: string[] = t.raw('advertise.messages') as string[]

  return (
    <div
      className='flex w-full flex-col gap-6 px-6 py-14 text-white shadow-xl'
      style={{
        backgroundImage: `
        linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7), rgba(0,0,0,1)),
        url(/images/banner/faos-waterfall.jpg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className='mx-auto max-w-11/12 text-center text-xl leading-tight font-semibold sm:max-w-10/12 sm:text-2xl md:max-w-1/2 xl:max-w-1/3'>
        {t('advertise.title')}
      </h2>

      <div className='mx-auto grid max-w-md gap-2 md:max-w-3xl md:grid-cols-2 xl:max-w-4xl'>
        {messages?.map((advertise) => (
          <AdvertiseItem key={advertise} message={advertise} />
        ))}
      </div>
    </div>
  )
}
