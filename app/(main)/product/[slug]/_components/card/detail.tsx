import { Card, CardBody, CardHeader } from '@heroui/card'

import { useProductStore } from '../../store'

import { SubHeader } from '@/app/(main)/_components/section/header'

const DetailCard = () => {
  const { product } = useProductStore()

  return (
    <Card className='col-span-2' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeader title='รายละเอียด' />
      </CardHeader>
      <CardBody>
        <p className='whitespace-pre-line'>{product?.description}</p>
      </CardBody>
    </Card>
  )
}

export { DetailCard }
