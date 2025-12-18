import { ProductUnit } from '@prisma/client'
import { z } from 'zod'

type ProductInput = z.infer<typeof productSchema>

const productSchema = z.object({
  id: z.string().nullish(),
  name: z
    .string('The product name must be a text.')
    .min(1, 'Please specify the product name (do not leave it blank).'),
  slug: z.string('The slug must be a valid text.').nullish(),
  sku: z.string().nullish(),
  barcode: z.string().nullish(),
  price: z
    .number('The price must be the correct figure.')
    .min(0, 'The price must be 0 or higher.'),
  compareAtPrice: z
    .number('The price before the discount must be the correct figure.')
    .nullish(),
  costPrice: z.number('The cost price must be an accurate figure.').nullish(),
  stockQuantity: z.number('The inventory quantity must be accurate.'),
  lowStockAlert: z
    .number('Low stock alerts require the correct number.')
    .nullish(),
  weight: z
    .number('The weight of the goods must be the correct figure.')
    .nullish(),
  categoryId: z.string('Please select a product category.').nullish(),
  shortDescription: z.string().nullish(),
  description: z.string().nullish(),
  metaTitle: z.string('The meta title must be valid text.').nullish(),
  metaDescription: z
    .string('The Meta Description must be valid text.')
    .nullish(),
  isActive: z.boolean(),
  useSeoFromBasicData: z.boolean(),
  isFeatured: z.boolean(),
  isDigitalProduct: z.boolean(),
  isDemoProduct: z.boolean(),
  unit: z.enum(ProductUnit),
})

export type { ProductInput }
export { productSchema }
