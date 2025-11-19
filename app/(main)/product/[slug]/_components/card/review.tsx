import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'

const ReviewCard = () => {
  return (
    <Card shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <span>รีวิวสินค้า</span>
        <Divider />
      </CardHeader>
      <CardBody>
        <span>ยังไม่มี ความคิดเห็น สำหรับสินค้านี้</span>
      </CardBody>
    </Card>
  )
}

export { ReviewCard }
