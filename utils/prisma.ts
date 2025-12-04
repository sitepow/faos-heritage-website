import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const getPrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target as string[] | undefined
        const field = target?.[0] ?? 'ข้อมูลนี้'

        throw new Error(`${field} มีอยู่ในระบบแล้ว โปรดลองใหม่อีกครั้ง`)
      }

      case 'P2025':
        throw new Error('ไม่พบข้อมูลที่ต้องการ โปรดลองใหม่อีกครั้ง')

      case 'P2003':
        throw new Error('ข้อมูลอ้างอิงไม่ถูกต้อง โปรดลองใหม่อีกครั้ง')

      default:
        throw new Error(error.message)
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('ข้อมูลไม่ถูกต้อง โปรดลองใหม่อีกครั้ง')
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูล')
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new Error(`เกิดข้อผิดพลาด: ${error.message}`)
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
}
