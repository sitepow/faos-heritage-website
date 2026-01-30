'use server'

import type { Prisma } from '@prisma/client'

import { BannerService } from './banner.service'
import { bannerSchema, type BannerInput } from './schema'

import { fail, ok, type ActionResult } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { omitEmptyFields } from '@/utils'

const createBanner = async (
  input: BannerInput,
): Promise<ActionResult<void>> => {
  const parsed = bannerSchema.safeParse(input)
  if (!parsed.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await BannerService.create(
      omitEmptyFields(parsed.data) as Prisma.BannerCreateInput,
    )
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const getBanners = () => {
  return BannerService.findMany()
}

const getBannerById = (id: string) => {
  if (!id) {
    return null
  }

  return BannerService.findById(id)
}

const updateBanner = async (
  input: BannerInput,
): Promise<ActionResult<void>> => {
  const parsed = bannerSchema.safeParse(input)
  if (!parsed.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...updates } = parsed.data
  if (!id) {
    return fail(ERROR_CODES.FIELD_REQUIRED)
  }

  try {
    await BannerService.update(id, updates as Prisma.BannerUpdateInput)
    return ok()
  } catch (error) {
    if ((error as Error).message === ERROR_CODES.DATA_NOT_FOUND) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const deleteBanners = async (
  bannerIds: string | string[],
): Promise<ActionResult<void>> => {
  const ids = Array.isArray(bannerIds) ? bannerIds : [bannerIds]
  if (!ids.length) {
    return fail(ERROR_CODES.FIELD_REQUIRED)
  }

  try {
    await BannerService.deleteMany(ids)
    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

export { createBanner, getBanners, getBannerById, updateBanner, deleteBanners }
