import { Role } from '@prisma/client'
import { z } from 'zod'

const baseUserSchema = z.object({
  id: z.string().optional(),
  email: z.email('The email format is incorrect.'),
  name: z.string().min(1, 'Please specify the name.'),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
  role: z.enum(Role).default(Role.CUSTOMER),
})

const userCreateSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
})

const userUpdateSchema = baseUserSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
})

const userLoginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Please enter your password'),
})

const userRegisterSchema = z
  .object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

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
