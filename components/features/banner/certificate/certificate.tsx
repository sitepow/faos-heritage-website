/* eslint-disable react/no-unstable-nested-components */
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { CertificateBannerClient } from './certificate.client'

export const CertificateBanner = async () => {
  const tBanner = await getTranslations('Banner')

  return (
    <CertificateBannerClient
      title={tBanner.rich('certificate', {
        link: (chunks) => (
          <Link href='/about' className='underline'>
            {chunks}
          </Link>
        ),
      })}
    />
  )
}
