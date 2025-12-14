import { Card, CardBody, CardHeader } from '@heroui/card'

import { SubHeader } from '@/app/(main)/_components/section/header'

const ReviewCard = () => {
  return (
    <Card className='col-span-2 lg:border-l lg:border-divider' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeader title='Product review' />
      </CardHeader>
      <CardBody>
        <p>There are no reviews for this product yet.</p>
      </CardBody>
    </Card>
  )
}

export { ReviewCard }
