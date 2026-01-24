import { EXCHANGE_RATE_API_THB } from '@/utils/constants/currency'

type ExchangeRateResponse = {
  result: 'success'
  base_code: string
  rates: Record<string, number>
}

export const getThbExchangeRates = async () => {
  const res = await fetch(EXCHANGE_RATE_API_THB, {
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
