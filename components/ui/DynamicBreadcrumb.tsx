import { Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import React from 'react'

import { cn } from '@/utils'

interface BreadcrumbStep {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbStep[]
  className?: string
}

const DynamicBreadcrumb = ({ items, className }: Props) => {
  return (
    <Breadcrumbs className={cn('font-semibold', className)}>
      {items.map((item) => (
        <BreadcrumbItem key={item.href || item.label} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  )
}

export { DynamicBreadcrumb }
