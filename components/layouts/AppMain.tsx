'use client'

import type { ComponentProps } from 'react'

import { AppSection } from './AppSection'
import { Container } from './Container'

// import { useScrollRestoration } from '@/hooks/useScrollRestoration'
import { cn } from '@/utils'

const AppMain = ({ className, children, ...props }: ComponentProps<'main'>) => {
  // useScrollRestoration()

  return (
    <main className='flex-1' {...props}>
      <Container className={cn('p-5', className)}>
        <AppSection>{children}</AppSection>
      </Container>
    </main>
  )
}

export { AppMain }
