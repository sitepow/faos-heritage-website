import { Role } from '@prisma/client'
import { z } from 'zod'

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>

export const baseUserSchema = z.object({
  id: z.string().nullish(),
  email: z.email('The email format is incorrect.'),
  name: z.string().min(1, 'Please specify the username.'),
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
