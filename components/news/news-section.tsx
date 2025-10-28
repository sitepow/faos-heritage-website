'use client'

import { Card, CardBody, CardHeader, Button } from '@heroui/react'
import { ArrowRight } from 'lucide-react'

import { NewsCard } from './news-card'
import { Carousel } from '../carousel/carousel'

import { NEWS_CONSTANT } from '@/utils/const'

const NewsSection = () => {
  return (
    <Card fullWidth>
      <CardHeader className='justify-between'>
        <span className='font-bold'>ข่าวสารน่ารู้</span>

        <Button
          endContent={<ArrowRight className='text-divider' />}
          variant='light'
        >
          ดูทั้งหมด
        </Button>
      </CardHeader>

      <CardBody>
        <Carousel slidesToScroll>
          {NEWS_CONSTANT.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </Carousel>
      </CardBody>
    </Card>
  )
}

export { NewsSection }
