import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { CopyIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'

import { PriceRange } from '@/components/price-range'
import { StockInput } from '@/components/stock-input'

const ProductAddToCartSection = () => {
  return (
    <Card>
      <CardHeader className='flex flex-col items-start gap-4'>
        <PriceRange price={250} />
        <div className='flex w-full gap-4'>
          <StockInput />
          <Button fullWidth startContent={<ShoppingCartIcon />}>
            ใส่ตระกร้า
          </Button>
        </div>
      </CardHeader>

      <CardBody className='gap-4'>
        <Divider />
        <div className='flex justify-center gap-4'>
          <div className='flex cursor-pointer gap-2'>
            <HeartIcon />
            <span>รายการโปรด</span>
          </div>
          <div className='flex cursor-pointer gap-2'>
            <CopyIcon />
            <span>เปรียบเทียบ</span>
          </div>
        </div>
        <Divider />
      </CardBody>
    </Card>
  )
}

export { ProductAddToCartSection }
