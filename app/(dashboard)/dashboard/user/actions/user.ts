'use server'

import { hash } from 'bcryptjs'

import type { UserCreateInput, UserUpdateInput } from '../schema/user'
import type { Prisma, Role } from '@prisma/client'

import { userCreateSchema, userUpdateSchema } from '../schema/user'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

const EXECUTE_FIELD = {
  id: true,
  email: true,
  name: true,
  image: true,
  role: true,
  isActive: true,
}

const createUser = async (data: UserCreateInput) => {
  try {
    const validatedData = userCreateSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { email, password } = validatedData?.data

    if (!password || password.trim().length < 6) {
      throw new Error(
        'Please enter a password (must not be left blank) and it must be at least 6 characters long. Please try again.',
      )
    }

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (exists) {
      throw new Error(
        'This email address has already been used. Please use a different email address and try again.',
      )
    }

    const hashed = await hash(password!, 10)

    await prisma.user.create({
      data: {
        ...removeEmptyField(validatedData?.data),
        password: hashed,
      } as Prisma.UserCreateInput,
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: EXECUTE_FIELD,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    getPrismaError(error)
  }
}

const getUser = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('Please specify the user ID you wish to use.')
    }

    const variant = await prisma.user.findUnique({
      where: { id: userId },
      select: EXECUTE_FIELD,
    })

    if (!variant) {
      throw new Error('No user found.')
    }

    return variant
  } catch (error) {
    getPrismaError(error)
  }
}

const updateUser = async (data: UserUpdateInput) => {
  try {
    const validatedData = userUpdateSchema.safeParse(data)

    if (!validatedData.success) {
      throw new Error(
        validatedData.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, password, ...payload } = validatedData.data

    if (!id) throw new Error('No user found.')

    const updateData: Prisma.UserUpdateInput = {
      ...removeEmptyField(payload),
      role: payload?.role as Role,
    }

    if (password && password.trim() !== '') {
      updateData.password = await hash(password, 10)
    }

    await prisma.user.update({
      data: updateData,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteUser = async (userIds: string | string[]) => {
  try {
    const ids = Array.isArray(userIds) ? userIds : [userIds]

    if (!ids.length) {
      throw new Error('Please specify the user ID you wish to use.')
    }

    await prisma.user.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isActive: false,
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getUserDashboard = async () => {
  try {
    const [totalUsers, isActive, unActive] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { isActive: true },
      }),
      prisma.user.count({
        where: { isActive: false },
      }),
    ])

    return [
      { name: 'All users', value: totalUsers },
      { name: 'All users (Enable)', value: isActive },
      { name: 'All users (Disable)', value: unActive },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

export {
  createUser,
  deleteUser,
  getUserDashboard,
  getUser,
  getUsers,
  updateUser,
}
