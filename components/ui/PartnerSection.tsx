/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { IMAGE_FALLBACK } from '@/constants'

interface SubSectionItem {
  title: string
  isShipping?: boolean
  isPayment?: boolean
  items?: string[]
}

interface PartnerItem {
  label: string
  href: string
  image?: string
}

interface FooterSection {
  title?: string
  items?: (PartnerItem | string | { image: string; href: string })[]
  isGroup?: boolean
  subSections?: SubSectionItem[]
  isShipping?: boolean
  isPayment?: boolean
  isMarketplace?: boolean
  isCertificate?: boolean
}

const PartnerSection = () => {
  const t = useTranslations('footer')

  const menuRaw = t.raw('menu') as FooterSection[]

  const partnerSection = menuRaw.find((section: FooterSection) => {
    return section.title === t('menu.3.title')
  })

  const partners = (partnerSection?.items as PartnerItem[]) || []

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='mb-8 text-center text-2xl font-bold'>
          {partnerSection?.title}
        </h2>
        <div className='grid items-center gap-8 sm:grid-cols-2 xl:grid-cols-4'>
          {partners.map((partner: PartnerItem, index: number) => {
            return (
              <Link
                key={index}
                className='flex flex-col flex-wrap items-center justify-center gap-2.5 p-4 text-center grayscale transition-all duration-300 hover:grayscale-0'
                href={partner.href}
                rel='noopener noreferrer'
                target='_blank'
              >
                <img
                  alt={partner.label}
                  className='max-h-32 w-auto bg-black object-contain'
                  height={80}
                  src={partner.image || IMAGE_FALLBACK.EMPTY}
                  width={160}
                />
                <p className='max-w-3/4 sm:max-w-2/3'>{partner.label}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PartnerSection
