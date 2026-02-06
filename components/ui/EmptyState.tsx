'use client'

import { Alert } from '@heroui/react'

import type { PropsWithChildren } from 'react'

import { cn } from '@/utils/style'

interface EmptyStateProps extends PropsWithChildren {
  description?: string
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  variant?: 'solid' | 'faded' | 'bordered' | 'flat'
  className?: string
}

const EmptyState = ({
  description = 'Not found',
  color = 'warning',
  variant = 'faded',
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'container mx-auto flex h-full items-center justify-center',
        className,
      )}
    >
      <Alert color={color} description={description} variant={variant}>
        {children}
      </Alert>
    </div>
  )
}

export { EmptyState }
