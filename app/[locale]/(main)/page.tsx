import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductExploreSection } from './_components/ProductExploreSection'

import { AdvertiseBanner } from '@/components/ui/Advertise/AdvertiseBanner'
import { CategoryLists } from '@/components/ui/CategoryLists'
import { SectionHeader } from '@/components/ui/SectionHeader'
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
  })

  const title = translate('meta.home.title')
  const description = translate('meta.home.description')
  const keywords = translate.raw('commonKeywords')

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: process.env.APP_URL,
    },
    openGraph: {
      title,
      description,
      url: process.env.APP_URL,
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
      description,
      images: IMAGE_FALLBACK.OG,
    },
  }
}

const HomePage = async () => {
  const translateCategoryDiscovery = await getTranslations(
    'shared.categoryDiscovery',
  )

  const locale = await getLocale()
  const products = await getProductsInfinite({
    limit: PAGINATION.ITEMS_PER_PAGE,
    locale,
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <div className='flex flex-col gap-5'>
          <SectionHeader
            description={translateCategoryDiscovery('description')}
            title={translateCategoryDiscovery('title')}
          />
          <CategoryLists />
        </div>
        <ProductExploreSection
          initialData={products}
          itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
        />
        <AdvertiseBanner />
      </div>
    </section>
  )
}

export default HomePage
