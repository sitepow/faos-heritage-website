'use client'

import { CheckCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AdvertiseItem {
  title: string
  image: string
  messages: string[]
}

export const AdvertiseBanner = () => {
  const t = useTranslations('Banner')
  const advertiseData = t.raw('advertise') as AdvertiseItem[]

  return (
    <article className='flex flex-col gap-5'>
      {advertiseData?.map((item, index) => {
        return (
          <section key={index} className='container mx-auto'>
            <div
              className='relative overflow-hidden rounded-lg px-6 py-16 text-white'
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className='relative z-10 flex flex-col items-center gap-10'>
                <h2 className='max-w-2xl text-center text-xl leading-tight font-bold tracking-tight sm:text-2xl'>
                  {item.title}
                </h2>

                <div className='grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {item?.messages?.map((message, idx) => (
                    <div
                      key={idx}
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
      })}
    </article>
  )
}
