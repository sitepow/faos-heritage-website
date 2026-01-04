/* eslint-disable react/no-unstable-nested-components */

import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { CustomerBannerClient } from './customer.client'

import { COUNTRIES } from '@/utils/constants'

export const CustomerBanner = async () => {
  const tBanner = await getTranslations('Banner')
  const tCountry = await getTranslations('Country')

  const countries = COUNTRIES.map((c) => ({
    code: c.code,
    name: tCountry(c.code),
  }))

  return (
    <CustomerBannerClient
      title={tBanner.rich('customer', {
        highlight: (chunks) => <span className='text-primary'>{chunks}</span>,
        link: (chunks) => (
          <Link href='/about' className='underline'>
            {chunks}
          </Link>
        ),
      })}
      countries={countries}
    />
  )
}
