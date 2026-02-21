import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

// import { PostExploreSection } from './_components/PostExploreSection'
import { ProductExploreSection } from './_components/ProductExploreSection'

import { AppSection } from '@/components/layouts/AppSection'
import { AdvertiseBanner } from '@/components/ui/Advertise/AdvertiseBanner'
import { AffiliateBanner } from '@/components/ui/AffiliateBanner/AffiliateBanner'
import { CategoryLists } from '@/components/ui/CategoryLists'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PAGINATION } from '@/constants'
import { getProductsInfinite } from '@/features/product/product.action'
import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('home.title'),
    description: t('home.description'),
  })
}

const HomePage = async () => {
  const t = await getTranslations('shared.categoryDiscovery')

  const locale = await getLocale()
  const products = await getProductsInfinite({
    limit: PAGINATION.ITEMS_PER_PAGE,
    locale,
  })

  return (
    <AppSection>
      <div className='flex flex-col gap-5'>
        <SectionHeader description={t('description')} title={t('title')} />
        <CategoryLists />
      </div>
      <ProductExploreSection
        initialData={products}
        itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
      />
      {/* <PostExploreSection /> */}
      <AdvertiseBanner />
      <AffiliateBanner />
    </AppSection>
  )
}

export default HomePage
