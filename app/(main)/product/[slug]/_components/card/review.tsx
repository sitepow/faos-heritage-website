import { Card, CardBody, CardHeader } from '@heroui/card'

const ReviewCard = () => {
  return (
    <Card className='lg:border-l lg:border-divider' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <span className='w-fit border-b border-divider pb-1'>รีวิวสินค้า</span>
      </CardHeader>
      <CardBody>
        <span>ยังไม่มี ความคิดเห็น สำหรับสินค้านี้</span>
      </CardBody>
    </Card>
  )
}

export { ReviewCard }
