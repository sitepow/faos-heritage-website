/* eslint-disable react/no-unstable-nested-components */
'use client'

import { useTranslations } from 'next-intl'

import { SectionHeader } from '@/components/ui/SectionHeader'

export const PrivacyClient = () => {
  const t = useTranslations('Privacy')

  return (
    <section className='container mx-auto flex flex-col items-center justify-center gap-4 p-5'>
      <SectionHeader title={t('title')} />

      <p className='text-default-500 leading-relaxed'>
        {t.rich('content', {
          important: (chunks) => <span>{chunks}</span>,
        })}
      </p>
    </section>
  )
}
