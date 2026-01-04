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

    const rawWeightKg =
      items.reduce((sum, item) => sum + item.quantity * item.weight, 0) / 1000

    if (rawWeightKg <= 0) {
      return 0
    }

    const billableWeight = Math.ceil(rawWeightKg)

    const country = await prisma.shippingCountry.findUnique({
      where: { countryCode },
    })

    if (!country) {
      return 0
    }

    const tier = await prisma.shippingWeightTier.findFirst({
      where: {
        countryCode,
        minWeight: { lte: billableWeight },
        maxWeight: { gte: billableWeight },
      },
      orderBy: {
        minWeight: 'desc',
      },
    })

    const baseRate = Number(country.baseRate)
    const defaultPricePerKg = Number(country.pricePerKg)

    if (Number.isNaN(baseRate) || Number.isNaN(defaultPricePerKg)) {
      return 0
    }

    const pricePerKg =
      tier && !Number.isNaN(Number(tier.pricePerKg))
        ? Number(tier.pricePerKg)
        : defaultPricePerKg

    const shippingCost = baseRate + billableWeight * pricePerKg

    return Math.ceil(shippingCost)
  } catch {
    return 0
  }
}
