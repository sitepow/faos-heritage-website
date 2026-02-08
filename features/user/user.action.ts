'use server'

import { Role, type Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

import type { UserUpdateInput } from './user.schema'

import {
  userCreateSchema,
  userUpdateSchema,
  type UserCreateInput,
} from './user.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

const createUser = async (data: UserCreateInput & { isRegister?: boolean }) => {
  const { isRegister, ...rest } = data

  const validated = userCreateSchema.safeParse(rest)
  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { email, password } = validated.data

  if (!password || password.trim().length < 6) {
    return fail(ERROR_CODES.PASSWORD_TOO_SHORT)
  }

  const normalizedEmail = email.toLowerCase()
  const exists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  if (exists) {
    if (!exists.password) {
      return fail(ERROR_CODES.SOCIAL_ACCOUNT_EXISTS)
    }

    return fail(ERROR_CODES.EMAIL_ALREADY_USED)
  }

  const hashedPassword = await hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        ...omitEmptyFields(validated.data),
        email: normalizedEmail,
        password: hashedPassword,
        role: isRegister
          ? Role.CUSTOMER
          : (validated.data.role as Role) || Role.CUSTOMER,
      } as Prisma.UserCreateInput,
    })

    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const updateUser = async (data: UserUpdateInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = userUpdateSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, password, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    const updateData: Prisma.UserUpdateInput = {
      ...omitEmptyFields(payload),
      role: payload?.role as Role,
    }

    if (password && password.trim().length >= 6) {
      updateData.password = await hash(password, 10)
    }

    try {
      await prisma.user.update({
        where: { id },
        data: updateData,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteUser = async (userIds: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    const ids = Array.isArray(userIds) ? userIds : [userIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      await prisma.user.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      isActive: true,
    },
  })
  return user || null
}

const getUserStat = async () => {
  const [total, active, inactive] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
  ])

  return [
    { name: 'ผู้ใช้งานทั้งหมด', value: total },
    { name: 'ผู้ใช้งานปกติ', value: active },
    { name: 'ผู้ใช้งานถูกระงับบัญชี', value: inactive },
  ]
}

export { createUser, getUsers, getUser, updateUser, deleteUser, getUserStat }
