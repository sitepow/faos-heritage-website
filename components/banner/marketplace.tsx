'use client'

import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export const MarketplaceBanner = () => {
  const t = useTranslations('Banner.marketplace')
  return (
    <Card fullWidth radius='none'>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 px-5 py-12 text-white'
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7), rgba(0,0,0,1)),
            url('/images/banner/market-place.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-xl leading-tight font-semibold sm:max-w-10/12 sm:text-2xl md:max-w-1/2 xl:max-w-1/3'>
          {t('title')}
        </h2>

        <div className='flex flex-col justify-center gap-4 text-center'>
          <iframe
            className='h-[350px]'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7647160757874!2d100.5608179!3d13.732689800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1d78e70295%3A0x65672fcbcdb9c20d!2z4Lif4Li54LmJ4LiU4LmB4Lil4LiZ4LiU4LmM!5e0!3m2!1sth!2sth!4v1768481262322!5m2!1sth!2sth'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
          <div className='mx-auto flex flex-col sm:max-w-3/4'>
            <span className='text-lg'>{t('description')}</span>
          </div>
        </div>

        <div className='grid max-w-4xl items-center justify-center gap-4 sm:grid-cols-4'>
          <Image
            src={'/images/market/food-land.png'}
            width={150}
            height={150}
            alt=''
            className='h-fit w-32 object-contain'
          />
          <Image
            src={'/images/market/villa-market.png'}
            width={150}
            height={150}
            alt=''
            className='h-fit w-32 object-contain'
          />
          <Image
            src={'/images/market/lazada.svg'}
            width={150}
            height={150}
            alt=''
            className='h-fit w-32 object-contain'
          />
          <Image
            src={'/images/market/shopee.png'}
            width={150}
            height={150}
            alt=''
            className='h-fit w-32 object-contain'
          />
        </div>
      </CardBody>
    </Card>
  )
}
