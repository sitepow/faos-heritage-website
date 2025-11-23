import { Prisma } from '@prisma/client'

const getPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2000') {
      throw new Error('ข้อมูลยาวเกินไป กรุณาลดความยาวของข้อมูล')
    }

    if (error.code === 'P2001') {
      throw new Error('ไม่พบข้อมูลที่ต้องการ')
    }

    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined

      if (target && target.length > 0) {
        const fieldNames: Record<string, string> = {
          email: 'อีเมล',
          provider_providerAccountId: 'บัญชีผู้ให้บริการ',
          sessionToken: 'Session Token',
          identifier_token: 'Token การยืนยัน',
          token: 'Token',
          slug: 'Slug หมวดหมู่',
          sku: 'รหัสสินค้า (SKU)',
          barcode: 'บาร์โค้ด',
          userId_productId: 'สินค้าในตะกร้า',
          orderNumber: 'เลขที่ออเดอร์',
          code: 'รหัสคูปอง',
        }

        const fieldName = fieldNames[target[0]] || target[0]

        throw new Error(`${fieldName} นี้มีอยู่ในระบบแล้ว กรุณาใช้ข้อมูลอื่น`)
      }

      throw new Error('ข้อมูลนี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบข้อมูลที่ห้ามซ้ำ')
    }

    if (error.code === 'P2003') {
      const field = error.meta?.field_name as string | undefined

      throw new Error(
        field
          ? `ข้อมูล ${field} ไม่ถูกต้อง กรุณาตรวจสอบความสัมพันธ์ของข้อมูล`
          : 'ข้อมูลที่อ้างอิงไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
      )
    }

    if (error.code === 'P2004') {
      throw new Error('ข้อมูลไม่ถูกต้องตามเงื่อนไขที่กำหนด')
    }

    if (error.code === 'P2011') {
      const target = error.meta?.target as string[] | undefined
      const field = target?.[0] || 'บางฟิลด์'

      throw new Error(`${field} เป็นข้อมูลที่จำเป็น กรุณากรอกข้อมูล`)
    }

    if (error.code === 'P2012') {
      const path = error.meta?.path as string | undefined

      throw new Error(
        path
          ? `ข้อมูล ${path} เป็นข้อมูลที่จำเป็น กรุณากรอกข้อมูล`
          : 'ข้อมูลบางอย่างขาดหายไป กรุณาตรวจสอบอีกครั้ง',
      )
    }

    if (error.code === 'P2014') {
      throw new Error('ความสัมพันธ์ของข้อมูลไม่ถูกต้อง')
    }

    if (error.code === 'P2015') {
      throw new Error('ไม่พบข้อมูลที่เกี่ยวข้อง กรุณาตรวจสอบอีกครั้ง')
    }

    if (error.code === 'P2016') {
      throw new Error('เกิดข้อผิดพลาดในการประมวลผลข้อมูล')
    }

    if (error.code === 'P2018') {
      throw new Error('ไม่พบข้อมูลที่เชื่อมโยงที่จำเป็น')
    }

    if (error.code === 'P2025') {
      throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข')
    }

    if (error.code === 'P2028') {
      throw new Error('เกิดข้อผิดพลาดในการทำธุรกรรม กรุณาลองใหม่อีกครั้ง')
    }

    throw new Error(`เกิดข้อผิดพลาด: ${error.code} - ${error.message}`)
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบรูปแบบข้อมูลอีกครั้ง')
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ')
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    throw new Error('เกิดข้อผิดพลาดร้ายแรงในระบบ กรุณาติดต่อผู้ดูแลระบบ')
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new Error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง')
  }

  if (error instanceof Error) {
    throw new Error(error.message)
  }

  throw new Error('เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง')
}

export { getPrismaError }
