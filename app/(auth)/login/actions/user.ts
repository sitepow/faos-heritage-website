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
          'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
      )
    }

    const { name, email, password } = validatedData?.data

    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!exists?.password) {
      if (exists) {
        throw new Error(
          'ไม่สามารถสมัครบัญชีได้ เนื่องจากบัญชีนี้สมัครด้วย Google / Facebook กรุณาเข้าสู่ระบบด้วยวิธีเดิม',
        )
      }
    }

    if (exists) {
      throw new Error(
        'อีเมลนี้ถูกใช้ไปแล้ว กรุณาใช้อีเมลอื่นแล้วลองใหม่อีกครั้ง',
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
