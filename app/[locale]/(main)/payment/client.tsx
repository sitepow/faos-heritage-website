/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Accordion, AccordionItem } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { SectionHeader } from '@/components/heading'

export const PaymentClient = () => {
  const t = useTranslations('Payment')

  const renderRichText = (key: string) =>
    t.rich(key, {
      important: (chunks) => (
        <span className='decoration-primary text-default-700'>{chunks}</span>
      ),
    })

  return (
    <section className='container mx-auto flex flex-col items-center justify-center gap-4 p-5 text-center'>
      <SectionHeader
        description={t('Header.description')}
        title={t('Header.title')}
      />

      <div className='mx-auto w-full'>
        <Accordion variant='splitted'>
          <AccordionItem
            key='1'
            aria-label={t('HowToShop.ariaLabel')}
            title={t('HowToShop.title')}
          >
            <div className='text-default-500 text-left'>
              <p>{renderRichText('HowToShop.step1')}</p>
              <p>{renderRichText('HowToShop.step2')}</p>
              <p>{renderRichText('HowToShop.step3')}</p>
              <p>{renderRichText('HowToShop.step4')}</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='2'
            aria-label={t('CardPayment.ariaLabel')}
            title={t('CardPayment.title')}
          >
            <div className='text-default-500 text-left'>
              <p>{t('CardPayment.description')}</p>
              <p>{renderRichText('CardPayment.acceptedCards')}</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='3'
            aria-label={t('QRCodePayment.ariaLabel')}
            title={t('QRCodePayment.title')}
          >
            <div className='text-default-500 text-left'>
              <p>{t('QRCodePayment.description')}</p>
              <p>{renderRichText('QRCodePayment.method')}</p>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
