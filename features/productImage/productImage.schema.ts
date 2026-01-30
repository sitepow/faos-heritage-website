import { z } from 'zod'

type ImageInput = z.infer<typeof imageSchema>

const imageSchema = z.object({
  id: z.string().nullish(),
  productId: z.string().nullish(),
  url: z.string().nullish(),
  alt: z.string().nullish(),
  isPrimary: z.boolean(),
})

export { imageSchema }
export type { ImageInput }
