'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'

import type { FC } from 'react'

interface Props {
  categoryName?: string
}

const CategoryBreadcrumbs: FC<Props> = ({ categoryName }) => {
  return (
    <Breadcrumbs className='font-bold'>
      <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
      <BreadcrumbItem>{categoryName ?? 'ไม่มีหมวดหมู่'}</BreadcrumbItem>
    </Breadcrumbs>
  )
}

export { CategoryBreadcrumbs }
