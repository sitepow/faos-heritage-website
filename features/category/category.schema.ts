import { z } from 'zod'

type CategoryInput = z.infer<typeof categorySchema>

const categorySchema = z.object({
  id: z.string().nullish(),
  name: z
    .string('The category name must be text.')
    .min(1, 'Please specify the category name (do not leave it blank).'),
  slug: z.string().nullish(),
  image: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
})

export { categorySchema }
export type { CategoryInput }
