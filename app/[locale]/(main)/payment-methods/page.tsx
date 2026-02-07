import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PaymentMethodsClient } from './payment-methods.client'

import { Container } from '@/components/layouts/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const tp = await getTranslations({ locale, namespace: 'paymentMethods' })

  return constructMetadata({
    title: tp('intro.seoTitle'),
    description: tp('intro.description'),
  })
}

const PaymentMethodsPage = async ({
  params,
}: {
  params: { locale: string }
}) => {
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
    <Container className='flex flex-col gap-5 p-5 text-center'>
      <SectionHeader
        description={t('intro.description')}
        title={t('intro.title')}
      />
      <PaymentMethodsClient data={paymentData} />
    </Container>
  )
}

export default PaymentMethodsPage
