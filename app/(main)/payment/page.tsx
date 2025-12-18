import type { Metadata } from 'next'

import PaymentClient from './payment.client'

import { siteConfig } from '@/config/site'
import { OG_IMAGE } from '@/utils/helper'

export const metadata: Metadata = {
  title: `Payments FAOS | ${siteConfig.title}`,
  description:
    'Learn about FAOS payment methods including credit card and PromptPay QR code. Secure payments powered by Stripe.',
  keywords: [
    'FAOS payment',
    'credit card payment',
    'PromptPay',
    'Stripe checkout',
    'secure payment',
  ],
  alternates: {
    canonical: 'https://faos.asia/payment',
  },

  openGraph: {
    title: `Payments FAOS | ${siteConfig.title}`,
    description:
      'Secure payment methods including credit card and PromptPay QR code.',
    url: 'https://faos.asia/payment',
    siteName: siteConfig.name,
    type: 'article',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'FAOS secure payment methods',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Payments | ${siteConfig.title}`,
    description:
      'Secure payment methods including credit card and PromptPay QR code.',
    images: [OG_IMAGE],
  },
}

const PaymentPage = () => {
  return (
    <>
      <h1 className='sr-only'>Payment Methods at FAOS</h1>
      <PaymentClient />
    </>
  )
}

export default PaymentPage
