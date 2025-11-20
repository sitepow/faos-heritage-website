'use client'

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@heroui/react'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { Product } from '@/types'
import type { FC } from 'react'

import { StarRating } from '../star-rating'

import { Price } from '@/components/price'
import { createSlug } from '@/utils/helper'
import { cn } from '@/utils/style'

interface Props extends Product {
  className?: string
  hideIcon?: boolean
}

const ProductCard: FC<Props> = ({
  id,
  name,
  price,
  unit,
  image,
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
            src={image ?? '/placeholder.svg'}
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
        <Price price={price} unit={unit} />
        <h4 className='truncate text-lg font-bold'>{name}</h4>
        <StarRating rate={4} />
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

export { ProductCard }
