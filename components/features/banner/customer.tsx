/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Card, CardBody } from '@heroui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { CountryFlag } from '@/components/common/country-flag'
import { COUNTRIES } from '@/utils/constants'

export const CustomerBanner = () => {
  const tBanner = useTranslations('Banner')
  const tCountry = useTranslations('Country')

  const countries = COUNTRIES.map((c) => ({
    code: c.code,
    name: tCountry(c.code),
  }))

  return (
    <Card fullWidth>
      <CardBody
        className='flex w-full flex-col items-center justify-center gap-10 rounded-xl px-5 py-12'
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,1)),
            url(/images/banner/faos-shipping-wold-wide.webp)
          `,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold text-white sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
          {tBanner.rich('customer', {
            highlight: (chunks) => (
              <span className='text-primary'>{chunks}</span>
            ),
            link: (chunks) => (
              <Link href='/about' className='underline'>
                {chunks}
              </Link>
            ),
          })}
        </h2>

        <div className='flex max-w-4xl flex-wrap justify-center gap-2'>
          {countries.map((country) => (
            <div
              key={country.code}
              className='flex flex-col items-center gap-1 text-xs text-white/80'
            >
              <CountryFlag
                className='sm:size-10 lg:size-12'
                countryCode={country.code}
              />
              <span className='hidden sm:block'>{country.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
