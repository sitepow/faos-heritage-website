// import { getLocale, getTranslations } from 'next-intl/server'

// import type { Metadata } from 'next'

// import { CategoryClient } from '@/app/[locale]/(main)/category/[slug]/client'
// import { getProducts } from '@/app/[locale]/(main)/products/action'
// import { PageNotFound } from '@/components/ui/EmptyState'
// import { ITEM_PER_PAGE } from '@/constants/app'
// import { OG_IMAGE } from '@/constants/seo'
// import { getIdFromSlug, getNameFromSlug } from '@/utils/slug'

// interface CategoryProps {
//   params: Promise<{ slug: string; locale: string }>
// }

// export async function generateMetadata({
//   params,
// }: CategoryProps): Promise<Metadata> {
//   const { slug, locale } = await params
//   const slugStr = Array.isArray(slug) ? slug[0] : slug
//   const categoryName = getNameFromSlug(slugStr)

//   const t = await getTranslations({
//     locale,
//     namespace: 'Meta.Category',
//   })

//   const title = t('title', { categoryName })
//   const description = t('description', { categoryName })
//   const url = `${process.env.APP_URL}/category/${slugStr}`

//   return {
//     title,
//     description,
//     alternates: {
//       canonical: url,
//     },
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: 'FAOS',
//       type: 'website',
//       images: [
//         {
//           url: OG_IMAGE,
//           width: 1200,
//           height: 630,
//           alt: t('ogAlt', { categoryName }),
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: [OG_IMAGE],
//     },
//   }
// }

// export default async function Category({ params }: CategoryProps) {
//   const locale = await getLocale()
//   const { slug } = await params
//   const slugStr = Array.isArray(slug) ? slug[0] : slug
//   const categoryId = getIdFromSlug(slugStr)
//   const categoryName = getNameFromSlug(slugStr)

//   const products = await getProducts({
//     limit: ITEM_PER_PAGE,
//     categoryId,
//     locale,
//   })

//   if (!products || products.items.length === 0) {
//     return (
//       <PageNotFound>
//         Sorry! Product category Nothing matches. Please try searching for new
//         products on the homepage.
//       </PageNotFound>
//     )
//   }

//   return (
//     <>
//       <h1 className='sr-only'>{categoryName} Products</h1>
//       <CategoryClient
//         categoryId={categoryId}
//         initialProducts={products}
//         itemPerPage={ITEM_PER_PAGE}
//       />
//     </>
//   )
// }
