import { getUsdExchangeRates } from './exchange-rate'

export const convertFromUsd = async (
  usdValue: number,
  targetCurrency: string,
): Promise<number> => {
  if (targetCurrency === 'USD') return usdValue

  const rates = await getUsdExchangeRates()
  const rate = rates[targetCurrency]

  if (!rate) {
    return usdValue
  }

  return usdValue * rate
}
