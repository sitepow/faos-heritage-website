import { z } from 'zod'

type AddressInput = z.infer<typeof addressSchema>

const addressSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  phone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  district: z.string().min(1, 'กรุณากรอกเขต/อำเภอ'),
  subDistrict: z.string().nullish(),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  country: z.string().min(1, 'กรุณากรอกประเทศ'),
  postalCode: z.string().min(5, 'รหัสไปรษณีย์ไม่ถูกต้อง').max(5),
})

export type { AddressInput }
export { addressSchema }
