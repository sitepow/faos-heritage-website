import { Prisma } from '@prisma/client'

export const getPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        throw new Error('ข้อมูลยาวเกินไป กรุณาลดความยาวของข้อมูล')

      case 'P2001':
        throw new Error('ไม่พบข้อมูลที่ต้องการ')

      case 'P2002': {
        const target = error.meta?.target as string[] | undefined

        const fieldNames: Record<string, string> = {
          email: 'อีเมล',
          provider_providerAccountId: 'บัญชีผู้ให้บริการ',
          sessionToken: 'Session Token',
          identifier_token: 'Token การยืนยัน',
          token: 'Token',
          sku: 'รหัสสินค้า (SKU)',
          barcode: 'บาร์โค้ด',
          userId_productId: 'สินค้าในตะกร้า',
          orderNumber: 'เลขที่ออเดอร์',
          code: 'รหัสคูปอง',
        }

        if (target?.length) {
          const fieldName = fieldNames[target[0]] || target[0]

          throw new Error(`${fieldName} นี้มีอยู่ในระบบแล้ว กรุณาใช้ข้อมูลอื่น`)
        }

        throw new Error(`ข้อมูลซ้ำ (unique constraint) - รายละเอียด: ${JSON.stringify(error.meta)}`)
      }

      case 'P2003': {
        const field = error.meta?.field_name

        throw new Error(
          field ? `ข้อมูล ${field} ไม่ถูกต้อง (foreign key ผิด)` : 'ข้อมูลอ้างอิงไม่ถูกต้อง',
        )
      }

      case 'P2004':
        throw new Error('ผิด constraint ที่กำหนดไว้ในฐานข้อมูล')

      case 'P2011': {
        const target = error.meta?.target as string[] | undefined
        const field = target?.[0] || 'ข้อมูลบางฟิลด์'

        throw new Error(`${field} เป็นข้อมูลที่จำเป็น`)
      }

      case 'P2012': {
        const path = error.meta?.path

        throw new Error(path ? `ข้อมูล ${path} จำเป็นต้องมี` : 'ข้อมูลบางอย่างขาดหายไป')
      }

      case 'P2014':
        throw new Error('ข้อผิดพลาดของความสัมพันธ์ข้อมูล')

      case 'P2015':
        throw new Error('ไม่พบข้อมูลที่เกี่ยวข้อง')

      case 'P2016':
        throw new Error('เกิดข้อผิดพลาดภายใน Prisma Engine')

      case 'P2018':
        throw new Error('ไม่พบข้อมูลที่เชื่อมโยง')

      case 'P2025':
        throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข')

      case 'P2028':
        throw new Error('เกิดข้อผิดพลาดในการทำธุรกรรม')

      default:
        throw new Error(
          `Prisma Error (${error.code}): ${error.message} | meta: ${JSON.stringify(error.meta)}`,
        )
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('ข้อมูลไม่ถูกต้องตาม schema ที่กำหนด')
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new Error('เชื่อมต่อฐานข้อมูลไม่ได้ กรุณาตรวจสอบการตั้งค่า')
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new Error('Prisma Engine ล้มเหลว (Rust Panic)')
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new Error(`ข้อผิดพลาดที่ไม่ทราบสาเหตุ: ${error.message}`)
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error(`Unknown error: ${JSON.stringify(error)}`)
}
