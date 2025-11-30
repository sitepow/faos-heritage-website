import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { CopyIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import { useProductStore } from '../../store'

import { Price } from '@/components/price'
import { Quantity } from '@/components/quantity'
import { cn } from '@/utils/style'

const CartSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  const { product } = useProductStore()

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className='flex flex-col items-start gap-4'>
        <Price price={product?.price!} />
        <div className='flex w-full items-center gap-4'>
          <Quantity />
          <Button
            fullWidth
            startContent={<ShoppingCartIcon className='text-default-500' />}
            variant='faded'
          >
            ใส่ตระกร้า
          </Button>
        </div>
      </CardHeader>

      <CardBody className='gap-4'>
        <div className='flex justify-center gap-4 border-y border-divider py-2.5'>
          <div className='flex cursor-pointer gap-2'>
            <HeartIcon className='text-default-500' />
            <span>รายการโปรด</span>
          </div>
          <div className='flex cursor-pointer gap-2'>
            <CopyIcon className='text-default-500' />
            <span>เปรียบเทียบ</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { CartSection }
