'use client'

import { Card } from '@heroui/react'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const BorderedCard = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Card>) => {
  return (
    <Card
      fullWidth
      className={cn('border-default-100 border', className)}
      radius='sm'
      shadow='none'
      {...props}
    >
      {children}
    </Card>
  )
}

export { BorderedCard }
