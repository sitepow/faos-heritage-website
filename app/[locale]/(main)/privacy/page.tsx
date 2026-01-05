// import type { Metadata } from 'next'

import { PrivacyClient } from './client'

// import { siteConfig } from '@/config/site'
// import { OG_IMAGE } from '@/utils/constants'

// export const metadata: Metadata = {
//   title: `Privacy Policy | ${siteConfig.title}`,
//   description:
//     'Read FAOS Privacy Policy to understand how we collect, use, and protect your personal information securely.',
//   keywords: [
//     'FAOS privacy policy',
//     'privacy policy',
//     'data protection',
//     'personal data',
//     'user privacy',
//   ],
//   alternates: {
//     canonical: 'https://faos.asia/privacy',
//   },

//   openGraph: {
//     title: `Privacy Policy | ${siteConfig.title}`,
//     description:
//       'Learn how FAOS collects, uses, and protects your personal data.',
//     url: 'https://faos.asia/privacy',
//     siteName: siteConfig.name,
//     type: 'article',
//     images: [
//       {
//         url: OG_IMAGE,
//         width: 1200,
//         height: 630,
//         alt: 'FAOS Privacy Policy',
//       },
//     ],
//   },

//   twitter: {
//     card: 'summary_large_image',
//     title: `Privacy Policy | ${siteConfig.title}`,
//     description:
//       'Learn how FAOS collects, uses, and protects your personal data.',
//     images: [OG_IMAGE],
//   },
// }

export default function Privacy() {
  return (
    <>
      <h1 className='sr-only'>Privacy Policy</h1>
      <PrivacyClient />
    </>
  )
}
