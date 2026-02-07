import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductExploreSection } from './_components/ProductExploreSection'

import { AdvertiseBanner } from '@/components/ui/Advertise/AdvertiseBanner'
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
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <div className='flex flex-col gap-5'>
          <SectionHeader description={t('description')} title={t('title')} />
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
