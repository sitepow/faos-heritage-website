import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { FaqClient } from './faq.client'

import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shared' })

  return constructMetadata({
    title: t('faq.title'),
    description: t('faq.description'),
    noIndex: true,
  })
}

const FaqPage = async ({ params }: Props) => {
  const { slug, locale } = await params

  return <FaqClient locale={locale} slug={slug} />
}

export { generateMetadata }
export default FaqPage
