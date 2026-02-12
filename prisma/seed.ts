import { Currency, PrismaClient, ProductUnit } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const oliveOilCategory = await prisma.category.create({
    data: {
      name: 'Olive Oil',
      isActive: true,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Organic Extra Virgin Olive Oil',
      summary: 'Premium quality organic olive oil from Greece.',
      price: 850.0,
      unit: ProductUnit.BOTTLE,
      categoryId: oliveOilCategory.id,
      isActive: true,
      localizations: {
        create: [
          {
            languageCode: 'th',
            name: 'น้ำมันมะกอกออร์แกนิค Extra Virgin',
            summary: 'น้ำมันมะกอกคุณภาพเยี่ยมจากกรีซ',
            description:
              'สกัดเย็นจากมะกอกออร์แกนิค 100% เหมาะสำหรับปรุงอาหารและสุขภาพ',
          },
          {
            languageCode: 'it',
            name: "Olio d'oliva biologico",
            summary: "Olio d'oliva biologico di alta qualità dalla Grecia",
            description: 'Olio extra vergine di oliva pressato a freddo.',
          },
        ],
      },
      variants: {
        create: [
          {
            name: '250ml Bottle',
            price: 450.0,
            weight: 580.0,
            stockQuantity: 50,
            isActive: true,
            options: { size: '250ml', material: 'Glass' },
          },
          {
            name: '500ml Bottle',
            price: 850.0,
            weight: 1050.0,
            stockQuantity: 30,
            isActive: true,
            options: { size: '500ml', material: 'Glass' },
          },
          {
            name: '1L Bottle',
            price: 1500.0,
            weight: 1850.0,
            stockQuantity: 15,
            isActive: true,
            options: { size: '1L', material: 'Glass' },
          },
        ],
      },
    },
  })

  const shippingData = [
    {
      countryCode: 'TH',
      countryName: 'Thailand',
      baseRate: 45.0,
      pricePerKg: 55.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'US',
      countryName: 'United States',
      baseRate: 300.0,
      pricePerKg: 480.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'IS',
      countryName: 'Iceland',
      baseRate: 350.0,
      pricePerKg: 550.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'ID',
      countryName: 'Indonesia',
      baseRate: 160.0,
      pricePerKg: 220.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'VN',
      countryName: 'Vietnam',
      baseRate: 140.0,
      pricePerKg: 200.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'MY',
      countryName: 'Malaysia',
      baseRate: 120.0,
      pricePerKg: 180.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'SG',
      countryName: 'Singapore',
      baseRate: 130.0,
      pricePerKg: 190.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'CN',
      countryName: 'China',
      baseRate: 200.0,
      pricePerKg: 280.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'JP',
      countryName: 'Japan',
      baseRate: 220.0,
      pricePerKg: 320.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'GR',
      countryName: 'Greece',
      baseRate: 300.0,
      pricePerKg: 450.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'IT',
      countryName: 'Italy',
      baseRate: 280.0,
      pricePerKg: 420.0,
      currency: Currency.THB,
    },
    {
      countryCode: 'NL',
      countryName: 'Netherlands',
      baseRate: 260.0,
      pricePerKg: 400.0,
      currency: Currency.THB,
    },
  ]

  for (const item of shippingData) {
    await prisma.shippingCountry.upsert({
      where: { countryCode: item.countryCode },
      update: {
        baseRate: item.baseRate,
        pricePerKg: item.pricePerKg,
        currency: item.currency,
      },
      create: {
        countryCode: item.countryCode,
        countryName: item.countryName,
        baseRate: item.baseRate,
        pricePerKg: item.pricePerKg,
        currency: item.currency,
        isActive: true,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
