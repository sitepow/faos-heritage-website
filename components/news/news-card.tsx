import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Button,
} from '@heroui/react'
import Link from 'next/link'

import type { NewsItem } from '@/types'
import type { FC } from 'react'

import { createSlug } from '@/utils/slug'

const NewsCard: FC<NewsItem> = ({ id, description, name, image }) => {
  return (
    <Card fullWidth className='w-full flex-none md:w-96' shadow='none'>
      <CardHeader>
        <Image
          className='size-full object-cover'
          classNames={{
            wrapper: 'w-full',
          }}
          height={250}
          src={image ?? '/placeholder.svg'}
          width='100%'
        />
      </CardHeader>

      <CardBody className='flex-col gap-5'>
        <span className='font-bold'>{name}</span>

        <span>{description}</span>
      </CardBody>

      <CardFooter>
        <Link href={`/articles/${createSlug(name, id)}`}>
          <Button>อ่านต่อ</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export { NewsCard }
