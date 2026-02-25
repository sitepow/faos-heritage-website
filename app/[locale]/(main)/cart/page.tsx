import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CartClient } from './cart.client'

import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('cart.title'),
    description: t('cart.description'),
    noIndex: true,
  })
}

const CartPage = async () => {
  return <CartClient />
}

export { generateMetadata }
export default CartPage
