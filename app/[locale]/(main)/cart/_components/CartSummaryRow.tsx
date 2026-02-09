import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { formatCurrency } from '@/utils'

type Props = {
  label: string
  value: number
}

const CartSummaryRow = ({ label, value }: Props) => {
  const {
    currencyOptions: { currency, locale, rates },
  } = useExchangeRate()

  return (
    <div className='text-default-500 border-default-100 flex justify-between border-b'>
      <span>{label}</span>
      <span>
        {formatCurrency(value, {
          currency,
          locale,
          rates,
        })}
      </span>
    </div>
  )
}

export { CartSummaryRow }
