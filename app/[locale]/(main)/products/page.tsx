// import { getLocale, getTranslations } from 'next-intl/server'

// import type { Metadata } from 'next'

// import { getProducts } from '@/app/[locale]/(main)/products/action'
// import { ProductsClient } from '@/app/[locale]/(main)/products/client'
// import { PageNotFound } from '@/components/ui/EmptyState'
// import { ITEM_PER_PAGE } from '@/constants/app'
// import { OG_IMAGE } from '@/constants/seo'

// export async function generateMetadata({
//   params,
// }: {
//   params: { locale: string }
// }): Promise<Metadata> {
//   const { locale } = await params

//   const t = await getTranslations({
//     locale,
//     namespace: 'Meta.Products',
//   })

//   const canonicalUrl = `${process.env.APP_URL}/products`

//   return {
//     title: t('title'),
//     description: t('description'),
//     keywords: t.raw('keywords'),
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: t('ogTitle'),
//       description: t('ogDescription'),
//       url: canonicalUrl,
//       siteName: 'FAOS',
//       type: 'website',
//       images: [
//         {
//           url: OG_IMAGE,
//           width: 1200,
//           height: 630,
//           alt: t('ogTitle'),
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: t('ogTitle'),
//       description: t('ogDescription'),
//       images: [OG_IMAGE],
//     },
//   }
// }

// export default async function Products() {
//   const locale = await getLocale()
//   const products = await getProducts({ limit: ITEM_PER_PAGE, locale })

//   if (!products || products.items.length === 0) {
//     return (
//       <PageNotFound>
//         We apologize, the product was not found in our system. Please try
//         searching for the product again on the homepage.
//       </PageNotFound>
//     )
//   }

//   return (
//     <>
//       <h1 className='sr-only'>All FAOS Products</h1>
//       <ProductsClient initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
//     </>
//   )
// }
