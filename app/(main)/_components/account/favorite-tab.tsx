import { Card, CardBody, CardHeader } from '@heroui/card'

import { FavoriteItem } from './_components/favorite-item'

const FavoriteTab = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>รายการโปรด</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <FavoriteItem />
        <FavoriteItem />
      </CardBody>
    </Card>
  )
}

export { FavoriteTab }
