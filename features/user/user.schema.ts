import { Role } from '@prisma/client'
import { z } from 'zod'

const baseUserAdminSchema = z.object({
  id: z.string().optional(),
  email: z.string('รูปแบบอีเมลไม่ถูกต้อง').email('รูปแบบอีเมลไม่ถูกต้อง'),
  name: z.string('กรุณาระบุชื่อ-นามสกุล').min(1, 'กรุณาระบุชื่อ-นามสกุล'),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
  roles: z
    .array(z.enum(Role), { message: 'รูปแบบบทบาทไม่ถูกต้อง' })
    .default([Role.CUSTOMER]),
})

const userCreateAdminSchema = baseUserAdminSchema.extend({
  password: z
    .string('รหัสผ่านต้องเป็นข้อความ')
    .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
})

const userUpdateAdminSchema = baseUserAdminSchema.partial().extend({
  id: z.string('จำเป็นต้องมี ID').min(1, 'จำเป็นต้องมี ID'),
})

const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Please enter your password'),
})

const userRegisterSchema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type UserCreateInput = z.infer<typeof userCreateAdminSchema>
type UserUpdateInput = z.infer<typeof userUpdateAdminSchema>
type UserLoginInput = z.infer<typeof userLoginSchema>
type UserRegisterInput = z.infer<typeof userRegisterSchema>

export {
  userCreateAdminSchema,
  userUpdateAdminSchema,
  userLoginSchema,
  userRegisterSchema,
}

export type {
  UserCreateInput,
  UserUpdateInput,
  UserLoginInput,
  UserRegisterInput,
}
