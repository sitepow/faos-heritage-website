/* eslint-disable react/no-unstable-nested-components */
'use client'

import { useTranslations } from 'next-intl'

import { SectionHeader } from '@/components/common/heading'

export const PrivacyClient = () => {
  const t = useTranslations('Privacy')

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <SectionHeader title={t('title')} />

      <p className='text-default-500 text-left leading-relaxed sm:w-4/5 sm:text-center lg:w-1/2'>
        {t.rich('content', {
          important: (chunks) => (
            <span className='decoration-primary text-default-700 font-medium underline decoration-dotted underline-offset-4'>
              {chunks}
            </span>
          ),
        })}
      </p>
    </section>
  )
}
