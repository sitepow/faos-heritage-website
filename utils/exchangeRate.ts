import { CURRENCY } from '@/constants/app'

type ExchangeRateResponse = {
  result: 'success'
  base_code: string
  rates: Record<string, number>
}

const getExchangeRates = async () => {
  const res = await fetch(CURRENCY.EXCHANGE_API_THB, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch exchange rates')
  }

  const data: ExchangeRateResponse = await res.json()

  if (data.result !== 'success') {
    throw new Error('Failed to fetch exchange rates')
  }

  return data.rates
}

export { getExchangeRates }
