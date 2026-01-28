import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

type DbClient = Prisma.TransactionClient | typeof prisma

const BannerRepository = {
  create(data: Prisma.BannerCreateInput) {
    return prisma.banner.create({ data })
  },

  findMany() {
    return prisma.banner.findMany({
      select: {
        id: true,
        url: true,
        alt: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findById(id: string) {
    return prisma.banner.findUnique({
      where: { id },
      select: {
        id: true,
        url: true,
        alt: true,
        isActive: true,
      },
    })
  },

  findForUpdate(id: string) {
    return prisma.banner.findUnique({
      where: { id },
      select: { url: true },
    })
  },

  update(id: string, data: Prisma.BannerUpdateInput, db: DbClient = prisma) {
    return db.banner.update({
      where: { id },
      data,
    })
  },

  deleteMany(ids: string[]) {
    return prisma.banner.deleteMany({
      where: { id: { in: ids } },
    })
  },

  findManyByIds(ids: string[]) {
    return prisma.banner.findMany({
      where: { id: { in: ids } },
      select: { url: true },
    })
  },
}

export { BannerRepository }
