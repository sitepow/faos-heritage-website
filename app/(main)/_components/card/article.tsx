'use client'

import { Card, CardBody, CardHeader, Image } from '@heroui/react'
import Link from 'next/link'

import type { ArticleCard } from '@/types'
import type { FC } from 'react'

import { formatDate } from '@/utils/date'
import { createSlug } from '@/utils/helper'

const ArticleCard: FC<ArticleCard> = ({ id, description, name, image }) => {
  return (
    <Card fullWidth className='w-full flex-none md:w-[40%]' shadow='none'>
      <CardHeader>
        <Link className='size-full' href={`/article/${createSlug(name, id)}`}>
          <Image
            className='size-full object-cover'
            classNames={{
              wrapper: 'w-full',
            }}
            height={250}
            src={image ?? '/placeholder.svg'}
            width='100%'
          />
        </Link>
      </CardHeader>

      <CardBody className='flex-col'>
        <span className='text-lg font-bold'>{name}</span>
        <span className='mb-3 text-default-500'>
          วันที่ {formatDate(new Date())}
        </span>
        <span className='text-default-500'>{description}</span>
      </CardBody>
    </Card>
  )
}

export { ArticleCard }
