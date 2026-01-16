import { z } from 'zod'

export const productLocalizationSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'productId is required'),
  languageCode: z.string().min(2).max(5),
  name: z.string().min(1, 'name is required'),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
})

export type ProductLocalizationInput = z.infer<typeof productLocalizationSchema>
