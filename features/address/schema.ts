import { z } from 'zod'

const addressSchema = z.object({
  id: z.string().optional(),
  userId: z
    .string('กรุณาระบุรหัสผู้ใช้งาน')
    .min(1, 'กรุณาระบุรหัสผู้ใช้งาน')
    .optional(),
  name: z.string('กรุณาระบุชื่อผู้รับ').min(1, 'กรุณาระบุชื่อผู้รับ'),
  phone: z.string('กรุณาระบุเบอร์โทรศัพท์').min(1, 'กรุณาระบุเบอร์โทรศัพท์'),
  address: z
    .string('กรุณาระบุรายละเอียดที่อยู่')
    .min(1, 'กรุณาระบุรายละเอียดที่อยู่'),
  district: z.string('กรุณาระบุอำเภอ/เขต').min(1, 'กรุณาระบุอำเภอ/เขต'),
  subDistrict: z.string().nullish(),
  province: z.string('กรุณาระบุจังหวัด').min(1, 'กรุณาระบุจังหวัด'),
  postalCode: z
    .string('รหัสไปรษณีย์ไม่ถูกต้อง')
    .min(5, 'รหัสไปรษณีย์ต้องมี 5 หลัก')
    .max(5, 'รหัสไปรษณีย์ต้องมี 5 หลัก'),
  country: z.string().min(2, 'กรุณาระบุประเทศ'),
  countryCode: z.string().length(2, 'กรุณาเลือกประเทศ'),
  isDefault: z.boolean().default(false),
})

type AddressInput = z.infer<typeof addressSchema>

export { addressSchema }
export type { AddressInput }
