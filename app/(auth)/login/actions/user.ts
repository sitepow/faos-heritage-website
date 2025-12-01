'use server'

import { getPrismaError, prisma } from '@/utils/prisma'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import { userRegisterSchema, type UserRegisterInput } from '../schema/user'

const createUser = async (data: UserRegisterInput) => {
  try {
    const validatedData = userRegisterSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ?? 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
      )
    }

    const { name, email, password } = validatedData?.data

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (exists) {
      throw new Error('อีเมลนี้ถูกใช้ไปแล้ว โปรดใช้อีเมลอื่น')
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
