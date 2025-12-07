import { Role } from '@prisma/client'
import { z } from 'zod'

type UserCreateInput = z.infer<typeof userCreateSchema>
type UserUpdateInput = z.infer<typeof userUpdateSchema>

const baseUserSchema = z.object({
  id: z.string().nullish(),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
  name: z.string().nullish(),
  image: z.string().nullish(),
  isActive: z.boolean(),
  role: z.enum(Role),
})

const userCreateSchema = baseUserSchema.extend({
  password: z.string().min(6, 'รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร'),
})

const userUpdateSchema = baseUserSchema.extend({
  password: z.string().min(6).optional().or(z.literal('')),
})

export type { UserCreateInput, UserUpdateInput }
export { userCreateSchema, userUpdateSchema }
