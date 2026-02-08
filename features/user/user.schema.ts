import { Role } from '@prisma/client'
import { z } from 'zod'

// --- Base Schema ---
// Senior Tip: แยกส่วนที่ต้องมีแน่นอน กับส่วนที่มีเฉพาะตอน Admin จัดการ
const baseUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('The email format is incorrect.'),
  name: z.string().min(1, 'Please specify the name.'),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
  role: z.nativeEnum(Role).default(Role.CUSTOMER), // ใช้ nativeEnum สำหรับ Prisma Enum
})

// --- Create (Admin) ---
const userCreateSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
})

// --- Update (Profile/Admin) ---
const userUpdateSchema = baseUserSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
  password: z.string().min(6).optional().or(z.literal('')),
})

// --- Login ---
const userLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Please enter your password'),
})

// --- Register (Public) ---
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

// --- Types ---
type UserCreateInput = z.infer<typeof userCreateSchema>
type UserUpdateInput = z.infer<typeof userUpdateSchema>
type UserLoginInput = z.infer<typeof userLoginSchema>
type UserRegisterInput = z.infer<typeof userRegisterSchema>

export {
  baseUserSchema,
  userCreateSchema,
  userUpdateSchema,
  userLoginSchema,
  userRegisterSchema,
}

export type {
  UserCreateInput,
  UserUpdateInput,
  UserLoginInput,
  UserRegisterInput,
}
