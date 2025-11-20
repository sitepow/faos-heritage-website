import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'

import { ArticleCard } from '../card/article'

import { Carousel } from '@/components/carousel'
import { NEWS_CONSTANT } from '@/utils/const'

const ArticleSection = () => {
  return (
    <Card fullWidth>
      <CardHeader className='justify-between'>
        <span className='font-bold'>ข่าวสารน่ารู้</span>
        <Button variant='light'>ดูทั้งหมด</Button>
      </CardHeader>

      <CardBody>
        <Carousel slidesToScroll>
          {NEWS_CONSTANT.map((news) => (
            <ArticleCard key={news.id} {...news} />
          ))}
        </Carousel>
      </CardBody>
    </Card>
  )
}

export { ArticleSection }
