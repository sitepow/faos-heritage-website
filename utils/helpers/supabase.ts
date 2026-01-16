export const getPathFromPublicUrl = (url: string) => {
  const marker = '/object/public/uploads/'

  return url.split(marker)[1]
}

export const toStripeAmount = (amount: number, currency: string) => {
  const c = currency.toUpperCase()

  if (['JPY', 'VND', 'KRW'].includes(c)) {
    return Math.round(amount)
  }

  if (c === 'ISK') {
    return Math.round(Math.round(amount) * 100)
  }

  return Math.round(amount * 100)
}
