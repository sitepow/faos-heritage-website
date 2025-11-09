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
import clsx from 'clsx'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { Product } from '@/types'
import type { FC } from 'react'

import { ProductRating } from './product-rating'

import { PriceRange } from '@/components/price-range'
import { createSlug } from '@/utils/slug'

interface Props extends Product {
  className?: string
  hideIcon?: boolean
}

const ProductCard: FC<Props> = ({
  id,
  name,
  price,
  image,
  className,
  hideIcon = 'true',
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/product/${createSlug(name, id)}`}>
      <Card
        className={clsx(
          'flex size-full w-64 flex-none cursor-pointer flex-col border border-divider md:min-w-72',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className='relative overflow-hidden p-0'>
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

          {isHovered && (
            <Alert
              className='absolute bottom-0 z-[60]'
              description='คลิกเพื่อดูรายละเอียดสินค้า'
              radius='none'
            />
          )}
        </CardHeader>

        <CardBody>
          <PriceRange price={price} />
          <h4 className='truncate text-lg font-bold'>{name}</h4>
          <ProductRating rate={4} />
        </CardBody>

        {!hideIcon && (
          <CardFooter className='justify-end'>
            <Button startContent={<ShoppingCartIcon />}>ใส่รถเข็น</Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export { ProductCard }
