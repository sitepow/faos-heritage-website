'use server'

import { Role, type Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'

import type { UserCreateInput, UserUpdateInput } from './schema'

import { userCreateAdminSchema, userUpdateAdminSchema } from './schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

const createUser = async (data: UserCreateInput & { isRegister?: boolean }) => {
  const { isRegister, ...rest } = data

  const validated = userCreateAdminSchema.safeParse(rest)
  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { email, password, name, roles, isActive } = validated.data

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
        name,
        email: normalizedEmail,
        password: hashedPassword,
        isActive: isActive ?? true,
        roles: isRegister ? [Role.CUSTOMER] : roles || [Role.CUSTOMER],
      } satisfies Prisma.UserCreateInput,
    })

    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const updateUser = async (data: UserUpdateInput) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async () => {
    const validated = userUpdateAdminSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    const updateData = {
      ...omitEmptyFields(payload),
      roles: payload.roles as Role[] | undefined,
    }

    try {
      await prisma.user.update({
        where: { id },
        data: updateData satisfies Prisma.UserUpdateInput,
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
        roles: true,
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
      roles: true,
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
