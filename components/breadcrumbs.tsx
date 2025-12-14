'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'

import type { FC } from 'react'

interface Props {
  categoryName?: string
}

const CategoryBreadcrumbs: FC<Props> = ({ categoryName }) => {
  return (
    <Breadcrumbs className='font-bold'>
      <BreadcrumbItem>Homepage</BreadcrumbItem>
      <BreadcrumbItem>{categoryName ?? 'No category'}</BreadcrumbItem>
    </Breadcrumbs>
  )
}

export { CategoryBreadcrumbs }
