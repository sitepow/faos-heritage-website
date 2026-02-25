import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PaymentMethodsClient } from './payment-methods.client'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.paymentMethods' })

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonicalPath: '/payment-methods',
    keywords: t.raw('keywords'),
  })
}

const PaymentMethodsPage = async ({ params }: Props) => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'paymentMethods' })

  const paymentData = {
    howToShop: {
      title: t('guides.howToShop.title'),
      steps: t.raw('guides.howToShop.steps') as string[],
    },
    card: {
      title: t('guides.card.title'),
      accepted: t('guides.card.accepted'),
      security: t('guides.card.security'),
    },
    qr: {
      title: t('guides.qr.title'),
      method: t('guides.qr.method'),
      note: t('guides.qr.note'),
    },
    atStore: {
      title: t('guides.atStore.title'),
      description: t('guides.atStore.description'),
      locations: t.raw('guides.atStore.locations') as string[],
      note: t('guides.atStore.note'),
    },
  }

  return (
    <Container>
      <AppSection>
        <SectionHeader
          description={t('intro.description')}
          title={t('intro.title')}
        />
        <PaymentMethodsClient data={paymentData} />
      </AppSection>
    </Container>
  )
}

export { generateMetadata }
export default PaymentMethodsPage
