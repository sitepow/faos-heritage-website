import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

import type { Role, ProductUnit, DiscountType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.join(process.cwd(), 'prisma', 'data')

  const loadJson = (fileName: string) => {
    const filePath = path.join(dataPath, fileName)
    if (!fs.existsSync(filePath)) {
      return []
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    return raw.trim() ? JSON.parse(raw) : []
  }

  const users = loadJson('User.json')
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        password: u.password,
        image: u.image,
        emailVerified: u.emailVerified ? new Date(u.emailVerified) : null,
        role: (u.role as Role) || 'CUSTOMER',
        isActive: u.isActive ?? true,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      },
    })
  }

  const categories = loadJson('Category.json')
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        image: c.image,
        isActive: c.isActive,
        parentId: c.parentId,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      },
    })
  }

  const products = loadJson('Product.json')
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        summary: p.shortDescription,
        description: p.description,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        price: p.price || 0,
        weight: p.weight || 0,
        stockQuantity: p.stockQuantity || 0,
        unit: (p.unit as ProductUnit) || 'UNIT',
        categoryId: p.categoryId,
        isActive: p.isActive,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    })
  }

  const localizations = loadJson('ProductLocalization.json')
  for (const l of localizations) {
    await prisma.productLocalization.upsert({
      where: {
        productId_languageCode: {
          productId: l.productId,
          languageCode: l.languageCode,
        },
      },
      update: {},
      create: {
        productId: l.productId,
        languageCode: l.languageCode,
        name: l.name,
        summary: l.shortDescription,
        description: l.description,
        metaTitle: l.metaTitle,
        metaDescription: l.metaDescription,
      },
    })
  }

  const variants = loadJson('ProductVariant.json')
  for (const v of variants) {
    await prisma.productVariant.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        productId: v.productId,
        name: v.name,
        price: v.price || 0,
        weight: v.weight || 0,
        stockQuantity: v.stockQuantity || 0,
        isActive: v.isActive,
        image: v.image,
        options: v.options || {},
      },
    })
  }

  const productImages = loadJson('ProductImage.json')
  for (const pi of productImages) {
    await prisma.productImage.upsert({
      where: { id: pi.id },
      update: {},
      create: {
        id: pi.id,
        productId: pi.productId,
        url: pi.url,
        alt: pi.alt,
        isPrimary: pi.isPrimary,
      },
    })
  }

  const addresses = loadJson('Address.json')
  for (const a of addresses) {
    await prisma.address.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        userId: a.userId,
        isDefault: a.isDefault,
        name: a.name,
        phone: a.phone,
        address: a.address,
        district: a.district,
        subDistrict: a.subDistrict,
        province: a.province,
        postalCode: a.postalCode,
        country: a.country,
        countryCode: a.countryCode,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      },
    })
  }

  const coupons = loadJson('Coupon.json')
  for (const cp of coupons) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {},
      create: {
        id: cp.id,
        code: cp.code,
        discountType: (cp.discountType as DiscountType) || 'FIXED',
        discountValue: cp.discountValue,
        minPurchase: cp.minPurchase || 0,
        maxDiscount: cp.maxDiscount || 0,
        startDate: new Date(cp.startDate),
        endDate: new Date(cp.endDate),
        isActive: cp.isActive,
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
