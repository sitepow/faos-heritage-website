import type { Metadata } from 'next'

import LazyPdfViewer from '@/components/pdf/viewer/lazy-pdf-viewer'
import { siteConfig } from '@/config/site'
import { OG_IMAGE } from '@/utils/helper'

export const metadata: Metadata = {
  title: `About FAOS | ${siteConfig.title}`,
  description:
    'Learn more about FAOS premium organic olive oil & honey. View our official product brochure and brand story.',
  keywords: [
    'FAOS',
    'organic olive oil',
    'organic honey',
    'premium olive oil',
    'brochure',
  ],
  alternates: {
    canonical: 'https://faos.asia/about',
  },
  openGraph: {
    title: 'About FAOS',
    description:
      'Premium organic olive oil & honey. View our official brochure and brand information.',
    url: 'https://faos.asia/about',
    siteName: siteConfig.name,
    type: 'article',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${siteConfig.title}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: `${siteConfig.title}`,
    images: [OG_IMAGE],
  },
}

const About = () => {
  return (
    <>
      <section className='flex justify-center'>
        <LazyPdfViewer fileUrl='/faos-organic-olive-oil-brochure.pdf' />
      </section>

      <section className='sr-only'>
        <h1>About FAOS</h1>
        <p>
          FAOS offers premium organic olive oil and honey made from 100% natural
          ingredients. This brochure presents our product range, quality
          standards, and brand philosophy.
        </p>
      </section>
    </>
  )
}

export default About
