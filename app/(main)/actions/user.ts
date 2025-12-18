'use server'

import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'

import { userRegisterSchema, type UserRegisterInput } from '../schema/user'

import { getPrismaError, prisma } from '@/utils/prisma'

const createUser = async (data: UserRegisterInput) => {
  try {
    const validatedData = userRegisterSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { name, email, password } = validatedData?.data

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!exists?.password) {
      if (exists) {
        throw new Error(
          'You cannot register an account because this account was already registered with Google/Facebook. Please log in using the same method you used before',
        )
      }
    }

    if (exists) {
      throw new Error(
        'This email address has already been used. Please use a different email address and try again',
      )
    }

    const hashed = await hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: Role.CUSTOMER,
      },
    })

    return {
      email,
      password,
    }
  } catch (error) {
    getPrismaError(error)
  }
}

export { createUser }
