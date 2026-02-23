'use client'

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
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <BreadcrumbItem
            key={item.href || item.label}
            classNames={{
              item: cn(
                isLast && 'block max-w-[200px] truncate md:max-w-[400px]',
              ),
            }}
            href={item.href}
          >
            {item.label}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumbs>
  )
}

export { DynamicBreadcrumb }
