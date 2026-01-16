/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const CERTIFICATE_IMAGES = [
  '/images/certificate/gmo-free.png',
  '/images/certificate/iso.png',
  '/images/certificate/bio.png',
  '/images/certificate/Chema_logo_medium.png',
]

export const CertificateBanner = () => {
  const tBanner = useTranslations('Banner')

  return (
    <Card fullWidth radius='none'>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 px-5 py-10'
        style={{
          backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7), rgba(0,0,0,1)),
          url(/images/banner/faos-1_wQCzRlmMs-unsplash.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-xl leading-tight font-semibold text-white sm:max-w-10/12 sm:text-2xl md:max-w-1/2 xl:max-w-1/3'>
          {tBanner.rich('certificate', {
            link: (chunks) => <Link href='/about'>{chunks}</Link>,
          })}
        </h2>

        <div className='flex flex-wrap gap-2'>
          {CERTIFICATE_IMAGES?.map((certificate) => (
            <Image
              key={certificate}
              alt={certificate}
              className='size-12 object-cover sm:size-20'
              height={100}
              src={certificate}
              width={100}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
