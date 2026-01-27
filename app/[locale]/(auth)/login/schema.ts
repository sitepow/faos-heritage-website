import { z } from 'zod'

type UserLoginInput = z.infer<typeof userLoginSchema>
type UserRegisterInput = z.infer<typeof userRegisterSchema>

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

export { userRegisterSchema }

export type { UserLoginInput, UserRegisterInput }
