'use client'

import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { SectionHeader } from '../ui/SectionHeader'

import { useFaqs } from '@/features/faq/hook'

interface FaqItemProps {
  title: string
  link: string
}

const FaqItem = ({ title, link }: FaqItemProps) => {
  return (
    <Link
      className='flex w-full flex-wrap justify-between lg:w-1/2'
      href={link!}
      target='_blank'
    >
      <span className='cursor-pointer text-lg tracking-tight opacity-70 hover:opacity-100 sm:text-xl'>
        {title}
      </span>

      <ArrowUpRightIcon />
    </Link>
  )
}

const FaqSection = () => {
  const t = useTranslations('shared.faq')
  const locale = useLocale()
  const { data: faqs } = useFaqs(locale)

  return (
    <section className='flex flex-col gap-5'>
      <SectionHeader description={t('description')} title={t('title')} />

      <div className='flex flex-col items-center gap-2.5'>
        {faqs?.map((faq, idx) => {
          if (!faq) {
            return null
          }

          const localization = faq.localizations?.[0]
          const faqLink = `/faq/${faq.slug}`

          return (
            <FaqItem
              key={faq.id || idx}
              link={faqLink}
              title={localization?.title!}
            />
          )
        })}
      </div>
    </section>
  )
}

export { FaqSection }
