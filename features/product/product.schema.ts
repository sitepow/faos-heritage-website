import { ProductUnit } from '@prisma/client'
import { z } from 'zod'

const productSchema = z
  .object({
    id: z.string().nullish(),

    name: z.string().min(1, 'nameRequired'),
    slug: z.string().nullish(),
    sku: z.string().nullish(),
    barcode: z.string().nullish(),

    price: z.number('priceInvalid').min(0, 'priceMin'),
    compareAtPrice: z.number('priceInvalid').nullish(),
    costPrice: z.number('priceInvalid').nullish(),

    stockQuantity: z.number('stockInvalid').min(0, 'stockMin'),
    lowStockAlert: z.number('stockInvalid').nullish(),
    weight: z.number('weightInvalid').nullish(),
    unit: z.enum(ProductUnit),

    categoryId: z.string().min(1, 'categoryRequired').nullish(),
    shortDescription: z.string().nullish(),
    description: z.string().nullish(),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isDigitalProduct: z.boolean().default(false),
    isDemoProduct: z.boolean().default(false),
    isPremiumProduct: z.boolean().default(false),
    isAuthentic: z.boolean().default(true),

    useSeoFromBasicData: z.boolean().default(true),
    metaTitle: z.string().nullish(),
    metaDescription: z.string().nullish(),
  })
  .refine(
    (data) => {
      if (data.compareAtPrice && data.compareAtPrice < data.price) {
        return false
      }
      return true
    },
    {
      message: 'comparePriceError',
      path: ['compareAtPrice'],
    },
  )

type ProductInput = z.infer<typeof productSchema>

export { productSchema }
export type { ProductInput }
