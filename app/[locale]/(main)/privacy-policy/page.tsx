// import { getTranslations } from 'next-intl/server'

// import type { Metadata } from 'next'

// import { PrivacyClient } from './privacy-policy.client'

// import { IMAGE_FALLBACK } from '@/constants/app'

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>
// }): Promise<Metadata> {
//   const { locale } = await params

//   const translate = await getTranslations({
//     locale,
//     namespace: 'Meta.Privacy',
//   })

//   const canonicalUrl = `${process.env.APP_URL}/privacy`

//   return {
//     title: translate('title'),
//     description: translate('description'),
//     keywords: translate.raw('keywords'),
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: translate('ogTitle'),
//       description: translate('ogDescription'),
//       url: canonicalUrl,
//       siteName: 'FAOS',
//       type: 'article',
//       images: [
//         {
//           url: IMAGE_FALLBACK.OG,
//           width: 1200,
//           height: 630,
//           alt: translate('ogTitle'),
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: translate('ogTitle'),
//       description: translate('ogDescription'),
//       images: [IMAGE_FALLBACK.OG],
//     },
//   }
// }

// export default function Privacy() {
//   return (
//     <>
//       <h1 className='sr-only'>Privacy Policy</h1>
//       <PrivacyClient />
//     </>
//   )
// }
