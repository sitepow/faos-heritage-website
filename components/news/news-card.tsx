import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'

import type { NewsItem } from '@/types'
import type { FC } from 'react'

const NewsCard: FC<NewsItem> = ({ id, description, title, image, link }) => {
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
        <span className='font-bold'>{title}</span>

        <span>{description}</span>
      </CardBody>

      <CardFooter>
        <Button>อ่านต่อ</Button>
      </CardFooter>
    </Card>
  )
}

export { NewsCard }
