'use client'

import { CheckCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const AdvertiseBanner = () => {
  const t = useTranslations('Banner')
  const messages = t.raw('advertise.messages') as string[]

  return (
    <section className='container mx-auto'>
      <div
        className='border-divider relative overflow-hidden rounded-lg border px-6 py-16 text-white'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(/images/banner/faos-waterfall.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='relative z-10 flex flex-col items-center gap-10'>
          <h2 className='max-w-2xl text-center text-xl leading-tight font-bold tracking-tight sm:text-2xl'>
            {t('advertise.title')}
          </h2>

          <div className='grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {messages?.map((message) => (
              <div
                key={message}
                className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-transform'
              >
                <CheckCircleIcon className='size-6 shrink-0' />
                <span className='text-start text-sm leading-snug font-medium sm:text-base'>
                  {message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
