import { z } from 'zod'

type AddressInput = z.infer<typeof addressSchema>

const addressSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(1, 'Please enter your name'),
  phone: z.string().min(1, 'Please enter your phone number'),
  address: z.string().min(1, 'Please enter your address'),
  district: z.string().min(1, 'Please enter the district/county'),
  subDistrict: z.string().nullish(),
  province: z.string().min(1, 'Please enter the province'),
  postalCode: z.string().min(5, 'The postal code is incorrect').max(5),
  country: z.string().min(2),
  countryCode: z.string().length(2, 'Please select the county'),
  isDefault: z.boolean(),
})

export { addressSchema }
export type { AddressInput }
