import { PrismaClient, ProductUnit } from '@prisma/client'
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
            weight: 0.25,
            stockQuantity: 50,
            isActive: true,
            options: { size: '250ml', material: 'Glass' },
          },
          {
            name: '500ml Bottle',
            price: 850.0,
            weight: 0.5,
            stockQuantity: 30,
            isActive: true,
            options: { size: '500ml', material: 'Glass' },
          },
          {
            name: '1L Bottle',
            price: 1500.0,
            weight: 1.0,
            stockQuantity: 15,
            isActive: true,
            options: { size: '1L', material: 'Glass' },
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
