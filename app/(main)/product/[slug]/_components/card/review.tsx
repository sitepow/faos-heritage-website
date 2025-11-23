import { Card, CardBody, CardHeader } from '@heroui/card'

import { SubHeader } from '@/app/(main)/_components/section/header'

const ReviewCard = () => {
  return (
    <Card className='lg:border-l lg:border-divider' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeader title='รีวิวสินค้า' />
      </CardHeader>
      <CardBody>
        <span>ยังไม่มี ความคิดเห็น สำหรับสินค้านี้</span>
      </CardBody>
    </Card>
  )
}

export { ReviewCard }
