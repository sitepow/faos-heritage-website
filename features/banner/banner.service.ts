import type { Prisma } from '@prisma/client'

import { BannerRepository } from './banner.repository'

import { deleteFile } from '@/app/actions/file'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'

const BannerService = {
  async create(data: Prisma.BannerCreateInput) {
    await BannerRepository.create(data)
  },

  findMany() {
    return BannerRepository.findMany()
  },

  findById(id: string) {
    return BannerRepository.findById(id)
  },

  async update(id: string, updates: Prisma.BannerUpdateInput) {
    let oldImagePath: string | null = null

    await prisma.$transaction(async (tx) => {
      const banner = await BannerRepository.findForUpdate(id)

      if (!banner) {
        throw new Error(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (updates.url && updates.url !== banner.url) {
        oldImagePath = banner.url
      }

      await BannerRepository.update(id, updates, tx)
    })

    if (oldImagePath) {
      await deleteFile(oldImagePath)
    }
  },

  async deleteMany(ids: string[]) {
    const banners = await BannerRepository.findManyByIds(ids)

    await BannerRepository.deleteMany(ids)

    await Promise.all(
      banners
        .map((b) => b.url)
        .filter(Boolean)
        .map(deleteFile),
    )
  },
}

export { BannerService }
