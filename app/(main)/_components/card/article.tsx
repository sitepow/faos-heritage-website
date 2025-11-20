'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@heroui/react'
import Link from 'next/link'

import type { ArticleCard } from '@/types'
import type { FC } from 'react'

import { formatDate } from '@/utils/date'
import { createSlug } from '@/utils/helper'

const ArticleCard: FC<ArticleCard> = ({ id, description, name, image }) => {
  return (
    <Card
      fullWidth
      className='w-full flex-none md:w-[45%] lg:w-[30%]'
      shadow='none'
    >
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

      <CardBody className='flex-col gap-2'>
        <div className='flex flex-col'>
          <span className='text-lg font-bold'>{name}</span>
          <span className='leading-5'>(วันที่ {formatDate(new Date())})</span>
        </div>

        <span className='line-clamp-2 text-default-500'>{description}</span>
      </CardBody>

      <CardFooter>
        <Button variant='faded'>อ่านต่อ</Button>
      </CardFooter>
    </Card>
  )
}

export { ArticleCard }
