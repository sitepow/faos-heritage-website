// import { useTranslations } from 'next-intl'
// import { getTranslations } from 'next-intl/server'

// import type { Metadata } from 'next'

// import { PdfViewer } from '@/components/ui/PdfViewer/PdfViewer'
// import { IMAGE_FALLBACK } from '@/constants/app'

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>
// }): Promise<Metadata> {
//   const { locale } = await params

//   const translate = await getTranslations({
//     locale,
//     namespace: 'Meta.About',
//   })

//   const canonicalUrl = `${process.env.APP_URL}/about`

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

// export default function About() {
//   const translate = useTranslations('About')

//   return (
//     <>
//       <section className='container mx-auto grid gap-5 p-5 lg:grid-cols-2'>
//         <PdfViewer fileUrl='/documents/faos-organic-olive-oil-brochure.pdf' />
//         <PdfViewer fileUrl='/documents/CHEMICAL-ANALYSIS-EVOO.pdf' />
//       </section>

//       <section className='sr-only'>
//         <h1>{translate('title')}</h1>
//         <p>{translate('description')}</p>
//         <ul>
//           <li>{translate('philosophy')}</li>
//           <li>{translate('quality')}</li>
//           <li>{translate('origin')}</li>
//         </ul>
//       </section>
//     </>
//   )
// }
