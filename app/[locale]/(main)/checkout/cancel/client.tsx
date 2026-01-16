'use client'

import { XCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useQueryParams } from '@/hooks/useQueryParams'

export const CancelClient = () => {
  const t = useTranslations('CancelPage')
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <XCircleIcon className='text-default-500 size-10' />
        <h1 className='text-2xl'>{t('title')}</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        <p>{t('description')}</p>
        {orderId && (
          <>
            {t('referenceText')}{' '}
            <span className='text-primary font-semibold underline'>
              {orderId}
            </span>{' '}
            {t('contactText')}
          </>
        )}
      </span>
    </section>
  )
}
