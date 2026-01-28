import { z } from 'zod'

const bannerSchema = z.object({
  id: z.string().nullish(),
  url: z.string().nullish(),
  alt: z.string().nullish(),
  isActive: z.boolean(),
})

type BannerInput = z.infer<typeof bannerSchema>

export { bannerSchema }
export type { BannerInput }
