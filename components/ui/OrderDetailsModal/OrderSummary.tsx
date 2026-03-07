import { Divider } from '@heroui/react'

import { useExchangeRate } from '@/features/exchange-rate/exchange-rate.hook'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

interface Props {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  labels: {
    total: string
    discount: string
    shipping: string
    net: string
  }
}

const OrderSummary = ({
  subtotal,
  discount,
  shippingCost,
  total,
  labels,
}: Props) => {
  const { currencyOptions } = useExchangeRate()
  const grossSubtotal = Number(subtotal) + Number(discount || 0)

  const format = (value: number) =>
    formatCurrency(value, { ...currencyOptions, skipCalculation: true })

  return (
    <div className='border-default-100 space-y-2 rounded-xl border p-4'>
      <div className='flex justify-between text-sm'>
        <span className='text-default-500'>{labels.total}</span>
        <span className={cn(discount > 0 && 'text-default-400 line-through')}>
          {format(grossSubtotal)}
        </span>
      </div>

      {discount > 0 && (
        <div className='text-danger flex justify-between text-sm font-medium'>
          <span>{labels.discount}</span>
          <span>-{format(discount)}</span>
        </div>
      )}

      <div className='flex justify-between text-sm'>
        <span className='text-default-500'>{labels.shipping}</span>
        <span>{format(shippingCost)}</span>
      </div>

      <Divider className='bg-default-100 my-1' />

      <div className='text-primary flex justify-between text-lg font-bold'>
        <span>{labels.net}</span>
        <span>{format(total)}</span>
      </div>
    </div>
  )
}

export { OrderSummary }
