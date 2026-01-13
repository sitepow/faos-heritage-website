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
]

export const CertificateBanner = () => {
  const tBanner = useTranslations('Banner')

  return (
    <Card fullWidth>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 rounded-xl px-5 py-10'
        style={{
          backgroundImage: `
          linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.7), rgba(0,0,0,1)),
          url(https://images.unsplash.com/photo-1758522964667-a3271801a5a8?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
          `,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-xl leading-tight font-bold text-white sm:max-w-10/12 sm:text-2xl md:max-w-1/2 xl:max-w-1/3'>
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
