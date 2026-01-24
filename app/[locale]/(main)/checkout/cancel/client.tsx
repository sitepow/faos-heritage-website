'use client'

import { Alert } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { useQueryParams } from '@/hooks/useQueryParams'

export const CancelClient = () => {
  const t = useTranslations('CancelPage')
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='container mx-auto flex flex-col items-center justify-center gap-3 p-5'>
      <Alert
        variant='faded'
        color='danger'
        title={t('title')}
        description={
          <span>
            <span>{t('description')}</span>
            {orderId && (
              <>
                {t('referenceText')}{' '}
                <span className='underline'>{orderId}</span> {t('contactText')}
              </>
            )}
          </span>
        }
      />
    </section>
  )
}
