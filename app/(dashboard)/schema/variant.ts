import { z } from 'zod'

type VariantInput = z.infer<typeof variantSchema>

const variantSchema = z.object({
  id: z.string().nullish(),
  productId: z.string().nullish(),
  name: z
    .string('The product name must be a text.')
    .min(1, 'Please specify the product name (do not leave it blank).'),
  sku: z.string().nullish(),
  price: z
    .number('The price must be the correct figure.')
    .min(0, 'The price must be 0 or higher.'),
  stockQuantity: z.number('The inventory quantity must be accurate.'),
  isActive: z.boolean(),
})

export type { VariantInput }
export { variantSchema }
