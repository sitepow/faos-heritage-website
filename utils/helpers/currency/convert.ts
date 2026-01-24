import { getThbExchangeRates } from './exchange'

export const convertFromThb = async (
  thbValue: number,
  targetCurrency: string,
): Promise<number> => {
  if (targetCurrency === 'THB') return thbValue

  const rates = await getThbExchangeRates()
  const rate = rates[targetCurrency]

  if (!rate) return thbValue

  return thbValue * rate
}
