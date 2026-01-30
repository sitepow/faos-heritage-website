import { CURRENCY } from '@/constants'

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

const toStripeMinorUnit = (amount: number, currency: string): number => {
  const code = currency.toUpperCase()

  if (['JPY', 'VND', 'KRW'].includes(code)) {
    return Math.round(amount)
  }

  if (code === 'ISK') {
    return Math.round(amount) * 100
  }

  return Math.round(amount * 100)
}

export { getExchangeRates, toStripeMinorUnit }
