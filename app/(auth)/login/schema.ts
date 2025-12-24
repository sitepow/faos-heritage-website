import { z } from 'zod'

export type UserLoginInput = z.infer<typeof userLoginSchema>
export type UserRegisterInput = z.infer<typeof userRegisterSchema>

export const userLoginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Please enter your password'),
})

export const userRegisterSchema = z
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
