import { EXCHANGE_RATE_API } from '@/utils/constants/currency'

type ExchangeRateResponse = {
  result: 'success'
  base_code: string
  rates: Record<string, number>
}

let rateCache: Record<string, number> | null = null
let lastFetched = 0
const CACHE_TTL = 1000 * 60 * 60

export const getUsdExchangeRates = async () => {
  const now = Date.now()

  if (rateCache && now - lastFetched < CACHE_TTL) {
    return rateCache
  }

  const res = await fetch(EXCHANGE_RATE_API)
  const data: ExchangeRateResponse = await res.json()

  if (data.result !== 'success') {
    throw new Error('Failed to fetch exchange rates')
  }

  rateCache = data.rates
  lastFetched = now

  return rateCache
}
