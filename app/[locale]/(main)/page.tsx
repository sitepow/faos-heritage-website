import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostExploreSection } from './_components/PostExploreSection'
import { ProductExploreSection } from './_components/ProductExploreSection'

import { AppSection } from '@/components/layouts/AppSection'
import { ActivitySection } from '@/components/section/ActivitySection'
import { FaqSection } from '@/components/section/FaqSection'
import { AffiliateBanner } from '@/components/ui/AffiliateBanner/AffiliateBanner'
import { BrandHeritageBento } from '@/components/ui/BrandHeritageBento'
import { BrandMetrics } from '@/components/ui/BrandMetrics'
import { CallToActionSection } from '@/components/ui/CallToActionSection'
import { HeroSection } from '@/components/ui/HeroSection'
import { HowItWorksSection } from '@/components/ui/HowItWorksSection'
import { PartnerSection } from '@/components/ui/PartnerSection'
import { TrustMarquee } from '@/components/ui/TrustMarquee'
import { WhyFaosSection } from '@/components/ui/WhyFaosSection'
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
    description: t('home.description'),
    title: t('home.title'),
  })
}

const HomePage = async () => {
  const locale = await getLocale()
  const products = await getProductsInfinite({
    limit: PAGINATION.ITEMS_PER_PAGE,
    locale,
  })

  return (
    <AppSection>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Badges & Logistics Marquee */}
      <TrustMarquee />

      {/* 3. Problem vs Solution Comparison */}
      <WhyFaosSection />

      {/* 4. Brand Metrics Counters */}
      <BrandMetrics />

      {/* 5. Category Discovery & Products Grid */}
      <div className='scroll-mt-24' id='products'>
        <ProductExploreSection
          initialData={products}
          itemsPerPage={PAGINATION.ITEMS_PER_PAGE}
        />
      </div>

      {/* 6. Brand Heritage Bento Grid */}
      <div className='scroll-mt-24' id='heritage'>
        <BrandHeritageBento />
      </div>

      {/* 7. How It Works (3 Steps) */}
      <HowItWorksSection />

      {/* 8. Articles, Recipes & Blog */}
      <PostExploreSection itemsPerPage={PAGINATION.ITEMS_PER_PAGE} />

      {/* 9. Retail Partners & Storefronts */}
      <PartnerSection />

      {/* 10. News & Activities */}
      <ActivitySection />

      {/* 11. Affiliate Community */}
      <AffiliateBanner />

      {/* 12. Video Highlights */}
      <YouTubeList />

      {/* 13. FAQ Accordion */}
      <FaqSection />

      {/* 14. Bottom Call-to-Action Banner */}
      <CallToActionSection />
    </AppSection>
  )
}

export default HomePage
