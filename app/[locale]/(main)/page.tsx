import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostExploreSection } from './_components/PostExploreSection'
import { ProductExploreSection } from './_components/ProductExploreSection'

import { AppSection } from '@/components/layouts/AppSection'
import { ActivitySection } from '@/components/section/ActivitySection'
import { FaqSection } from '@/components/section/FaqSection'
import { AffiliateBanner } from '@/components/ui/AffiliateBanner/AffiliateBanner'
import { CategoryLists } from '@/components/ui/CategoryLists'
import { HeroSection } from '@/components/ui/HeroSection'
import { PartnerSection } from '@/components/ui/PartnerSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { YouTubeList } from '@/components/ui/YouTubeList'
import { PAGINATION } from '@/constants'
import { getProductsInfinite } from '@/features/product/action'
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
      <HeroSection />
      <header className='flex flex-col gap-10 pb-10'>
        <SectionHeader
          as='h1'
          description={t('description')}
          title={t('title')}
        />
        <CategoryLists />
      </header>
      <ProductExploreSection
        initialData={products}
        itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
      />
      <PostExploreSection itemsPerPage={PAGINATION.ITEMS_PER_PAGE} />
      <ActivitySection />
      <AffiliateBanner />
      <YouTubeList />
      <PartnerSection />
      <FaqSection />
    </AppSection>
  )
}

export default HomePage
