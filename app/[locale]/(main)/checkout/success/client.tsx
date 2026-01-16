'use client'

import { CheckCircle2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useQueryParams } from '@/hooks/useQueryParams'

export const SuccessClient = () => {
  const t = useTranslations('SuccessPage')
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <CheckCircle2Icon className='text-default-500 size-10' />
        <h1 className='text-2xl'>{t('title')}</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        {t('description')}
        {orderId && (
          <>
            {' '}
            {t('referenceText')}{' '}
            <span className='text-primary underline'>{orderId}</span>{' '}
            {t('contactText')}
          </>
        )}
      </span>
    </section>
  )
}
