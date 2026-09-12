'use client'

import { ArrowUpRightIcon, ChevronDown, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { SectionHeader } from '../ui/SectionHeader'

import { useFaqs } from '@/features/faq/hook'
import { useGsapReveal } from '@/hooks/useGsap'

interface FaqItemProps {
  isOpen: boolean
  link: string
  onToggle: () => void
  title: string
}

const FaqItem = ({ isOpen, link, onToggle, title }: FaqItemProps) => {
  const tLanding = useTranslations('landing.faq')

  return (
    <div className='w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-neutral-900/60'>
      <button
        aria-expanded={isOpen}
        className='flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50'
        onClick={onToggle}
      >
        <div className='flex items-center gap-3.5'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400'>
            <HelpCircle size={18} />
          </div>
          <span className='text-base font-semibold tracking-tight text-neutral-800 sm:text-lg dark:text-neutral-200'>
            {title}
          </span>
        </div>

        <div
          className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
          }`}
        >
          <ChevronDown size={20} />
        </div>
      </button>

      {isOpen && (
        <div className='border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 dark:border-white/5 dark:bg-neutral-950/40'>
          <p className='text-sm leading-relaxed text-neutral-600 dark:text-neutral-300'>
            {tLanding('guideText')}
          </p>
          <div className='mt-3'>
            <Link
              className='inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300'
              href={link}
            >
              <span>{tLanding('readAllLink')}</span>
              <ArrowUpRightIcon size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const FaqSection = () => {
  const t = useTranslations('shared.faq')
  const locale = useLocale()
  const { data: faqs } = useFaqs(locale)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const containerRef = useGsapReveal({ stagger: 0.1, y: 25 })

  return (
    <section ref={containerRef} className='w-full py-10'>
      <div className='gsap-reveal mb-8'>
        <SectionHeader description={t('description')} title={t('title')} />
      </div>

      <div className='mx-auto flex max-w-3xl flex-col gap-3'>
        {faqs?.map((faq, idx) => {
          if (!faq) {
            return null
          }

          const localization = faq.localizations?.[0]
          const faqLink = `/faq/${faq.slug}`

          return (
            <div key={faq.id || idx} className='gsap-reveal'>
              <FaqItem
                isOpen={openIndex === idx}
                link={faqLink}
                title={localization?.title!}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { FaqSection }
