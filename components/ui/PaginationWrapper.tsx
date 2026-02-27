/* eslint-disable no-unused-vars */
'use client'

import { Pagination } from '@heroui/react'

import { cn } from '@/utils'

interface Props {
  page: number
  total: number
  onChange: (page: number) => void
  className?: string
}

const PaginationWrapper = ({ page, total, onChange, className }: Props) => {
  return (
    <Pagination
      showControls
      className={cn('mx-auto my-5', className)}
      classNames={{
        item: 'bg-default-100 text-white shadow-none cursor-pointer',
        cursor:
          'bg-secondary text-white font-bold border-default-100 border shadow-lg',
        next: 'bg-default-100 text-default-400 cursor-pointer',
        prev: 'bg-default-100 text-default-400 cursor-pointer',
      }}
      page={page}
      size='sm'
      total={total}
      variant='flat'
      onChange={onChange}
    />
  )
}

export { PaginationWrapper }
