import { Card, CardBody, CardHeader } from '@heroui/card'

import { Favorite } from '../favorite'

const FavoriteCard = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>รายการโปรด</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <Favorite />
        <Favorite />
      </CardBody>
    </Card>
  )
}

export { FavoriteCard }
