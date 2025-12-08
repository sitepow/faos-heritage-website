'use server'

import type { Prisma } from '@prisma/client'

import { addressSchema, type AddressInput } from '../schema/address'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

const SELECTED_FIELD = {
  id: true,
  name: true,
  userId: true,
  phone: true,
  address: true,
  district: true,
  subDistrict: true,
  province: true,
  country: true,
  postalCode: true,
}

export type GetAddressResult = Awaited<ReturnType<typeof getAddress>>

const createAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
      )
    }

    await prisma.address.create({
      data: {
        ...(removeEmptyField(validatedData?.data) as Prisma.AddressCreateInput),
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getAddress = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('โปรดระบุไอดีผู้ใช้งานที่ต้องการ')
    }

    const address = await prisma.address.findUnique({
      where: { userId: userId },
      select: SELECTED_FIELD,
    })

    if (!address) {
      return null
    }

    return address
  } catch (error) {
    getPrismaError(error)
  }
}

const updateAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData.success) {
      throw new Error(
        validatedData.error?.issues[0]?.message ??
          'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('ไม่พบไอดีที่อยู่ของลูกค้า')

    await prisma.address.update({
      data: payload,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

export { createAddress, updateAddress, getAddress }
