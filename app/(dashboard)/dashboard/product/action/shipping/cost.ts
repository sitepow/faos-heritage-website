'use server'

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
}: CalculateShippingCostParams): Promise<number> => {
  try {
    if (!items?.length || !countryCode) {
      return 0
    }

    const totalWeightKg =
      items.reduce((sum, item) => sum + item.quantity * item.weight, 0) / 1000

    if (totalWeightKg <= 0) {
      return 0
    }

    const country = await prisma.shippingCountry.findUnique({
      where: { countryCode },
    })

    if (!country) {
      return 0
    }

    const tier = await prisma.shippingWeightTier.findFirst({
      where: {
        countryCode,
        minWeight: { lte: totalWeightKg },
        maxWeight: { gte: totalWeightKg },
      },
      orderBy: {
        minWeight: 'desc',
      },
    })

    const baseRate = Number(country.baseRate)
    const countryPricePerKg = Number(country.pricePerKg)

    if (Number.isNaN(baseRate) || Number.isNaN(countryPricePerKg)) {
      return 0
    }

    const tierPricePerKg =
      tier && !Number.isNaN(Number(tier.pricePerKg))
        ? Number(tier.pricePerKg)
        : countryPricePerKg

    const shippingCost = baseRate + totalWeightKg * tierPricePerKg

    return Math.ceil(shippingCost)
  } catch {
    return 0
  }
}
