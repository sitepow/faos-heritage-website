'use client'

import { Card, CardBody, Button } from '@heroui/react'
import { ArrowLeft, ClockIcon } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const AffiliateWaitingStatus = () => {
  const t = useTranslations('affiliate_register.waiting')

  return (
    <Card className='mx-auto max-w-2xl' shadow='none'>
      <CardBody className='flex flex-col items-center gap-6 py-10 text-center'>
        <div className='flex size-20 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]'>
          <ClockIcon size={40} />
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl font-bold sm:text-3xl'>{t('title')}</h1>
          <p className='text-foreground/70 mx-auto max-w-[80%]'>
            {t('description')}
          </p>
        </div>

        <div className='mx-auto flex w-full flex-col gap-3 px-6 sm:w-1/2 sm:flex-row sm:px-0'>
          <Button
            as={Link}
            className='flex-1 font-bold'
            href='/'
            startContent={<ArrowLeft size={18} />}
            variant='bordered'
          >
            {t('backToHome')}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export { AffiliateWaitingStatus }
