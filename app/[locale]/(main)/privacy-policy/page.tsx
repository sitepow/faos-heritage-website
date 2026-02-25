import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const tMeta = await getTranslations({
    locale,
    namespace: 'meta.privacyPolicy',
  })
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' })

  return constructMetadata({
    title: t('intro.seoTitle'),
    description: t('intro.description'),
    canonicalPath: '/privacy-policy',
    keywords: tMeta.raw('keywords'),
  })
}

const PrivacyPolicyPage = async ({ params }: Props) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' })

  return (
    <Container>
      <AppSection>
        <SectionHeader
          description={t('intro.description')}
          title={t('intro.title')}
        />
        <p className='text-default-500 whitespace-pre-line'>{t('content')}</p>
      </AppSection>
    </Container>
  )
}

export { generateMetadata }
export default PrivacyPolicyPage
