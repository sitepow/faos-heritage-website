import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { cn, formatCurrency } from '@/utils'

type Props = {
  label: string
  value: number
  variant?: 'default' | 'danger' | 'primary'
}

const CartSummaryRow = ({ label, value, variant = 'default' }: Props) => {
  const { currencyOptions } = useExchangeRate()

  const isDanger = variant === 'danger'
  const isPrimary = variant === 'primary'

  return (
    <div
      className={cn(
        'border-default-100 flex justify-between border-b pb-1',
        isDanger && 'text-danger border-dashed italic',
        isPrimary && 'text-primary border-none pt-1 text-lg font-bold',
        !isDanger && !isPrimary && 'text-default-500',
      )}
    >
      <span>
        {label} {isPrimary ? ':' : ''}
      </span>
      <span className={cn(isPrimary && 'text-2xl')}>
        {isDanger && '-'}
        {formatCurrency(value, currencyOptions)}
      </span>
    </div>
  )
}

export { CartSummaryRow }
