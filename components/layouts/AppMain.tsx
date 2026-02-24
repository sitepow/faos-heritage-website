'use client'

// import { Alert } from '@heroui/react'
// import { useTranslations } from 'next-intl'

import type { ComponentProps, ReactNode } from 'react'

import { AppSection } from './AppSection'
import { Container } from './Container'

import { useScrollRestoration } from '@/hooks/useScrollRestoration'
import { cn } from '@/utils'

interface AppMainProps extends ComponentProps<'div'> {
  className?: string
  children?: ReactNode
}

const AppMain = ({ className, children, ...props }: AppMainProps) => {
  useScrollRestoration()

  // const t = useTranslations('alert')

  return (
    <Container className={cn('p-5', className)} {...props}>
      <AppSection>
        {/* <Alert
          classNames={{
            base: 'max-w-full overflow-hidden',
            mainWrapper: 'overflow-hidden',
            description: 'whitespace-pre-wrap break-all word-break-break-word',
          }}
          color='warning'
          description={t('development.description')}
          title={t('development.title')}
          variant='faded'
        /> */}
        {children}
      </AppSection>
    </Container>
  )
}

export { AppMain }
