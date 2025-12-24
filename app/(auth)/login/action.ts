'use server'

import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'

import type { UserRegisterInput } from './schema'

import { userRegisterSchema } from './schema'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'

export const createUser = async (data: UserRegisterInput) => {
  const validated = userRegisterSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { name, email, password } = validated.data

  const exists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (exists && !exists.password) {
    return fail(ERROR_CODES.SOCIAL_ACCOUNT_EXISTS)
  }

  if (exists) {
    return fail(ERROR_CODES.EMAIL_ALREADY_USED)
  }

  const hashed = await hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: Role.CUSTOMER,
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}
