import { Card, CardBody, CardHeader } from '@heroui/card'

import { SubHeader } from '@/app/(main)/_components/section/header'

const ReviewCard = () => {
  return (
    <Card className='col-span-2 lg:border-l lg:border-divider' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeader title='รีวิวสินค้า' />
      </CardHeader>
      <CardBody>
        <p>ยังไม่มี ความคิดเห็น สำหรับสินค้านี้</p>
      </CardBody>
    </Card>
  )
}

export { ReviewCard }
