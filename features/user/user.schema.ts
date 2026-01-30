import { Role } from '@prisma/client'
import { z } from 'zod'

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>

export const baseUserSchema = z.object({
  id: z.string().nullish(),
  email: z.email('The email format is incorrect.'),
  name: z.string().min(1, 'Please specify the name.'),
  image: z.string().nullish(),
  isActive: z.boolean(),
  role: z.enum(Role),
})

export const userCreateSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long.'),
})

export const userUpdateSchema = baseUserSchema.extend({
  password: z.string().min(6).optional().or(z.literal('')),
})

// type UserLoginInput = z.infer<typeof userLoginSchema>
// type UserRegisterInput = z.infer<typeof userRegisterSchema>

// const userLoginSchema = z.object({
//   email: z.email('Invalid email'),
//   password: z.string().min(1, 'Please enter your password'),
// })

// const userRegisterSchema = z
//   .object({
//     name: z.string().min(1, 'Please enter your name'),
//     email: z.email('Invalid email format'),
//     password: z.string().min(6, 'Password must be at least 6 characters'),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   })

// export { userRegisterSchema }

// export type { UserLoginInput, UserRegisterInput }
