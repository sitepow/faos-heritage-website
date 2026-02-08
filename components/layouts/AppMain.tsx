import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/utils'

interface AppMainProps extends ComponentProps<'main'> {
  className?: string
  children?: ReactNode
}

const AppMain = ({ className, children, ...props }: AppMainProps) => {
  return (
    <main
      className={cn('mx-auto flex w-full flex-grow flex-col gap-5', className)}
      {...props}
    >
      {children}
    </main>
  )
}

export { AppMain }
