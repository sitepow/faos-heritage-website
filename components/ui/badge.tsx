import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-neutral-400 focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#ba8c25] text-white shadow-xs hover:bg-[#a3791d]',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50',
        destructive:
          'border-transparent bg-red-500 text-white shadow-xs hover:bg-red-600',
        outline: 'text-foreground border-neutral-200 dark:border-neutral-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
