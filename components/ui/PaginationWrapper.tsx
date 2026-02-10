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
  if (total <= 1) {
    return null
  }

  return (
    <Pagination
      showControls
      className={cn('mx-auto my-5', className)}
      classNames={{
        item: 'bg-default-100 text-default-400 shadow-none cursor-pointer',
        cursor:
          'bg-secondary text-primary font-bold border-default-100 border ',
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
