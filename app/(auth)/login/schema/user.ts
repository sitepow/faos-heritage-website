import { z } from 'zod'

type UserLoginInput = z.infer<typeof userLoginSchema>
type UserRegisterInput = z.infer<typeof userRegisterSchema>

const userLoginSchema = z.object({
  email: z.email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

const userRegisterSchema = z
  .object({
    name: z.string().min(1, 'กรุณากรอกชื่อ'),
    email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้อง 6 ตัวขึ้นไป'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

export type { UserLoginInput, UserRegisterInput }
export { userLoginSchema, userRegisterSchema }
