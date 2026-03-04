import { AffiliateStatus } from '@prisma/client'
import { z } from 'zod'

const affiliateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(AffiliateStatus),
})

const affiliateProfileSchema = z.object({
  bankName: z.string().min(1, 'กรุณาระบุชื่อธนาคาร'),
  bankAccountNo: z.string().min(1, 'กรุณาระบุเลขที่บัญชี'),
  phoneNumber: z.string().min(1, 'กรุณาระบุเบอร์โทรศัพท์ที่ติดต่อได้'),
  socialMedia: z.string().min(1, 'กรุณาระบุช่องทางโซเชียลมีเดีย'),
  idCardImage: z.string().min(1, 'กรุณาอัปโหลดสำเนาบัตรประชาชน'),
  bankAccountImage: z.string().min(1, 'กรุณาอัปโหลดสำเนาหน้าสมุดบัญชี'),
})

type AffiliateStatusInput = z.infer<typeof affiliateStatusSchema>
type AffiliateProfileInput = z.infer<typeof affiliateProfileSchema>

export { affiliateStatusSchema, affiliateProfileSchema }
export type { AffiliateStatusInput, AffiliateProfileInput }
