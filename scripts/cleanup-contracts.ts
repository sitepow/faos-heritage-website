/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaClient, ContractStatus, StockMovementType } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const now = new Date()

  console.log(`[${now.toLocaleString()}] กำลังตรวจสอบสัญญาที่หมดอายุ...`)

  const expiredContracts = await prisma.contract.findMany({
    where: {
      status: ContractStatus.ACTIVE,
      endDate: {
        lt: now,
      },
    },
    include: {
      items: true,
      storefront: true,
    },
  })

  if (expiredContracts.length === 0) {
    console.log('ไม่พบสัญญาที่หมดอายุในขณะนี้')
    return
  }

  for (const contract of expiredContracts) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.contract.update({
          where: { id: contract.id },
          data: { status: ContractStatus.EXPIRED },
        })

        for (const item of contract.items) {
          const isVariant = !!item.variantId

          let basePrice = 0
          if (isVariant) {
            const v = await tx.productVariant.findUnique({
              where: { id: item.variantId! },
              select: { price: true },
            })
            basePrice = Number(v?.price ?? 0)
          } else {
            const p = await tx.product.findUnique({
              where: { id: item.productId },
              select: { price: true },
            })
            basePrice = Number(p?.price ?? 0)
          }

          await tx.storefrontInventory.updateMany({
            where: {
              storefrontId: contract.storefrontId,
              productId: item.productId,
              variantId: item.variantId || '',
            },
            data: {
              netPrice: basePrice,
              retailPrice: basePrice,
            },
          })

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              quantity: 0,
              type: StockMovementType.ADJUSTMENT,
              toStorefrontId: contract.storefrontId,
              reference: contract.id,
              note: `สัญญาหมดอายุ (#${contract.id.slice(-8).toUpperCase()}): ดีดราคาคืนเป็นราคามาตรฐานคลังหลัก (สาขา: ${contract.storefront.name})`,
            },
          })
        }
      })
    } catch (err) {
      console.error(`สัญญา ${contract.id}: เกิดข้อผิดพลาดในการประมวลผล`, err)
    }
  }
}

main()
  .catch((e) => {
    console.error('Critical Error in main():', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
