import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { AffiliateClient } from './affiliate.client'

import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.affiliate' })

  const keywords = t.raw('keywords')

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonicalPath: '/affiliate',
    keywords: keywords,
  })
}

const AffiliatePage = async () => {
  return <AffiliateClient />
}

export { generateMetadata }
export default AffiliatePage
