'use client'
import { Card, CardBody, CardHeader } from '@heroui/react'

import { NewsCard } from './news-card'
import { Carousel } from '../carousel/carousel'

import { NEWS_CONSTANT } from '@/utils/const'

const NewsSection = () => {
  return (
    <Card fullWidth>
      <CardHeader className='justify-between'>
        <span className='font-bold'>ข่าวสารน่ารู้</span>

        <span className='cursor-pointer hover:underline'>ดูทั้งหมด</span>
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
