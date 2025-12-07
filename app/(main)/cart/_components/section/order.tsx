'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { useMemo } from 'react'

import type { ComponentProps, FC } from 'react'

import { useCartStore } from '../../store'

import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

const OrderSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  const { carts } = useCartStore()

  const { subTotal, shippingCost, total } = useMemo(() => {
    const subTotal =
      carts?.reduce((sum, cart) => {
        const variants = cart?.product?.variants ?? []
        const variant = variants.find((v) => v.id === cart?.variantId)

        const price = variant?.price ?? cart?.product?.price ?? 0

        return sum + price * cart.quantity
      }, 0) ?? 0

    const shippingCost = 0
    const total = subTotal + shippingCost

    return { subTotal, shippingCost, total }
  }, [carts])

  return (
    <Card fullWidth className={cn(className, 'h-fit')} {...props}>
      <CardBody className='gap-3'>
        <span className='w-fit border-b border-primary-website pb-1 font-bold'>
          รายละเอียดการชำระเงิน
        </span>

        <SummaryRow label='ราคารวม' value={subTotal} />
        <SummaryRow label='ค่าจัดส่ง' value={shippingCost} />

        <div className='flex items-center justify-between pt-1'>
          <span className='font-bold'>ราคารวมสุทธิ :</span>
          <span className='text-2xl font-bold text-primary-website'>
            {formatCurrency(total)}
          </span>
        </div>
      </CardBody>

      <CardFooter>
        <Button fullWidth isDisabled variant='faded'>
          ดำเนินการต่อ
        </Button>
      </CardFooter>
    </Card>
  )
}

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex justify-between text-default-500'>
    <span>{label}</span>
    <span>{formatCurrency(value)}</span>
  </div>
)

export { OrderSection }
