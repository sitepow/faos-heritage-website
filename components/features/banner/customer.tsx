'use client'

import { Card, CardBody } from '@heroui/react'
import Link from 'next/link'

import { CountryFlag } from '@/components/common/country-flag'
import { COUNTRIES } from '@/utils/constants'

export const CustomerBanner = () => {
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
          Trusted by customers from{' '}
          <span className='text-primary'>multiple countries worldwide</span>.{' '}
          <Link href='/about'>
            <span className='underline'>
              Quality products with global confidence.
            </span>
          </Link>
        </h2>

        <div className='flex max-w-4xl flex-wrap justify-center gap-4'>
          {COUNTRIES.map((country) => (
            <div
              key={country.code}
              className='flex flex-col items-center gap-1 text-xs text-white/80'
            >
              <CountryFlag
                className='size-12 sm:size-14'
                countryCode={country.code}
              />
              <span>{country.name}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
