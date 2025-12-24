'use server'

import type { Prisma } from '@prisma/client'

import { addressSchema, type AddressInput } from './components/address/schema'

import { prisma } from '@/lib/prisma'
import { removeEmptyField } from '@/utils/object'

const EXECUTE_FIELD = {
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

export const createAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    await prisma.address.create({
      data: {
        ...(removeEmptyField(validatedData?.data) as Prisma.AddressCreateInput),
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export const getAddress = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('Please specify the user ID you wish to use')
    }

    const address = await prisma.address.findUnique({
      where: { userId: userId },
      select: EXECUTE_FIELD,
    })

    if (!address) {
      return null
    }

    return address
  } catch (error) {
    console.error(error)
  }
}

export const updateAddress = async (data: AddressInput) => {
  try {
    const validatedData = addressSchema.safeParse(data)

    if (!validatedData.success) {
      throw new Error(
        validatedData.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('Customer address ID not found')

    await prisma.address.update({
      data: payload,
      where: { id },
    })
  } catch (error) {
    console.error(error)
  }
}
