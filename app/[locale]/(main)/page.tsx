import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductExploreSection } from './_components/ProductExploreSection'

import { AdvertiseBanner } from '@/components/ui/Advertise/AdvertiseBanner'
import { CategoryLists } from '@/components/ui/CategoryLists'
import { IMAGE_FALLBACK, PAGINATION } from '@/constants'
import { getProductsInfinite } from '@/features/product/product.action'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  const translate = await getTranslations({
    locale,
    namespace: 'Meta.Home',
  })

  return {
    description: translate('description'),
    keywords: translate.raw('keywords'),
    alternates: {
      canonical: process.env.APP_URL,
    },
    openGraph: {
      title: translate('ogTitle'),
      description: translate('ogDescription'),
      url: process.env.APP_URL,
      siteName: 'FAOS',
      type: 'website',
      images: [
        {
          url: IMAGE_FALLBACK.OG,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      description: translate('ogDescription'),
      images: IMAGE_FALLBACK.OG,
    },
  }
}

export default async function Homepage() {
  const locale = await getLocale()
  const products = await getProductsInfinite({
    limit: PAGINATION.ITEMS_PER_PAGE,
    locale,
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <CategoryLists />
        <ProductExploreSection
          initialData={products}
          itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
        />
        <AdvertiseBanner />
      </div>
    </section>
  )
}
