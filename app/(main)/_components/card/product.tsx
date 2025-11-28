/* eslint-disable no-nested-ternary */
'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'
import { Skeleton } from '@heroui/skeleton'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { ProductItem } from '@/actions/product'
import type { FC } from 'react'

import { StarRating } from '../star-rating'

import { Price } from '@/components/price'
import { createSlug } from '@/utils/helper'
import { cn } from '@/utils/style'

interface Props extends ProductItem {
  className?: string
  hideIcon?: boolean
}

const ProductCard: FC<Props> = ({
  id,
  name,
  price,
  images,
  className,
  hideIcon = 'true',
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        'flex size-full w-64 flex-none flex-col border border-divider md:min-w-72',
        className,
      )}
      shadow='none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className='relative overflow-hidden p-0'>
        <Link className='size-full' href={`/product/${createSlug(name, id)}`}>
          <Image
            alt={name}
            className='size-full object-cover'
            classNames={{
              wrapper: 'w-full',
            }}
            height={250}
            radius='none'
            src={
              images && images.length > 1
                ? isHovered
                  ? images[1].url
                  : images[0].url
                : images?.[0]?.url || '/placeholder.svg'
            }
            width='100%'
          />
        </Link>

        {isHovered && (
          <Alert
            className='absolute bottom-0 z-[60]'
            description='คลิกเพื่อดูรายละเอียดสินค้า'
            radius='none'
          />
        )}
      </CardHeader>

      <CardBody>
        <Price price={price} unit='ตัว' />
        <h4 className='line-clamp-2 text-lg font-bold'>{name}</h4>
        <StarRating rate={5} />
      </CardBody>

      {!hideIcon && (
        <CardFooter className='justify-center border-t border-divider'>
          <Button
            startContent={<ShoppingCartIcon className='text-default-500' />}
            variant='light'
          />
          <Button
            startContent={<HeartIcon className='text-default-500' />}
            variant='light'
          />
        </CardFooter>
      )}
    </Card>
  )
}

const ProductCardSkeleton = () => {
  return (
    <Skeleton className='size-full rounded-xl supports-[display:flex]:min-w-72'>
      <div className='h-80 rounded-xl bg-default-300' />
    </Skeleton>
  )
}

export { ProductCard, ProductCardSkeleton }
