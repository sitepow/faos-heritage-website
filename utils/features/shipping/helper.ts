import { prisma } from '@/lib/prisma'

type CalculateShippingCostParams = {
  items: {
    quantity: number
    weight: number
  }[]
  countryCode: string
}

export const calculateShippingCost = async ({
  items,
  countryCode,
}: CalculateShippingCostParams) => {
  const totalWeightKg = items.reduce(
    (sum, item) => sum + item.quantity * item.weight,
    0,
  )

  const country = await prisma.shippingCountry.findUnique({
    where: { countryCode },
  })

  if (!country) {
    throw new Error('This country is not supported')
  }

  const tier = await prisma.shippingWeightTier.findFirst({
    where: {
      countryCode,
      minWeight: { lte: totalWeightKg },
      maxWeight: { gte: totalWeightKg },
    },
  })

  const pricePerKg = tier?.pricePerKg ?? country.pricePerKg

  const shippingCost = country.baseRate + totalWeightKg * pricePerKg

  return Math.ceil(shippingCost)
}
