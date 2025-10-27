'use client'

import { Alert } from '@heroui/alert'
import { Card, CardHeader, CardBody } from '@heroui/card'
import { Image } from '@heroui/image'
import clsx from 'clsx'
import { useState } from 'react'

import type { Product } from '@/types'
import type { FC } from 'react'

import { ProductRating } from './product-rating'

import { formatCurrency } from '@/utils/number'

interface Props extends Product {
  className?: string
}

const ProductCard: FC<Props> = ({ id, name, price, image, className }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={clsx(
        'border-divider flex size-full w-64 flex-none cursor-pointer flex-col border md:min-w-72',
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
            color='primary'
            description='คลิกเพื่อดูรายละเอียดสินค้า'
            radius='none'
          />
        )}
      </CardHeader>

      <CardBody>
        <p className='text-default-500 text-lg font-bold'>
          {formatCurrency(price)}
        </p>
        <h4 className='truncate text-lg font-bold'>{name}</h4>
        <ProductRating rate={4} />
      </CardBody>
    </Card>
  )
}

export { ProductCard }
