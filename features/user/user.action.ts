'use server'

import { hash } from 'bcryptjs'

import type { UserCreateInput, UserUpdateInput } from './user.schema'
import type { Prisma, Role } from '@prisma/client'

import { userCreateSchema, userUpdateSchema } from './user.schema'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { omitEmptyFields } from '@/utils'

export const createUser = async (data: UserCreateInput) => {
  const validated = userCreateSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { email, password } = validated?.data ?? []

  if (!password || password.trim().length < 6) {
    return fail(ERROR_CODES.PASSWORD_TOO_SHORT)
  }

  const exists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (exists) {
    return fail(ERROR_CODES.EMAIL_ALREADY_USED)
  }

  const hashed = await hash(password!, 10)

  try {
    await prisma.user.create({
      data: {
        ...omitEmptyFields(validated?.data),
        password: hashed,
      } as Prisma.UserCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
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
      },
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
}

export const getUser = async (userId: string) => {
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

  if (!user) {
    return
  }

  return user
}

export const updateUser = async (data: UserUpdateInput) => {
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

  if (password && password.trim() !== '') {
    updateData.password = await hash(password, 10)
  }

  try {
    await prisma.user.update({
      data: updateData,
      where: { id },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteUser = async (userIds: string | string[]) => {
  const ids = Array.isArray(userIds) ? userIds : [userIds]

  if (!ids.length) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  try {
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
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getUserStat = async () => {
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
    { name: 'ผู้ใช้งานทั้งหมด', value: totalUsers },
    { name: 'ผู้ใช้งานปกติ', value: isActive },
    { name: 'ผู้ใช้งานถูกระงับบัญชี', value: unActive },
  ]
}

// 'use server'

// import { Role } from '@prisma/client'
// import { hash } from 'bcryptjs'

// import type { UserRegisterInput } from '../../app/[locale]/(auth)/login/schema'

// import { userRegisterSchema } from '../../app/[locale]/(auth)/login/schema'

// import { fail, ok } from '@/lib/errors'
// import { ERROR_CODES } from '@/lib/errors/error-codes'
// import { prisma } from '@/lib/prisma'

// const createUser = async (data: UserRegisterInput) => {
//   const validated = userRegisterSchema.safeParse(data)

//   if (!validated.success) return fail(ERROR_CODES.VALIDATION_ERROR)

//   const { name, email, password } = validated.data

//   const exists = await prisma.user.findUnique({
//     where: { email: email.toLowerCase() },
//   })

//   if (exists && !exists.password) {
//     return fail(ERROR_CODES.SOCIAL_ACCOUNT_EXISTS)
//   }

//   if (exists) {
//     return fail(ERROR_CODES.EMAIL_ALREADY_USED)
//   }

//   const hashed = await hash(password, 10)

//   try {
//     await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashed,
//         role: Role.CUSTOMER,
//       },
//     })
//   } catch {
//     return fail(ERROR_CODES.SYSTEM_ERROR)
//   }

//   return ok()
// }

// export { createUser }
