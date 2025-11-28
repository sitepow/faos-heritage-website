import { z } from 'zod'

export const imageSchema = z.object({
  id: z.string().nullish(),
  productId: z.string().nullish(),
  url: z.string().nullish(),
  alt: z.string().nullish(),
  isPrimary: z.boolean(),
})

export type ImageInput = z.infer<typeof imageSchema>
