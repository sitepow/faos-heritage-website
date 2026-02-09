import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' })

  return constructMetadata({
    title: t('intro.seoTitle'),
    description: t('intro.description'),
  })
}

const PrivacyPolicyPage = async ({
  params,
}: {
  params: { locale: string }
}) => {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'privacyPolicy' })

  return (
    <Container>
      <AppSection>
        <SectionHeader
          description={t('intro.description')}
          title={t('intro.title')}
        />

        <p className='text-default-500'>{t('content')}</p>
      </AppSection>
    </Container>
  )
}

export default PrivacyPolicyPage
