import { z } from 'zod'

export type ImageBannerInput = z.infer<typeof imageBannerSchema>

export const imageBannerSchema = z.object({
  id: z.string().nullish(),
  url: z.string().nullish(),
  alt: z.string().nullish(),
  isActive: z.boolean(),
})
