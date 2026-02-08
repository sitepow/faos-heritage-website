'use client'

import { Alert } from '@heroui/react'
import { useTranslations } from 'next-intl'

import type { ComponentProps, ReactNode } from 'react'

import { Container } from './Container'

import { cn } from '@/utils'

interface AppMainProps extends ComponentProps<'main'> {
  className?: string
  children?: ReactNode
}

const AppMain = ({ className, children, ...props }: AppMainProps) => {
  const t = useTranslations('alert')

  return (
    <main
      className={cn('mx-auto flex w-full flex-grow flex-col gap-5', className)}
      {...props}
    >
      <Container className='py-5'>
        <Alert
          color='warning'
          description={t('development.description')}
          title={t('development.title')}
        />
      </Container>
      {children}
    </main>
  )
}

export { AppMain }
