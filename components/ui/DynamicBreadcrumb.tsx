import { Breadcrumbs, BreadcrumbItem } from '@heroui/react'
import React from 'react'

import { cn } from '@/utils'

interface BreadcrumbStep {
  label: string
  href?: string
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbStep[]
  className?: string
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
  items,
  className,
}) => {
  return (
    <Breadcrumbs className={cn('container mx-auto font-semibold', className)}>
      {items.map((item) => (
        <BreadcrumbItem key={item.href || item.label} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  )
}

export default DynamicBreadcrumb
