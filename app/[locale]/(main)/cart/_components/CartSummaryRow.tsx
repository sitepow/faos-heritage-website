import { useExchangeRate } from '@/features/exchange-rate/hook'
import { cn, formatCurrency } from '@/utils'

type Props = {
  label: string
  value: number
  variant?: 'default' | 'danger' | 'primary'
  type?: 'currency' | 'weight'
}

const CartSummaryRow = ({
  label,
  value,
  variant = 'default',
  type = 'currency',
}: Props) => {
  const { currencyOptions } = useExchangeRate()

  const isDanger = variant === 'danger'
  const isPrimary = variant === 'primary'

  const renderValue = () => {
    if (type === 'weight') {
      const kg = value / 1000
      return `${kg.toFixed(2)} kg`
    }

    return formatCurrency(value, currencyOptions)
  }

  return (
    <div
      className={cn(
        'border-default-100 flex justify-between border-b pb-1',
        isDanger && 'text-danger border-dashed',
        isPrimary && 'text-primary border-none pt-1 text-lg font-bold',
        !isDanger && !isPrimary && 'text-default-500',
      )}
    >
      <span>
        {label} {isPrimary ? ':' : ''}
      </span>
      <span className={cn(isPrimary && 'text-2xl')}>
        {isDanger && '-'}
        {renderValue()}
      </span>
    </div>
  )
}

export { CartSummaryRow }
