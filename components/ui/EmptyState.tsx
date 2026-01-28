'use client'

import { Alert } from '@heroui/react'

import type { PropsWithChildren } from 'react'

import { cn } from '@/utils/style'

interface EmptyStateProps extends PropsWithChildren {
  title?: string
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  variant?: 'solid' | 'faded' | 'bordered' | 'flat'
  className?: string
}

const EmptyState = ({
  title = 'Not found',
  color = 'warning',
  variant = 'faded',
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'container mx-auto flex h-full items-center justify-center p-5',
        className,
      )}
    >
      <Alert color={color} title={title} variant={variant}>
        {children}
      </Alert>
    </div>
  )
}

export { EmptyState }
