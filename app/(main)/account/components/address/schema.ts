import { z } from 'zod'

export type AddressInput = z.infer<typeof addressSchema>

export const addressSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, 'Please enter your name'),
  phone: z.string().min(1, 'Please enter your phone number'),
  address: z.string().min(1, 'Please enter your address'),
  district: z.string().min(1, 'Please enter the district/county'),
  subDistrict: z.string().nullish(),
  province: z.string().min(1, 'Please enter the province'),
  country: z.string().min(1, 'Please enter your country'),
  postalCode: z.string().min(5, 'The postal code is incorrect').max(5),
})
